import { Spec } from 'js-spec';

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
      'componentDidCatch', 'constructor', 'forceUpdate']);

// --- the spec of the component configuration ----------------------

const componentConfigSpec =
  Spec.and(
    Spec.shape({
      displayName:
        Spec.match(REGEX_DISPLAY_NAME),

      properties:
        Spec.optional(
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
              })))),

      methods:
        Spec.optional(
          Spec.arrayOf(
            Spec.and(
              Spec.match(REGEX_METHOD_NAME),
              Spec.notIn(FORBIDDEN_METHOD_NAMES)))),

      isErrorBoundary:
        Spec.optional(Spec.boolean),

      main:
        Spec.optional(
          Spec.or(
            Spec.function,
            Spec.extensibleShape({
              normalizeComponent: Spec.function
            })))
    }));

// --- the actual configuration validation function -----------------

export default function validateComponentConfig(config) {
  let ret = null;

  if (config === null || typeof config !== 'object') {
    ret = new TypeError('Component configuration must be an object');
  } else {
    ret = componentConfigSpec.validate(config);
  }

  return ret;
}
