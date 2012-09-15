
# ## The InputWatcher root class
# 
# This is the base class for decorators and validators.
class InputWatcher
  name: "No name"
  description: "No description"
  nodeNames: null # eg: `[ "SELECT" ]`
  classNames: [] # eg: `[ "font" ]`
  defaultOptions: { } #  Overwrite this with your default options. Those options can be overridden in the watcher config.
  options: null # On initialization this gets filled with the actual options so they don't have to be calculated every time.

  # Stores the watcher, and creates a valid options object.
  constructor: (@watcher) ->
    @options = Formwatcher.deepExtend { }, @defaultOptions, watcher.options[@name] ? { }

  # Overwrite this function if your logic to which elements your decorator applies
  # is more complicated than a simple nodeName/className comparison.
  accepts: (input) ->
    # If the config for a InputWatcher is just false, it's disabled for the watcher.
    return false if @watcher.options[@name]? and @watcher.options[@name] == false

    correctNodeName = false
    inputNodeName = input.get(0).nodeName

    for nodeName in @nodeNames
      if inputNodeName is nodeName
        correctNodeName = true
        break

    return false unless correctNodeName

    correctClassNames = true

    for className in @classNames
      unless input.hasClass className
        correctClassNames = false
        break

    return correctClassNames



module.exports = InputWatcher