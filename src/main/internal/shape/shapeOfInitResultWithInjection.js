import shapeOfInitResultWithoutInjection
    from './shapeOfInitResultWithoutInjection.js';

import { Spec } from 'js-spec';

export default Object.assign({},
    shapeOfInitResultWithoutInjection,
    {
        getChildInjection: Spec.func
    });
