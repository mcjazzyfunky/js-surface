import Spec from '../../../api/Spec.js';

import shapeOfInitResult
    from '../shape/shapeOfInitResult.js';


export default function validateInitResult(initResult, config) {
    let error =
        Spec.hasShapeOf(shapeOfInitResult)(initResult, '');

    if (error) {
        error = Error(
            `Function 'init' of standard component '${config.displayName}' `
            + `has returned an invalid value => ${error.message}`);
    }

    return error;
}