
InputWatcher = require "./input-watcher"


# ## Validator class
#
# Instances of this class are meant to validate input fields
class Validator extends InputWatcher
  # Typically most validators work on every input field
  nodeNames: [ "INPUT", "TEXTAREA", "SELECT" ]

  # Return true if the validation passed, or an error message if not.
  validate: (sanitizedValue, input) -> true

  # If your value can be sanitized (eg: integers should not have leading or trailing spaces)
  # this function should return the sanitized value.
  #
  # When the user leaves the input field, the value will be updated with this value in the field.
  sanitize: (value) -> value



module.exports = Validator