import shapeOfInitResultWithoutInjection
    from './shapeOfInitResultWithoutInjection.js';

import { Spec } from 'js-spec';

export default Object.assign({},
    shapeOfInitResultWithoutInjection,
    {
        provideChildInjections: Spec.function
    });
