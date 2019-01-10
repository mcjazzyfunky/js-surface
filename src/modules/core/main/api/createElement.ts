import ComponentFactory from './types/ComponentFactory'
import VirtualElement from './types/VirtualElement'
import Props from './types/Props'
import PropertiesConfig from './types/PropertiesConfig'
import PropertyConfig from './types/PropertyConfig'
import Key from './types/Key'
import Ref from './types/Ref'

function createElement(type: string | ComponentFactory, props?: Props, ...children: any[]): VirtualElement
function createElement(/* arguments */): VirtualElement {
  const
    argCount = arguments.length,
    type = arguments[0],
    secondArg = arguments[1],

    skippedProps = argCount > 1 && secondArg !== undefined && secondArg !== null
        && (typeof secondArg !== 'object' || secondArg instanceof VirtualElementClass
          || typeof secondArg[Symbol.iterator] === 'function'),

    originalProps = skippedProps ? null : (secondArg || null),
    hasChildren = argCount > 2 || argCount === 2 && skippedProps,
    needsToCopyProps = hasChildren || (originalProps && (originalProps.key !== undefined || originalProps.ref !== undefined))


  let
    props: Props = null,
    children: any[] = null

  if (needsToCopyProps) {
    if (!props) {
      props = {}
    }
  }

  if (hasChildren) {
    children = []

    for (let i = 2 - (skippedProps ? 1 : 0); i < argCount; ++i) {
      const child: any = arguments[i]

      if (isIterableObject(child)) {
        pushItems(children, child)
      } else {
        children.push(child)
      }
    }
  }

  if (argCount > 1 && !skippedProps) {
    if (!hasChildren) {
      props = secondArg
    } else if (!secondArg) {
      props = { children }
    } else {
      props = {}

      const keys = Object.keys(secondArg)

      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i]
        
        props[key] = secondArg[key] 
      }

      props.children = children
    }
  } else if (hasChildren) {
    props = { children }
  }

  // TODO - optimize!
  if (type && type.meta) {
    if (type.meta.defaultProps) {
      if (!props) {
        props = Object.assign({}, type.meta.defaultProps)
      } else if (props === originalProps) {
        props = Object.assign({}, type.meta.defaultProps, props)
      } else {
        props = Object.assign({}, type.meta.defaultProps, props)
      }
    } else if (type.meta.properties) {
      const keys = Object.keys(type.meta.properties)

      for (let i = 0; i < keys.length; ++i) {
        const
          key = keys[i]

        if (!props || !props.hasOwnProperty(key)) {
          const propConfig = type.meta.properties[key]

          if (propConfig && propConfig.hasOwnProperty('defaultValue')) {
            const defaultValue = propConfig.defaultValue

            if (!props) {
              props = { [key]: defaultValue }
            } else if (props === originalProps) {
              props = Object.assign({ [key]: defaultValue }, props)
            } else {
              props[key] = defaultValue
            }
          }
        }
      }

      if (process.env.NODE_ENV === 'development' as any) {
        const error = validateProperties(
          props, type.meta.properties, type.meta.validate, type.meta.variableProps, type.meta.displayName,
          type['js-surface:kind'] === 'constexProvider')

        if (error) {
          throw error
        }
      }
    }
  }

  let
    key = null,
    ref = null

  // TODO - fix!!!!
  if (originalProps && (originalProps.key !== undefined || originalProps.ref !== undefined)) {
    props = Object.assign({}, props)

    delete props.key
    delete props.ref

    key = originalProps.key === undefined ? null : originalProps.key
    ref = originalProps.ref === undefined ? null : originalProps.ref
  }

  return new VirtualElementClass(type, props, key, ref)
}

export default createElement

// --- locals -------------------------------------------------------

const
  SYMBOL_ITERATOR =
    typeof Symbol === 'function' && Symbol.iterator
      ? Symbol.iterator
      : '@@iterator'

const VirtualElementClass = class VirtualElement {
  type: string | ComponentFactory
  props: Props | null
  key: Key
  ref: Ref 

  constructor(
    type: string | ComponentFactory,
    props: Props | null,
    key: Key,
    ref: Ref
  ) {
    this.type = type
    this.props = props
    this.key = key
    this.ref = ref
  }
}

function pushItems(array: any[], items: Iterable<any>) {
  if (Array.isArray(items)) {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i]

      if (isIterableObject(item)) { 
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  } else {
    for (const item of items) {
      if (isIterableObject(item)) {
        pushItems(array, item)
      } else {
        array.push(item)
      }
    }
  }
}

function isIterableObject(it: any) {
  return it !== null && typeof it === 'object' && (Array.isArray(it) || typeof it[SYMBOL_ITERATOR] === 'function')
}

