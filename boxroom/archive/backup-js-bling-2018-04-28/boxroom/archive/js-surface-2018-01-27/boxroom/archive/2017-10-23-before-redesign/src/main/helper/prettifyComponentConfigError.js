export default function prettifyComponentConfigError(error, config) {
    let ret = null;

    if (!config || typeof config.displayName !== 'string') {
        ret = new Error('Invalid component configuration => '
            + error.message);
    } else {
        ret = new Error('Invalid component configuration '
            + `for '${config.displayName}' => ${error.message}`);
    }

    return ret;
}
