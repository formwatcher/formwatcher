
InputWatcher = require "./input-watcher"


# ## Validator class
#
# Instances of this class are meant to validate input fields
class Validator extends InputWatcher
  # Typically most validators work on every input field
  nodeNames: [ "INPUT", "TEXTAREA", "SELECT" ]

  # Return true if the validation passed, or an error message if not.
  validate: (value, input) -> true

  # Since most validators sanitize their values to validate and format the default
  # validator has a helper sanitize function that can be used so `format()`
  # doesn't have to implemented every time.
  sanitize: (value) -> value

  # When the user leaves the input field, the value will be updated with this
  # formatted value.
  # 
  # **This only happens when the validation was successful!**
  # 
  # Normally this is just the sanitized value as string so it calls
  # the `sanitize()` function.
  format: (value) ->
    sanitizedValue = @sanitize value
    # NaN != NaN so using this here, because isNaN is true on strings.
    if (sanitizedValue != sanitizedValue) or !sanitizedValue
      ""
    else
      "#{sanitizedValue}"



module.exports = Validator