function validateProperties<P extends Props>(
  props: P,
  propsConfig: PropertiesConfig<P>,
  propsValidator: (props: P) => null | Error | true | false,
  variableProps: boolean,
  componentName: string,
  isCtxProvider: boolean
) {
  let ret = null

  const
    propNames = propsConfig ? Object.keys(propsConfig) : [],
    messages = []

  if (propsConfig) {
    for (let i = 0; i < propNames.length; ++i) {
      const
        propName = propNames[i],
        propConfig = propsConfig[propName],
        ret = validateProperty(
          props, propConfig, propName, componentName, isCtxProvider)

      if (ret) {
        messages.push(ret.message)
      }
    }
  }

  if (!variableProps) {
    const
      usedPropNames = Object.keys(props),
      invalidPropNames = []

    for (let i = 0; i < usedPropNames.length; ++i) {
      const usedPropName = usedPropNames[i]

      if (!propsConfig || !propsConfig.hasOwnProperty(usedPropName)) {
        if (usedPropName !== 'key' && usedPropName !=='ref') { // TODO: => DIO bug
          invalidPropNames.push(usedPropName)
        }
      }
    }

    if (invalidPropNames.length == 1) {
      messages.push(`Invalid prop key "${invalidPropNames[0]}"`)
    } else if (invalidPropNames.length > 1) {
      messages.push('Invalid prop keys: ' + invalidPropNames.join(', '))
    }
  }

  if (propsValidator) {
    const
      validator = propsValidator && (<any>propsValidator)['js-spec:validate'] || propsValidator,
      error = validator(props)

    if (error === false) {
      messages.push('Invalid value')
    } else if (error) {
      messages.push(error instanceof Error ? error.message : String(error))
    }
  }

  if (messages.length > 0) {
    const errorMsgIntro =
      'Prop validation error for '
        + (isCtxProvider ? 'provider of context ' : 'component ')
        + `"${componentName}"`
        + ' => '

    if (messages.length === 1) {
      ret = new Error(`${errorMsgIntro} ${messages[0]}`)
    } else if (messages.length > 1) {
      ret = new Error(`\n- ${messages.join('\n- ')}`)
    }
  }

  return ret
}

function validateProperty<P extends Props, K extends keyof P>(
  props: P,
  propConfig: PropertyConfig<K>,
  propName: K,
  componentName: string,
  isCtxProvider: boolean
) {
  let
    ret = null,
    errMsg = null

  const
    valueIsSet = props.hasOwnProperty(propName),
    value = valueIsSet ? props[propName] : undefined,
    nullable = propConfig.nullable === true,
    typeConstructor = propConfig.type || null,

    propInfo = `'${propName}' of `
      + `${isCtxProvider ? 'context provider for' : 'component'} '${componentName}'`
    
  let validate = propConfig.validate || null

  validate = validate && (<any>validate)['js-spec:validate'] || validate

  if (!valueIsSet) {
    if (!propConfig.hasOwnProperty('defaultValue') && propConfig.required === true) {
      errMsg = `Missing mandatory property ${propInfo}`
    }
  } else if (value === null && nullable === true || value === undefined && propConfig.required !== true) {
    // Perfectly fine
  } else if (value === null && nullable === false) {
    errMsg = `Property ${propInfo} must not be null`
  } else if (typeConstructor !== undefined && typeConstructor !== null) {
    const type = typeof value

    switch (<any>typeConstructor) {
      case Boolean:
        if (type !== 'boolean') {
          errMsg = `Property ${propInfo} must be boolean`
        }
        
        break
        
      case Number:
        if (type !== 'number') {
          errMsg = `Property ${propInfo} must be a number`
        }
        
        break
      
      case String:
        if (type !== 'string') {
          errMsg = `Property ${propInfo} must be a string`
        }
        
        break
        
      case Function:
        if (type !== 'function') {
          errMsg = `Property ${propInfo} must be a function`
        }
        
        break
        
      default:
        if (typeConstructor && !(<Function>value instanceof typeConstructor)) {
          errMsg = `The property ${propInfo} must be of type `
            + typeConstructor.name 
        }
    }
  }
  
  if (!errMsg && !(nullable && value === null)
    && valueIsSet && validate) {

    let err = (<Function>validate)(value)
      
    if (err === undefined || err === null || err === true) {
      // everything fine
    } else if (err === false) {
      errMsg = `Invalid value for property ${propInfo}`
    } else if (typeof err === 'string') {
      errMsg = `Invalid value for property ${propInfo} => ${err}`
    } else if (err && typeof err.message === 'string') {
      errMsg = `Invalid value for property ${propInfo} => `
        + err.message
    } else {
      const msg = String(err).trim()

      errMsg = `Invalid value for property ${propInfo}`

      if (msg !== '') {
        errMsg += ` => ${msg}`
      }
    }
  }
  
  if (errMsg) {
    ret = new Error(errMsg)
  } 
  
  return ret
}
