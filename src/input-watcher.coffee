
# Dependencies
bonzo = require "bonzo"

# ## The InputWatcher root class
# 
# This is the base class for decorators and validators.
class InputWatcher
  name: "No name"
  description: "No description"
  nodeNames: null # eg: `[ "SELECT" ]`
  classNames: [] # eg: `[ "font" ]` they all have to match
  defaultOptions: { } #  Overwrite this with your default options. Those options can be overridden in the watcher config.
  options: null # On initialization this gets filled with the actual options so they don't have to be calculated every time.

  # Stores the watcher, and creates a valid options object.
  constructor: (options, @watcher) ->
    @options = Formwatcher.deepExtend { }, @defaultOptions, options

  # Overwrite this function if your logic to which elements your decorator applies
  # is more complicated than a simple nodeName/className comparison.
  accepts: (input) ->
    correctNodeName = false
    inputNodeName = input.nodeName

    for nodeName in @nodeNames
      if inputNodeName is nodeName
        correctNodeName = true
        break

    return false unless correctNodeName

    correctClassNames = true

    for className in @classNames
      unless bonzo(input).hasClass className
        correctClassNames = false
        break

    return correctClassNames



module.exports = InputWatcher