import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfComponentClass
    from '../shape/shapeOfComponentClass.js';


export default function validateFunctionalComponentConfig(componentClass) {
    const config = {
        displayName: componentClass.displayName,
        properties: componentClass.properties
    };

    const error =
        Spec.hasShapeOf(shapeOfComponentClass)(config, '');

    return error !== null
        ? prettifyComponentConfigError(error, config)
        : null;
}
