import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfComponentClass
    from '../shape/shapeOfComponentClass.js';


export default function validateComponentClassConfig(config) {
    const error =
        Spec.shape(shapeOfComponentClass)(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}
