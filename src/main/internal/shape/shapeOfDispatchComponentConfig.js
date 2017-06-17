import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';

import { Spec } from 'js-spec';

const optionalFunc = Spec.optional(Spec.func);

export default Object.assign({}, shapeOfPartialBaseConfig, {
    render: Spec.func,
    init: optionalFunc,
    shouldUpdate: optionalFunc,
    onWillReceiveProps: optionalFunc,
    onWillMount: optionalFunc,
    onDidMount: optionalFunc,
    onWillUpdate: optionalFunc,
    onDidUpdate: optionalFunc,
    onWillUnmount: optionalFunc,
});
