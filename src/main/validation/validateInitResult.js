export default function validateInitResult(initResult, config) {
    let
        errMsg = null,
        error = null;
    
    if (initResult === null || typeof initResult !== 'object') {
        errMsg = 'Must be an object';
    } else if (typeof initResult.setProps !== 'function') {
        errMsg = "Parameter 'setProps' must be a function";
    } else if (initResult.close !== undefined
            && initResult.close !== null
            && typeof initResult.close !== 'function') {

        errMsg = "Parameter 'close' must be a function or empty";
    }

    if (!errMsg) {
        if (config.methods) {
            if (typeof initResult.applyMethod !== 'function') {
                errMsg = "Parameter 'applyMethod' must be a function"; 
            }
        } else if (initResult.applyMethod) {
            errMsg = "Unnecessary parameter 'applyMethod'";
        }
    }

    if (!errMsg) {
        const keys = Object.keys(initResult);

        if (keys.length > 1 + !!config.methods) {
            for (const key of keys) {
                if (key !== 'setProps' && key !== 'close' && key !== 'applyMethod') {
                    errMsg = `Invalid parameter '${key}'`;
                    break;
                }
            }
        }
    }

    if (errMsg) {
        error = new Error(
            `Init function of component '${config.displayName}' `
            + `has returned an invalid value => ${errMsg}`);
    }

    return error;
}
