export default function validateObject(
    object, keyValidator, valueValidator = null, optional = false, mayBeEmpty = true) {
    
    let error = null;

    if (optional && (object === undefined || object === null)) {
        // everything fine
    } else if (!optional && (object === undefined || object === null)) {
        error = `Must not be ${object}`;      
    } else if (typeof object !== 'object') {
        error = 'Must be an object';
    } else if (!mayBeEmpty && Object.keys(object).length === 0) {
        error = 'Must not be empty';
    } else if (keyValidator || valueValidator) {
        const keys = Object.keys(object);

        for (let key of keys) {
            if (keyValidator) {
                const validationResult = keyValidator(key);

                if (validationResult !== undefined
                    && validationResult !== null
                    && validationResult !== true) {
                    
                    error = `Illegal key '${key}'`;
                    
                    const message =
                        String(validationResult.message || validationResult).trim();

                    if (message) {
                        error += `: ${message}`;
                    }

                    break;
                }
            }

            if (valueValidator) {
                const validationResult = valueValidator(object[key]);

                if (validationResult !== undefined
                    && validationResult !== null
                    && validationResult !== true) {

                    error = `Illegal value for key '${key}'`;

                    const message =
                        String(validationResult.message || validationResult).trim();

                    if (message) {
                        error += `: ${message}`;
                    }

                    break;
                }
            }
        }
    }

    return error
        ? new Error(error)
        : null;
}