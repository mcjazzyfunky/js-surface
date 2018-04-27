import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig';

import { Spec } from 'js-spec';

export default Object.assign({}, shapeOfPartialBaseConfig, {
    render: Spec.function
});
