import { Spec } from 'js-spec';

// --- the spec of the context configuration ------------------------

const contextConfigSpec =
  Spec.optional(
    Spec.shape({
      displayName:
        Spec.string,

      type:
        Spec.optional(
          Spec.function),

      constraint:
        Spec.optional(
          Spec.or(
            Spec.function,
            Spec.extensibleShape({
              validate: Spec.function
            })
          )),

      defaultValue:
         Spec.any
    }));

// --- the actual context validation function -----------------------

export default function validateContextConfig(config) {
  let ret = null;

  if (config !== undefined && (config === null || typeof config !== 'object')) {
    ret = 'Context configuration must be an object or undefined';
  } else {
    ret = contextConfigSpec.validate(config);
  }

  return ret;
}
