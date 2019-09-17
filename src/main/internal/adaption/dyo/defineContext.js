// external imports
import * as Dyo from 'dyo'

// internal imports

// --- defineContext ------------------------------------------------

function defineContext(
  displayName,
  defaultValue,
  validate
) {
  const Provider = ({ value, children }) =>
    Dyo.h(Dyo.Context, { value }, children)

  const Consumer = ({ children }) => {
    let value = Dyo.useContext(Provider)

    if (value === undefined) {
      value = defaultValue
    }

    return Dyo.Children.toArray(children)[0](value) 
  }
  
  const constr = () => {}

  constr.__internal_defaultValue = defaultValue

  const ret = Object.create(constr.prototype)

  ret.Provider = Provider
  ret.Consumer = Consumer

  Provider.displayName = displayName

  if (validate) {
    Provider.validate = validate
  }

  return ret
}

// --- exports ------------------------------------------------------

export default defineContext
