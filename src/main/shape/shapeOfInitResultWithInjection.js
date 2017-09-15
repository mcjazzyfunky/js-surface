import shapeOfInitResultWithoutInjection
    from './shapeOfInitResultWithoutInjection';

import { Spec } from 'js-spec';

export default Object.assign({},
    shapeOfInitResultWithoutInjection,
    {
        provideChildInjections: Spec.function
    });
