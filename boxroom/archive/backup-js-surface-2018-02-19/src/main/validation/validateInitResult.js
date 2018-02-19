export default function validateInitResult(initResult, config) {
    let
        errMsg = null,
        error = null,
        close = initResult ? initResult.close : null,
        handleError = initResult ? initResult.handleError : null;
    
    if (initResult === null || typeof initResult !== 'object') {
        errMsg = 'Must be an object';
    } else if (typeof initResult.setProps !== 'function') {
        errMsg = "Parameter 'setProps' must be a function";
    } else if (close !== undefined
            && close !== null
            && typeof close !== 'function') {

        errMsg = "Parameter 'close' must be a function or empty";
    } else if (config.isErrorBoundary) {
        if (handleError === undefined || handleError === null) {
            errMsg = "Missing parameter 'handleError'";
        } else if (typeof handleError !== 'function') {
            errMsg = "Parameter 'handlerError' must be a function";
        }
    } else if (!config.isErrorBoundary
        && handleError !== null && handleError !== undefined) {
        
        errMsg = "Unnecessary parameter 'handleError'";
    } else if (config.isErrorBoundary && typeof handleError !== 'function') {
        errMsg = "Parameter 'handleError' must be a function";
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
                if (key !== 'setProps' && key !== 'close'
                    && key !== 'applyMethod' && key !== 'handleError') {
                    
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
