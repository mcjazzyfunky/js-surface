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

  const Consumer = props => {
    // There's a but in Dyo => filter children // TODO
    const nodes = Dyo.Children.toArray(props.children).filter(it => it !== null)
    let value = Dyo.useContext(ret)

    if (value === undefined) {
      value = defaultValue
    }

    return nodes.length > 0 ? nodes[0](value) : null
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
