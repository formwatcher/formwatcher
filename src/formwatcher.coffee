# Formwatcher Version 2.1.10-dev
#
# More infos at http://www.formwatcher.org
#
# Copyright (c) 2012, Matias Meno
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.


# Dependencies
bonzo = require "bonzo"
qwery = require "qwery"
domready = require "domready"
bean = require "bean"
reqwest = require "reqwest"



# Returns and stores attributes only for formwatcher.
# Be careful when you get data because it does return the actual object, not
# a copy of it. So if you manipulate an array, you don't have to store it again.
bonzo.aug
  fwData: (name, value) ->
    # Create an empty formwatcher object if there isn't one yet.
    @data "_formwatcher", { } unless @data("_formwatcher")?
    
    return @ unless name?
    formwatcherAttributes = @data("_formwatcher")
    if value?
      formwatcherAttributes[name] = value
      @data "_formwatcher", formwatcherAttributes
      return @
    else
      return formwatcherAttributes[name]



# ## Formwatcher, the global namespace
Formwatcher =
  version: "2.1.10-dev"
  debugging: false

  # A wrapper for console.debug that only forwards if `Formwatcher.debugging == true`
  debug: -> console.debug.apply console, arguments if @debugging and console?.debug?

  # Tries to find an existing errors element, and creates one if there isn't.
  getErrorsElement: (elements, createIfNotFound) ->
    input = bonzo elements.input

    # First try to see if there is a NAME-errors element, then if there is an ID-errors.
    errors = qwery("##{input.attr('name')}-errors") if input.attr("name")
    errors = qwery("##{input.attr('id')}-errors") unless errors?.length or !input.attr("id")

    if not errors or not errors.length
      errors = bonzo.create("<small />")[0]
      bonzo(errors).attr "id", input.attr("name") + "-errors" if input.attr("name")
      bonzo(errors).insertAfter input

    bonzo(errors)
      .hide()
      .addClass("errors")
      .addClass("fw-errors")

    errors


  # Helper function to deep extend objects
  deepExtend: (object, extenders...) ->
    return { } unless object?
    for other in extenders
      for own key, val of other
        unless object[key]? and typeof val is "object"
          object[key] = val
        else
          object[key] = @deepExtend object[key], val
    object


  getLabel: (elements, automatchLabel) ->
    input = bonzo elements.input

    if input.attr("id")
      label = bonzo bonzo.create("label[for=" + input.attr("id") + "]")[0]
      label = undefined unless label.length

    if not label and automatchLabel
      parent = input.parent()
      if parent.nodeName == "LABEL"
        # The input is embedded inside a label, so take the first span element.
        label = qwery("span", parent)[0]
      else
        label = input.previous()[0]
        label = undefined if label and (label.nodeName isnt "LABEL" or bonzo(label).attr("for")?)

    label

  changed: (elements, watcher) ->
    input = bonzo elements.input
    return  if not input.fwData("forceValidationOnChange") and (input.attr("type") is "checkbox" and input.fwData("previouslyChecked") is !!input[0].checked) or (input.fwData("previousValue") is input.val())
    input.fwData "forceValidationOnChange", false

    @setPreviousValueToCurrentValue elements

    if (input.attr("type") is "checkbox") and (input.fwData("initialyChecked") isnt !!input[0].checked) or (input.attr("type") isnt "checkbox") and (input.fwData("initialValue") isnt input.val())
      Formwatcher.setChanged elements, watcher
    else
      Formwatcher.unsetChanged elements, watcher

    watcher.validateElements elements if watcher.options.validate

  setChanged: (elements, watcher) ->
    input = bonzo elements.input

    return if input.fwData("changed")

    bonzo(element).addClass "changed" for own i, element of elements

    input.fwData "changed", true
    Formwatcher.restoreName elements  unless watcher.options.submitUnchanged
    watcher.submitForm() if watcher.options.submitOnChange and watcher.options.ajax

  unsetChanged: (elements, watcher) ->
    input = bonzo elements.input
    return unless input.fwData("changed")

    bonzo(element).removeClass "changed" for own i, element of elements

    input.fwData "changed", false
    Formwatcher.removeName elements unless watcher.options.submitUnchanged

  storeInitialValue: (elements) ->
    input = bonzo elements.input

    if input.attr("type") is "checkbox"
      input.fwData "initialyChecked", !!input[0].checked
    else
      input.fwData "initialValue", input.val()

    @setPreviousValueToInitialValue elements

  restoreInitialValue: (elements) ->
    input = bonzo elements.input

    if input.attr("type") is "checkbox"
      input.attr "checked", input.fwData("initialyChecked")
    else
      input.val input.fwData("initialValue")

    @setPreviousValueToInitialValue elements

  setPreviousValueToInitialValue: (elements) ->
    input = bonzo elements.input

    if input.attr("type") is "checkbox"
      input.fwData "previouslyChecked", input.fwData("initialyChecked")
    else
      input.fwData "previousValue", input.fwData("initialValue")

  setPreviousValueToCurrentValue: (elements) ->
    input = bonzo elements.input

    if input.attr("type") is "checkbox"
      input.fwData "previouslyChecked", !!input[0].checked
    else
      input.fwData "previousValue", input.val()

  removeName: (elements) ->
    input = bonzo elements.input

    return if input.attr("type") is "checkbox"

    input.fwData "name", input.attr("name") or ""  unless input.fwData("name")
    input.attr "name", ""

  restoreName: (elements) ->
    input = bonzo elements.input

    return  if input.attr("type") is "checkbox"
    input.attr "name", input.fwData("name")

  decorators: []
  # `decorate()` only uses the first decorator found. You can't use multiple decorators on the same input.
  # You can extend an existing decorator with inheritence though.
  decorate: (watcher, input) ->
    decorator = null

    for dec in watcher.decorators
      if (!watcher.options[dec.name]? or watcher.options[dec.name] isnt false) and dec.accepts input
        decorator = dec
        break

    if decorator
      Formwatcher.debug "Decorator '#{decorator.name}' found for input field '#{bonzo(input).attr("name")}'."
      decorator.decorate input
    else
      input: input

  validators: []
  currentWatcherId: 0
  watchers: []
  add: (watcher) ->
    @watchers[watcher.id] = watcher

  get: (id) ->
    @watchers[id]

  getAll: ->
    @watchers

  # Searches all forms with a data-fw attribute and watches them.
  # 
  # This method delays the scan until the dom is loaded.
  discover: ->
    handleForm = (form) =>
      form = bonzo form

      # A form can only be watched once!
      return if form.fwData("watcher")

      formId = form.attr("id")

      # Check if options have been set for it.
      options = if formId? and Formwatcher.options[formId]? then Formwatcher.options[formId] else { }

      domOptions = form.data "fw"

      # domOptions always overwrite the normal options.
      options = @deepExtend options, JSON.parse domOptions if domOptions

      new @Watcher(form, options)

    domready ->
      bonzo(qwery("form[data-fw]")).each (form) -> handleForm form
      handleForm qwery("##{formId}") for formId of Formwatcher.options

  watch: (args...) ->
    domready -> new @Watcher args...





