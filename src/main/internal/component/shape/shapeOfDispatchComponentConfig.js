import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';

import { Spec } from 'js-spec';

const isOptionalFunction = Spec.optional(Spec.isFunction);

export default Object.assign({}, shapeOfPartialBaseConfig, {
    render: Spec.isFunction,
    init: isOptionalFunction,
    shouldUpdate: isOptionalFunction,
    onWillReceiveProps: isOptionalFunction,
    onWillMount: isOptionalFunction,
    onDidMount: isOptionalFunction,
    onWillUpdate: isOptionalFunction,
    onDidUpdate: isOptionalFunction,
    onWillUnmount: isOptionalFunction,
});
