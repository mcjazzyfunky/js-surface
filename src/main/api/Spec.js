import SpecError from './SpecError.js';

const Spec = {
    isNull(it, path = null) {
        return it === null
            ? null
            : createError('Must be null', path);
    },

    isUndefined(it, path = null) {
        return it === undefined
            ? null
            : createError('Must be undefined', path);
    },

    isBoolean(it, path = null) {
        return typeof it === 'boolean'
          ? null
          : createError('Must be boolean', path);
    },

    isNumber(it, path = null) {
        return typeof it === 'number'
          ? null
          : createError('Must be a number', path);
    },

    isString(it, path = null) {
        return typeof it === 'string'
          ? null
          : createError('Must be a string', path);
    },

    isObject(it, path = null) {
        return it !== null && typeof it === 'object'
          ? null
          : createError('Must be an object', path);
    },

    isArray(it, path = null) {
        return Array.isArray(it)
          ? null
          : createError('Must be an array', path);
    },

    isFunction(it, path = null) {
        return typeof it === 'function'
          ? null
          : createError('Must be a function', path);
    },

    optional(constraint, path = null) {
    	return it => it === undefined || it === null
    		? null
    		: constraint(it);
    },

    isOneOf(items) {
        return (it, path) => !items.every(item => item !== it)
          ? null
          : createError('Must be one of: ' + items.join(', '));
    },

    matches(regex) {
        return (it, path = null) => {
            let ret = null;

            if (typeof it !== 'string') {
              ret = createError('Must be a string', path);
            } else if (!it.match(regex)) {
              ret = createError('Must match regex ' + regex, path);
            }

            return ret;
        };
    },

    satisfies(condition, errMsg = null) {
		return (it, path = null) => {
			let ret = null;

			if (!condition(it)) {
				ret = createError(errMsg || 'Invalid value', path);
			}

			return ret;
		};
    },

    isInstanceOf(type) {
        return (it, path = null) => it instanceof type
          ? null
          : createError('Must be instance of ' + type);
    },

    isIterable(path = null) {
        return (it, path) => it !== null
            && typeof it === 'object'
            && typeof it[Symbol.iterator] === 'function'
            ? null
            : createError('Must be iterable', path);
    },

    objectKeysOf(constraint) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object', path);
            } else {
                for (let key of Object.keys(it)) {
                    const error = constraint(key);

                    if (error) {
                        ret = createError(`Key '${key}' is invalid: ${error.shortMessage}`, path);
                        break;
                    }
                }
            }

            return ret;
        };
    },

    objectValuesOf(constraint) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object');
            } else {
                for (let key of Object.keys(it)) {
                    const
                        value = it[key],
                        subPath = buildSubPath(path, key);

                    const error = constraint(value, subPath);

                    if (error) {
                        // TODO
                        ret = error;
                        break;
                    }
                }
            }

            return ret;
        };
    },

    hasShape(shape, allowExtension = false) {
        return (it, path) => {
            let ret = null;

            if (it === null || typeof it !== 'object') {
                ret = createError('Must be an object', path);
            } else {
                for (const key of Object.keys(shape)) {
                	 const subPath = buildSubPath(path, key);

                     ret = shape[key](it[key], subPath);

                    if (ret) {
                        break;
                    }
                }
            }

            return ret;
        };
    },

    any(path = null) {
        return null;
    },

    every(constraints) {
        return (it, path = null) => {
            let ret = null;

            for (let constraint of constraints) {
                const error = constraint(it, path);

                if (error) {
                    ret = error;
                    break;
                }
            }

            return ret;
        };
    },

    some(constraints, path = null) {
        let ret = null;

        if (constraints && typeof constraints[Symbol.iterator] === 'function') {
            ret = (it, path = null) =>
                !constraints.every(constraint => constraint(it, path))
                ? null
                : createError('Invalid value', path);
        } else if (constraints !== null && typeof constraints === 'object') {
            const keys = Object.keys(constraints);

            ret = (it, path = null) => {
                let foundSome = false;

                for (let key of keys) {
                    const
                        constraint = constraints[key],
                        result = constraint(it, path);

                    if (result === null) {
                        foundSome = true;
                        break;
                    }
                }

                return foundSome
                    ? null
                    : createError(
                        'Invalid value (allowed would be <'
                        + keys.join('> or <')
                        + '>)', path);
            };
        } else {
            // TODO
        }

        return ret;
    }
};

Object.freeze(Spec);

export default Spec;

// --- Local functions ----------------------------------------------

function buildSubPath(path, key) {
	let ret = null;

	if (path !== undefined && path !== null) {
    	ret = !path ? key : `${path}.${key}`;
	}

	return ret;
}

function createError(errMsg, path)  {
    const
        fullErrMsg =
            'Constraint violation'
                + (path ? ` at '${path}'` : '')
                + `: ${errMsg}`;

    return new SpecError(fullErrMsg, errMsg, path);
}

