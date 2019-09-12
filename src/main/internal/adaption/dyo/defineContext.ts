// external imports
import * as Dyo from 'dyo'

// internal imports

// --- defineContext ------------------------------------------------

function defineContext<T>(
  displayName: string,
  defaultValue: T,
  validate: (value: T) => boolean | null | Error
) {
  const Provider = ({ value, children }: any) =>
    Dyo.h(Dyo.Context, { value }, children)

  const Consumer: (x: any) => any = (props: any) => {
    // There's a but in Dyo => filter children
    const nodes = Dyo.Children.toArray(props.children).filter((it: any) => it !== null)
    let value = Dyo.useContext(ret)

    if (value === undefined) {
      value = defaultValue
    }

    return nodes.length > 0 ? nodes[0](value) : null
  }
  
  const constr: any = () => {}

  constr.__internal_defaultValue = defaultValue

  const ret: any = Object.create(constr.prototype)

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
