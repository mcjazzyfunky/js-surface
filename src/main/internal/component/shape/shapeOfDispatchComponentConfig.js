import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';

import { Spec } from 'js-spec';

const isOptionalFunction = Spec.optional(Spec.func);

export default Object.assign({}, shapeOfPartialBaseConfig, {
    render: Spec.func,
    init: isOptionalFunction,
    shouldUpdate: isOptionalFunction,
    onWillReceiveProps: isOptionalFunction,
    onWillMount: isOptionalFunction,
    onDidMount: isOptionalFunction,
    onWillUpdate: isOptionalFunction,
    onDidUpdate: isOptionalFunction,
    onWillUnmount: isOptionalFunction,
});
