import { Spec } from 'js-spec';

import shapeOfInitResultWithoutInjection
    from '../shape/shapeOfInitResultWithoutInjection';

import shapeOfInitResultWithInjection
    from '../shape/shapeOfInitResultWithInjection';

export default function validateInitResult(initResult, config) {
    let error =
        (config.childInjections
            ? Spec.shape(shapeOfInitResultWithInjection)
            : Spec.shape(shapeOfInitResultWithoutInjection))
        .validate(initResult, '');

    if (error) {
        error = Error(
            `Function 'init' of component '${config.displayName}' `
            + `has returned an invalid value => ${error.message}`);
    }

    return error;
}
