import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfFunctionalComponentConfig
    from '../shape/shapeOfFunctionalComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
    const error =
        Spec.shape(shapeOfFunctionalComponentConfig)
            .validate(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}