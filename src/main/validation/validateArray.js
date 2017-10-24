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
        let validationResult = null;

        for (let i = 0; i < array.length; ++i) {
            validationResult = itemValidator(array[i]);

            if (validationResult !== undefined
                && validationResult !== null
                && validationResult !== true) {

                error = `Illegal value at index ${i}`;
                
                const message =
                    typeof validationResult === 'object'
                        ? String(validationResult.message || validationResult).trim()
                        : null;

                
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
