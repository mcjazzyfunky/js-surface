import shapeOfDefineMessagesConfig from '../shape/shapeOfDefineMessagesConfig.js';

import { Spec } from 'js-spec';

export default function validateDefineMessagesConfig(config) {
    const error =
        Spec.shape(shapeOfDefineMessagesConfig)(config),

        ret = error
            ? Error(
                "Invalid configuration for'defineMessages': "
                + error.message)
            : null;

    return ret;
}
