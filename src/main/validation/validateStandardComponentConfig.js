import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError';

import shapeOfStandardComponentConfig
    from '../shape/shapeOfStandardComponentConfig';


export default function validateFunctionalComponentConfig(config) {
    const error =
        Spec.shape(shapeOfStandardComponentConfig)
            .validate(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}