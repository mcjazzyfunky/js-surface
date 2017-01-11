import lowerCaseFirstChar from '../util/lowerCaseFirstChar';

export default function defineMessage(
	className, categoryName, baseMessageClass, initialize) {

	const
		typeName = lowerCaseFirstChar(className),

		constructor = function (...args) {
  		let ret = this;

  		if (this instanceof constructor) {
				throw new Error(`Message constructor '${className}' must be `
					+ "called without 'new' operator");
  		}

  		if (!(this instanceof constructor)) {
  		    ret = Object.create(constructor.prototype);
  		    ret.type = typeName;

  			if (categoryName) {
  				  ret.category = categoryName;
  			}


  			const initResult = initialize(...args);

  			if (initResult === null) {
  				// nothing to do
  			} else if (typeof initResult ==='object') {
  				Object.assign(ret, initResult);
  			} else if (typeof initResult === 'function') {
  				ret.apply = initResult;
  			} else {
  				throw new Error('The initialization function of message type '
  					+ `'${className}' has returned an invalid value`);
  			}
  		}

			return ret;
	};

	constructor.prototype = Object.create(baseMessageClass.prototype);
	constructor.prototype.toString = () => `#<Message instance of type '${className}'>`;

	constructor.toString = () => `#<Message class '${className}'>`;
	constructor[Symbol.toStringTag] = constructor.toString;
	constructor.parentConstructor = baseMessageClass;
	constructor.kind = className;
	constructor.type = typeName;
	constructor.category = categoryName;
	Object.freeze(constructor);

	return constructor;
}
