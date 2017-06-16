import { Spec } from 'js-spec';

import shapeOfInitResult
    from '../shape/shapeOfInitResult.js';


export default function validateInitResult(initResult, config) {
    let error =
        Spec.shape(shapeOfInitResult)(initResult, '');

    if (error) {
        error = Error(
            `Function 'init' of standard component '${config.displayName}' `
            + `has returned an invalid value => ${error.message}`);
    }

    return error;
}