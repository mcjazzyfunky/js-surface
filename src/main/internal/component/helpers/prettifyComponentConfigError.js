export default function prettifyComponentConfigError(error, config) {
	let ret = null;

	if (!config || typeof config.name !== 'string') {
		ret = new Error('Invalid component configuration => '
			+ error.message);
	} else {
		ret = new Error('Invalid component configuration '
			+ `for '${config.name}' => ${error.message}`);
	}

	return ret;
}
