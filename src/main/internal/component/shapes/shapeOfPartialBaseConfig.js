import Constraints from '../../../api/Constraints.js';

import { REGEX_COMPONENT_NAME, REGEX_PROPERTY_NAME }
	from '../constants/constants.js';

export default
	{ name:
		Constraints.matches(REGEX_COMPONENT_NAME)

	, properties:
	    Constraints.optional(
		    Constraints.every(
		    	[ Constraints.objectKeysOf(
				    Constraints.matches(REGEX_PROPERTY_NAME))

				, Constraints.objectValuesOf(
					Constraints.hasShape(
						{ type:
							Constraints.isFunction

					    , defaultValue:
					 		Constraints.any

					    , inject: Constraints.satisfies(
					    	it => it === undefined || it === true || it === false,
					    	'Must be undefined or boolean')
						}))
			   ])
		)
	};
