
# Dependencies
Formwatcher = require "./formwatcher"
bonzo = require "bonzo"
qwery = require "qwery"
reqwest = require "reqwest"
bean = require "bean"



# The selector for all input types
inputSelector = "input, textarea, select, button"


# ## The Watcher class
#
# This is the class that gets instantiated for each form.
class Watcher
  constructor: (form, options) ->
    @bonzoForm = if typeof form is "string" then bonzo(qwery(form)) else bonzo(form)

    if @bonzoForm.length < 1
      throw "Form element not found."
    else if @bonzoForm.length > 1
      throw "More than one form was found."
    else if @bonzoForm.get(0).nodeName isnt "FORM"
      throw "The element was not a form."

    @form = @bonzoForm[0]

    @allElements = [ ]
    @id = Formwatcher.currentWatcherId++
    Formwatcher.add @
    @observers = { }

    # Putting the watcher object in the form element.
    @bonzoForm.fwData "watcher", @
    @bonzoForm.fwData("originalAction", @bonzoForm.attr("action") or "").attr "action", "javascript:undefined;"
    @options = Formwatcher.deepExtend { }, Formwatcher.defaultOptions, options or { }
    @decorators = [ ]
    @validators = [ ]

    @decorators.push new Decorator @ for Decorator in Formwatcher.decorators
    @validators.push new Validator @ for Validator in Formwatcher.validators


    @options.ajaxMethod = @bonzoForm.attr("method")?.toLowerCase() if @options.ajaxMethod == null

    switch @options.ajaxMethod
      when "post", "put", "delete"
        # Everything fine
      else
        # I'm using get as the default since it's the default for forms.
        @options.ajaxMethod = "get"

    @observe "submit", @options.onSubmit
    @observe "success", @options.onSuccess
    @observe "error", @options.onError
    @observe "complete", @options.onComplete

    for input in qwery(inputSelector, @form)
      binput = bonzo input
      unless binput.fwData("initialized")
        if binput.attr("type") is "hidden"
          binput.fwData "forceSubmission", true
        else
          elements = Formwatcher.decorate @, input
          if elements.input isnt input
            bonzo(elements.input).attr "class", binput.attr("class")
            input = elements.input
            binput = bonzo elements.input

          unless elements.label
            label = Formwatcher.getLabel elements, @options.automatchLabel
            elements.label = label if label

          unless elements.errors
            errorsElement = Formwatcher.getErrorsElement elements, true
            elements.errors = errorsElement

          @allElements.push elements
          binput.fwData "validators", []
          for validator in @validators
            if validator.accepts input, @
              Formwatcher.debug "Validator '#{validator.name}' found for input field '#{binput.attr("name")}'."
              binput.fwData("validators").push validator

          Formwatcher.storeInitialValue elements
          if binput.val() is null or not binput.val()
            bonzo(element).addClass "empty" for i, element of elements

          Formwatcher.removeName elements unless @options.submitUnchanged

          onchangeFunction = => Formwatcher.changed elements, @
          validateElementsFunction = => @validateElements elements, true

          for i, element of elements
            do (element) ->
              bean.on element, "focus", => bonzo(element).addClass "focus"
              bean.on element, "blur", => bonzo(element).removeClass "focus"
              bean.on element, "change", onchangeFunction
              bean.on element, "blur", onchangeFunction
              bean.on element, "keyup", validateElementsFunction

    submitButtons = qwery "input[type=submit], button[type=''], button[type='submit'], button:not([type])", @form
    hiddenSubmitButtonElement = bonzo.create('<input type="hidden" name="" value="" />')[0]

    @bonzoForm.append hiddenSubmitButtonElement

    for element in submitButtons
      do (element) =>
        belement = bonzo element
        bean.on element, "click", (e) =>
          if element.tagName == "BUTTON"
            # That's a IE7 bugfix: The `value` attribute of buttons in IE7 is always the content if a content is present.
            tmpElementText = belement.text()
            belement.text ""
            elementValue = belement.val() ? ""
            belement.text tmpElementText
          else
            elementValue = belement.val() ? ""

          # The submit buttons click events are always triggered if a user presses ENTER inside an input field.
          bonzo(hiddenSubmitButtonElement).attr("name", belement.attr("name") or "").val elementValue
          @submitForm()
          e.stopPropagation()

  callObservers: (eventName, args...) ->
    observer.apply @, args for observer in @observers[eventName]

  observe: (eventName, func) ->
    @observers[eventName] = []  if @observers[eventName] is `undefined`
    @observers[eventName].push func
    @

  stopObserving: (eventName, func) ->
    @observers[eventName] = (observer for observer in @observers[eventName] when observer isnt func)
    @

  enableForm: -> bonzo(qwery(inputSelector, @form)).removeAttr "disabled"

  disableForm: -> bonzo(qwery(inputSelector, @form)).attr "disabled", "disabled"

  submitForm: (e) ->
    if not @options.validate or @validateForm()
      @callObservers "submit"

      # Do submit
      @bonzoForm.addClass "submitting"
      if @options.ajax
        @disableForm()
        @submitAjax()
      else
        @bonzoForm.attr "action", @bonzoForm.fwData("originalAction")
        setTimeout =>
          @form.submit()
          @disableForm()
        , 1
        false

  validateForm: ->
    validated = true

    # Not using _.detect() here, because I want every element to be inspected, even
    # if the first one fails.
    for elements in @allElements
      validated = false unless @validateElements(elements)

    validated


  # `inlineValidating` specifies whether the user is still in the element, typing.
  validateElements: (elements, inlineValidating) ->
    input = bonzo elements.input
    validated = true
    if input.fwData("validators").length
      # Only revalidated if the value has changed
      if not inlineValidating or not input.fwData("lastValidatedValue") or input.fwData("lastValidatedValue") isnt input.val()
        input.fwData "lastValidatedValue", input.val()
        Formwatcher.debug "Validating input " + input.attr("name")
        input.fwData "validationErrors", []

        for validator in input.fwData "validators"

          if input.val() is "" and validator.name isnt "Required"
            Formwatcher.debug "Validating " + validator.name + ". Field was empty so continuing."
            continue

          Formwatcher.debug "Validating " + validator.name
          validationOutput = validator.validate(validator.sanitize(input.val()), input)
          if validationOutput isnt true
            validated = false
            input.fwData("validationErrors").push validationOutput
            break

        if validated
          bonzo(elements.errors).html("").hide()
          for own i, element of elements
            bonzo(element)
              .addClass("validated")
              .removeClass("error")

          # When we remove an error during inline editing, the error has to
          # be shown again when the user leaves the input field, even if
          # the actual value has not changed.
          elements.input.fwData "forceValidationOnChange", true  if inlineValidating

        else

          bonzo(element).removeClass "validated" for own i, element of elements

          unless inlineValidating
            bonzo(elements.errors).html(input.fwData("validationErrors").join("<br />")).show()
            bonzo(element).addClass "error" for own i, element of elements

      if not inlineValidating and validated
        sanitizedValue = input.fwData("lastValidatedValue")
        for validator in input.fwData("validators")
          sanitizedValue = validator.sanitize(sanitizedValue)

        input.val sanitizedValue
    else
      bonzo(element).addClass "validated" for own i, element of elements

    validated

  submitAjax: ->
    Formwatcher.debug "Submitting form via AJAX."
    fields = { }
    fieldCount = 0
    i = 0

    for input, i in qwery(inputSelector, @form)
      input = bonzo input

      # Buttons are only submitted when pressed. If a submit button triggers the submission
      # of the form then it creates a hidden input field to transmit it.
      if input[0].nodeName == "BUTTON" or (input[0].nodeName == "INPUT" and (input.attr("type").toLowerCase() == "submit" or input.attr("type").toLowerCase() == "button"))
        return

      # In previous versions I checked if the input field was hidden, and forced the submission
      # then. But if a decorator transforms any input field in a hidden field, and puts
      # a JS selector on top of it, the actual input field will always be hidden, thus submitted.
      # So now the check if the field is hidden and should be submitted takes place
      # in the constructor, and sets `forceSubmission` on the input field.
      if input.fwData("forceSubmission") || (input.attr("type") && input.attr("type").toLowerCase() == "checkbox") || input.fwData('changed') || @options.submitUnchanged
        if input.attr("type") != "checkbox" || input.get(0).checked
          fieldCount++
          attributeName = input.attr("name") ? "unnamedInput_#{i}"
          fields[attributeName] = input.val()

    if fieldCount is 0 and not @options.submitFormIfAllUnchanged
      setTimeout =>
        @enableForm()
        @ajaxSuccess()
      , 1
    else
      reqwest
        url: @bonzoForm.fwData("originalAction")
        method: @options.ajaxMethod
        data: fields
        type: "text"
        error: (request) =>
          @callObservers "error", request.response
        success: (request) =>
          @enableForm()
          unless @options.responseCheck request.response
            @callObservers "error", request.response
          else
            @callObservers "success", request.response
            @ajaxSuccess()
        complete: (request) =>
          @bonzoForm.removeClass "submitting"
          @callObservers "complete", request.response

  ajaxSuccess: ->
    for elements in @allElements
      Formwatcher.unsetChanged elements, @
      if @options.resetFormAfterSubmit
        Formwatcher.restoreInitialValue elements
      else
        Formwatcher.storeInitialValue elements
      input = bonzo elements.input
      isEmpty = (input.val() is null or not input.val())
      for i, element of elements
        element = bonzo element
        if isEmpty
          element.addClass "empty"
        else
          element.removeClass "empty"



# Exporting the module
module.exports = Watcher
