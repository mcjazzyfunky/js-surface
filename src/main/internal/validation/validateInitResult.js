import { Spec } from 'js-spec';

import shapeOfInitResultWithoutInjection
    from '../shape/shapeOfInitResultWithoutInjection.js';

import shapeOfInitResultWithInjection
    from '../shape/shapeOfInitResultWithInjection.js';

export default function validateInitResult(initResult, config) {
    let error = config.childInjectionKeys
        ? Spec.shape(shapeOfInitResultWithInjection)(initResult, '')
        : Spec.shape(shapeOfInitResultWithoutInjection)(initResult, '');

    if (error) {
        error = Error(
            `Function 'init' of component '${config.displayName}' `
            + `has returned an invalid value => ${error.message}`);
    }

    return error;
}
