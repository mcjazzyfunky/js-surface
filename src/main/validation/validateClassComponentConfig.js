import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfClassComponentConfig
    from '../shape/shapeOfClassComponentConfig.js';


export default function validateClassComponentConfig(config) {
    const error =
        Spec.struct(shapeOfClassComponentConfig)
            .validate(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}
