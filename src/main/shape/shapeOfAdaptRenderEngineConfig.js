import { REGEX_RENDER_ENGINE_NAME } from '../constant/constants';
import { Spec } from 'js-spec';

export default  {
    renderEngine:
        Spec.shape({
            name: Spec.match(REGEX_RENDER_ENGINE_NAME),
            api: Spec.object,
        }),

    interface:
        Spec.shape({
            createElement: Spec.function,
            defineFunctionalComponent: Spec.function,
            defineStandardComponent: Spec.function,
            isElement: Spec.function,
            mount: Spec.function
        }),

    options:
        Spec.optional(
            Spec.shape({
                isBrowserBased: Spec.optional(Spec.boolean)
            }))
};
