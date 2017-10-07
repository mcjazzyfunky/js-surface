import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError';

import shapeOfClassComponentConfig
    from '../shape/shapeOfClassComponentConfig';


export default function validateClassComponentConfig(config) {
    const error =
        Spec.struct(shapeOfClassComponentConfig)
            .validate(config, '');
if (error) console.log(config)
    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}
