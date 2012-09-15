
InputWatcher = require "./input-watcher"

# ## Decorator class
#
# Decorators are used to improve the visuals and user interaction of form inputs.
#
# Implement it to create a new decorator.
class Decorator extends InputWatcher

  # This function does all the magic.
  # It creates additional elements if necessary, and could instantiate an object
  # that will be in charge of handling this input.
  #
  # This function has to return a hash of all fields that you want to get updated
  # with .focus and .changed classes. Typically this is just { input: THE_INPUT }
  #
  # `input` has to be the actual form element to transmit the data.
  # `label` is reserved for the actual label.
  decorate: (watcher, input) -> input: input


module.exports = Decorator