export default function validateArray(
    array, itemValidator, optional = false, mayBeEmpty = true, unique = false) {
    
    let error = null;
   
    if (!optional && (array === undefined || array === null)) {
        error = `Must not be ${array}`;      
    } else if (!Array.isArray(array)) {
        error = 'Must be an array';
    } else if (!mayBeEmpty && array.length === 0) {
        error = 'Must not be empty';
    } else {
        for (let i = 0; i < array.length; ++i) {
            const result = itemValidator(array[i]);

            if (result !== undefined
                && result !== null
                && result !== true) {

                error = `Illegal value at index ${i}`;
                
                let message =
                    typeof result === 'string'
                        ? result.trim()
                        : (typeof result === 'object'
                            ? String(result.message || result)
                            : null);
                
                if (message) {
                    error += `:  ${message}`;
                }

                break;
            }
        }
    }

    if (!error && unique) {
        if (array.length !== new Set(array).size) {
            error = 'Array items must be unique';
        }
    }

    return error
        ? new Error(error)
        : null;
}
