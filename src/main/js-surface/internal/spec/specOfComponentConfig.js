import { Spec } from 'js-spec'

// --- constants needed for the validation --------------------------
const
  REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
  REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
  REGEX_METHOD_NAME = /^[a-z][a-zA-Z0-9_-]*$/,

  FORBIDDEN_METHOD_NAMES = new Set(
    ['props', 'state', 'context', 'shouldComponentUpdate',
      'setState', 'componentWillReceiveProps',
      'componentWillMount', 'componentDidMount',
      'componentWillUpdate', 'componentDidUpdate',
      'componentDidCatch', 'constructor', 'forceUpdate'])
// --- some helper specs --------------------------------------------

const
  specOfProperties =
    Spec.and(
      Spec.object,

      Spec.keysOf(
        Spec.match(REGEX_PROPERTY_NAME)),

      Spec.valuesOf(
        Spec.shape({
          type:
            Spec.optional(Spec.function),
          
          constraint:
            Spec.optional(
              Spec.or(
                Spec.function,
                Spec.extensibleShape({
                  validate: Spec.function
                })
              )),

          nullable:
            Spec.optional(Spec.boolean),

          defaultValue:
            Spec.optional(Spec.any),

          inject:
            Spec.optional(
              Spec.valid(it => it != null && typeof it === 'object'
                && !!it.__internal_context)
                .usingHint('Must be a context'))
        }))),
    
  specOfMethods =
    Spec.arrayOf(
      Spec.and(
        Spec.match(REGEX_METHOD_NAME),
        Spec.notIn(FORBIDDEN_METHOD_NAMES))),

  specOfRenderConfig =
    Spec.shape({
      displayName:
        Spec.match(REGEX_DISPLAY_NAME),
      properties:
        Spec.optional(specOfProperties),
      validate:
          Spec.optional(Spec.function),
      render:
        Spec.function
    }),

  specOfInitConfig =
    Spec.shape({
      displayName:
        Spec.match(REGEX_DISPLAY_NAME),
      properties:
        Spec.optional(specOfProperties),
      validate:
        Spec.optional(Spec.function),
      methods:
        Spec.optional(specOfMethods),
      isErrorBoundary:
        Spec.optional(Spec.boolean),
      init:
        Spec.function,
      deriveStateFromProps:
        Spec.optional(Spec.function)
    }),

  specOfMainConfig =
    Spec.shape({
      displayName:
        Spec.match(REGEX_DISPLAY_NAME),
      properties:
        Spec.optional(specOfProperties),
      validate:
        Spec.optional(Spec.function),
      methods:
        Spec.optional(specOfMethods),
      isErrorBoundary:
        Spec.optional(Spec.boolean),
      main:
        Spec.prop('normalizeComponent', Spec.function)
    })

// --- the spec of the component configuration ----------------------

export default
  Spec.and(
    Spec.object,
    Spec.or(
      {
        when: Spec.hasOwnProp('render'),
        check: specOfRenderConfig
      },
      {
        when: Spec.hasOwnProp('init'),
        check: specOfInitConfig
      },
      {
        when: Spec.hasOwnProp('main'),
        check: specOfMainConfig
      }))
