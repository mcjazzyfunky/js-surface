import Spec from '../../../api/Spec.js';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfClassComponentConfig
    from '../shape/shapeOfClassComponentConfig.js';


export default function validateFunctionalComponentConfig(config) {
    const error =
        Spec.hasShapeOf(shapeOfClassComponentConfig)(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}
