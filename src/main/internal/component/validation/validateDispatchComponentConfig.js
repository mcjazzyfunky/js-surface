import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfDispatchComponentConfig
    from '../shape/shapeOfDispatchComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
    const error =
        Spec.shape(shapeOfDispatchComponentConfig)(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}