# ## Default options
# Those are the default options a new watcher uses if nothing is provided.
# Overwrite any of these when instantiating a watcher (or put it in `data-fw=''`)
Formwatcher.defaultOptions =
  # Whether to convert the form to an AJAX form.
  ajax: false
  # You can set this to force a specific method (eg.: `post`). If null, the method of the
  # form attribute `method` is taken.
  ajaxMethod: null
  # Whether or not the form should validate on submission. This will invoke
  # every validator attached to your input fields.
  validate: true
  # If ajax and submitOnChange are true, then the form will be submitted every
  # time an input field is changed. This removes the need of a submit button.
  submitOnChange: false
  # If the form is submitted via AJAX, the formwatcher uses changed values.
  # Otherwise formwatcher removes the name parameter of the input fields so they
  # are not submitted.
  # Remember: checkboxes are ALWAYS submitted if checked, and never if unchecked.
  submitUnchanged: true
  # If you have `submitUnchanged = false` and the user did not change anything and
  # hit submit, there would not actually be anything submitted to the server.
  # To avoid that, formwatcher does not actually send the request. But if you want
  # that behaviour you can set this to true.
  submitFormIfAllUnchanged: false
  # When the form is submitted with AJAX, this tells the formwatcher how to
  # leave the form afterwards. Eg: For guestbook posts this should probably be yes.
  resetFormAfterSubmit: false
  # Creating ids for input fields, and setting the `for` attribute on the labels
  # is the right way to go, but can be a tedious task. If automatchLabel is true,
  # Formwatcher will automatically match the closest previous label without a `for`
  # attribute as the correct label.
  automatchLabel: true
  # Checks the ajax transport if everything was ok. If this function returns
  # false formwatcher assumes that the form submission resulted in an error.
  # So, if this function returns true `onSuccess` will be called. If false,
  # `onError` is called.
  responseCheck: (data) -> not data
  # This function gets called before submitting the form. You could hide the form
  # or show a spinner here.
  onSubmit: ->
  # If the responseCheck function returns true, this function gets called.
  onSuccess: (data) ->
  # If the responseCheck function returns false, this function gets called.
  onError: (data) -> alert data
  # In any case onComplete() is called when the request has been done.
  onComplete: (data) ->




# This is a map of options for your different forms. You can simply overwrite it
# to specify your form configurations, if it is too complex to be put in the
# form data-fw='' field.
#
# **CAREFUL**: When you set options here, they will be overwritten by the DOM options.
#
# Example:
#
#     Formwatcher.options.myFormId = { ajax: true };
Formwatcher.options = { }


# Exposing the main Formwatcher object
module.exports = Formwatcher

