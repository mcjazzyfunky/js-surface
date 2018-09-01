import { Spec } from 'js-spec'

import { KEY_INTERNAL_CONTEXT } from '../constant/constants'

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
        Spec.and(
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

            optional:
              Spec.optional(Spec.is(true))
                .usingHint('Must be set either to true or must not bet set at all'),

            defaultValue:
              Spec.optional(Spec.any),

            inject:
              Spec.optional(
                Spec.shape({
                  context: 
                    Spec.valid(it => it != null && typeof it === 'object'
                      && !!it[KEY_INTERNAL_CONTEXT])
                      .usingHint('Must be a context')
                }))
          }),

          Spec.valid(it => !it.hasOwnProperty('optional')
            || !it.hasOwnProperty('defaultValue'))
            .usingHint('Parmeters "optional" and "defaultValue" must not be set both at once'),
          
          Spec.valid(it => !it.hasOwnProperty('inject')
            || !it.hasOwnProperty('defaultValue'))
            .usingHint('Parameters "inject" and "defaultValue" must not be set both at once'),

          Spec.valid(it => !it.hasOwnProperty('inject')
            || it.optional === true)
            .usingHint('If parameter "inject" is provided then parameter "optional" has to be set to true'))),
      
      Spec.valid(it => !it.hasOwnProperty('children') || !it.children.hasOwnProperty('defaultValue'))
        .usingHint('Must not provide a default value for property "children"')
    ),
    
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

const spec =
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

export default spec