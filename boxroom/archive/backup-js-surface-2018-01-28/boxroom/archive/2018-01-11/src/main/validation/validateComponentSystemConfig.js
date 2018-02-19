import { REGEX_ADAPTER_NAME } from '../constant/constants';
import { Spec } from 'js-spec';

const
    specOfComponentSystemConfig = 
        Spec.shape({
            name: Spec.match(REGEX_ADAPTER_NAME),
            api: Spec.object,
            createElement: Spec.function,
            isElement: Spec.function,
            defineComponent: Spec.function,
            mount: Spec.function,
            browserBased: Spec.boolean
        });

export default function validateComponentSystemConfig(config) {
    const error = specOfComponentSystemConfig.validate(config);

    return error
        ? new Error(`Invalid component system configuration => ${error.message}`)
        : null;
}
