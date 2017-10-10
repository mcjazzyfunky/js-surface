export default function validateInitResult(initResult, config) {
    let
        errMsg = null,
        error = null;
    
    if (initResult === null || typeof initResult !== 'object') {
        errMsg = 'Must be an object';
    } else if (typeof initResult.receiveProps !== 'function') {
        errMsg = "Parameter 'receiveProps' must be a function";
    }

    if (!errMsg) {
        if (config.publicMethods) {
            if (typeof initResult.applyPublicMethod !== 'function') {
                errMsg = "Parameter 'applyPublicMethod' must be a function"; 
            }
        } else if (initResult.applyPublicMethod !== undefined) {
            errMsg = "Unnecessary parameter 'applyPublicMethod'";
        }
    }

    if (!errMsg) {
        if (config.childInjections) {
            if (typeof initResult.provideChildInjections !== 'function') {
                errMsg = "Parameter 'provideChildInjections' must be a function"; 
            }
        } else if (initResult.provideChildInjections !== undefined) {
            errMsg = "Unnecessary parameter 'provideChildInjections'";
        }
    }

    if (!errMsg) {
        const keys = Object.keys(initResult);

        if (keys.length > 1 + !!config.publicMethods + !!config.childInjections) {
            for (const key of keys) {
                if (key !== 'receiveProps'
                    && key !== 'applyPublicMethod'
                    && key !== 'provideChildInjections') {

                    errMsg = `Invalid parameter '${key}'`;
                    break;
                }
            }
        }
    }

    if (errMsg) {
        console.log(initResult)
        error = new Error(
            `Init function of component '${config.displayName}' `
            + `has returned an invalid value => ${errMsg}`);
    }

    return error;
}
