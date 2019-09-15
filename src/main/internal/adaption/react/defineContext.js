// external imports
import React from 'react'

// --- defineContext ------------------------------------------------

function defineContext(
  displayName,
  defaultValue,
  validate
) { 
  const
    ret = React.createContext(defaultValue),
    provider = ret.Provider

  provider.displayName = displayName

  if (validate) {
    provider.propTypes = {
      value: props => {
        const
          result = validate(props.value),

          errorMsg =
            result === false
              ? 'Invalid value'
              : result instanceof Error
                ? result.message
                : null

        return !errorMsg
          ? null
          : new TypeError(
            'Validation error for provider of context '
            + `"${displayName}" => ${errorMsg}`)
      }
    }
  }

  return ret
}

// --- exports ------------------------------------------------------

export default defineContext
