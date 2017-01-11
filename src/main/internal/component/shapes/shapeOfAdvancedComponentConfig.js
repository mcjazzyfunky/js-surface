import shapeOfPartialBaseConfig from './shapeOfPartialBaseConfig.js';
import Constraints from '../../../api/Constraints.js';

const isOptionalFunction = Constraints.optional(Constraints.isFunction);

export default Object.assign({}, shapeOfPartialBaseConfig, {
	render: Constraints.isFunction,
	init: isOptionalFunction,
	shouldUpdate: isOptionalFunction,
	onWillReceiveProps: isOptionalFunction,
	onWillMount: isOptionalFunction,
	onDidMount: isOptionalFunction,
	onWillUpdate: isOptionalFunction,
	onDidUpdate: isOptionalFunction,
	onWillUnmount: isOptionalFunction,
});
