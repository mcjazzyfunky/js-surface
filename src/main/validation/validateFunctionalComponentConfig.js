import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError';

import shapeOfFunctionalComponentConfig
    from '../shape/shapeOfFunctionalComponentConfig';


export default function validateFunctionalComponentConfig(config) {console.log(config)
    const error =
        Spec.shape(shapeOfFunctionalComponentConfig)
            .validate(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}