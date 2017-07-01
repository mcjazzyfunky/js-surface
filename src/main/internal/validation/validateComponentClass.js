import { Spec } from 'js-spec';

import prettifyComponentConfigError
    from '../helper/prettifyComponentConfigError.js';

import shapeOfComponentClass
    from '../shape/shapeOfComponentClass.js';


export default function validateComponentClass(componentClass) {
    const error =
        Spec.statics(shapeOfComponentClass)(componentClass, '');

    return error !== null
        ? prettifyComponentConfigError(error, componentClass)
        : null;
}
