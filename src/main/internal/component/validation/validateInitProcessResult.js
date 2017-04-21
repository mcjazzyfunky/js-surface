import Spec from '../../../api/Spec.js';

import shapeOfInitProcessResult
    from '../shape/shapeOfInitProcessResult.js';


export default function validateInitProcessResult(initProcessResult, config) {
    let error =
        Spec.hasShapeOf(shapeOfInitProcessResult)(initProcessResult, '');

    if (error) {
        error = Error(
            `Function 'initProcess' of standard component '${config.displayName}' `
            + `has returned an invalid value => ${error.message}`);
    }

    return error;
}