import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';

import { Spec } from 'js-spec';

export default Object.assign({}, shapeOfPartialBaseConfig, {
    init: Spec.func
});
