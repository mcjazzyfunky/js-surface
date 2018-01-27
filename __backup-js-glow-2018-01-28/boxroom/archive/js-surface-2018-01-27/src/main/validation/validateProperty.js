export default function validateProperty(it, propertyName, typeConstr, nullable, constraint) {
    let
        ret = null,
        errMsg = null;

    if (it === null && nullable === true) {
        // Perfectly fine
    } else if (it === null && nullable === false) {
        errMsg = `Property '${propertyName}' must not be null`;
    } else if (typeConstr !== undefined && typeConstr !== null) {
        const type = typeof it;
        
        switch (typeConstr) {
        case Boolean:
            if (type !== 'boolean') {
                errMsg = `Property '${propertyName}' must be boolean`;
            }
            
            break;
            
        case Number:
            if (type !== 'number') {
                errMsg = `Property '${propertyName}' must be a number`;
            }
            
            break;
        
        case String:
            if (type !== 'string') {
                errMsg = `Property '${propertyName}' must be a string`;
            }
            
            break;
            
        case Function:
            if (type !== 'function') {
                errMsg = `Property '${propertyName}' must be a function`;
            }
            
            break;
            
        default:
            if (typeConstr && !(it instanceof typeConstr)) {
                errMsg = `The property '${propertyName}' must be of type '`
                    + typeConstr.name + "'";
            }
        }
    }

    if (!errMsg && constraint) {
        let err =
            typeof constraint === 'function' 
                ? constraint(it)
                : constraint.validate(it);
        
        if (err === false) {
            errMsg = `Illegal value for property '${propertyName}'`;
        } else if (typeof err === 'string') {
            errMsg = `Invalid value for property '${propertyName}' => ${err}`;
        } else if (err && typeof err.message === 'string') {
            errMsg = `Invalid value for property '${propertyName}' => `
                + err.message;
        } else if (err) {
            errMsg = String(err);
        }
    }
    
    
    if (errMsg) {
        ret = new Error(errMsg);
    } 
    
    return ret;
}
