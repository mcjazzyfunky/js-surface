import {
    REGEX_DISPLAY_NAME,
    REGEX_PROPERTY_NAME,
    REGEX_METHOD_NAME,
    FORBIDDEN_METHOD_NAMES
} from '../constant/constants';

import { Spec } from 'js-spec';

const componentConfigSpec =
    Spec.and(
        Spec.shape({
            displayName: Spec.match(REGEX_DISPLAY_NAME),
            
            properties:
                Spec.optional(
                    Spec.or(
                        {
                            when: Spec.array,
                            check: Spec.arrayOf(Spec.match(REGEX_PROPERTY_NAME))

                        },
                        {
                            when: Spec.object,

                            check:
                                Spec.and(
                                    Spec.object,
                                    Spec.keysOf(Spec.match(REGEX_PROPERTY_NAME)),

                                    Spec.valuesOf(
                                        Spec.and(
                                            Spec.shape({
                                                type:
                                                    Spec.optional(Spec.function),
                                                
                                                constraint:
                                                    Spec.optional(
                                                        Spec.or(
                                                            Spec.function,
                                                            Spec.struct({
                                                                validate: Spec.function
                                                            }))
                                                            .usingHint(
                                                                'Must either be function or an'
                                                                    + 'object containing a '
                                                                    + "function 'validate'")),

                                                nullable: Spec.optional(Spec.boolean),

                                                defaultValue:
                                                    Spec.optional(Spec.any),
                                                    
                                                getDefaultValue:
                                                    Spec.optional(Spec.function),
                                                                
                                                inject:
                                                    Spec.optional(Spec.boolean)
                                            }),
                                        
                                            Spec.valid(it => !it.getDefaultValue
                                                || !it.hasOwnProperty('defaultValue'))
                                                .usingHint("Not allowed to provide 'defaultValue' "
                                                    + "and 'getDefaultValue' at the same time"))))
                        })),
                                
            render:
                Spec.optional(Spec.function),
                
            init:
                Spec.optional(Spec.function),
                
            methods:
                Spec.optional(
                    Spec.and(
                        Spec.and(
                            Spec.arrayOf(
                                Spec.match(REGEX_METHOD_NAME)),
                            
                            Spec.notIn(FORBIDDEN_METHOD_NAMES))
                        .usingHint('Invalid method name'),
                        Spec.unique)),
                
            provides:
                Spec.optional(
                    Spec.and(
                        Spec.arrayOf(Spec.match(REGEX_PROPERTY_NAME),
                        Spec.uniqe))),

            isErrorBoundary:
                Spec.optional(Spec.boolean)
        }),

        Spec.valid(config => config.render || config.init)
            .usingHint(
                "Must have either function 'render' or function 'init'"),
        
        Spec.valid(config => !config.render || !config.init)
            .usingHint(
                "Must have either function 'render' or function 'init', "
                    + 'not both at the same time'));
                    
export default function validateComponentConfig(config) {
    let ret = null;

    const error = componentConfigSpec.validate(config);
    
    if (error) {
        if (!config || typeof config.displayName !== 'string') {
            ret = new Error(
                `Invalid component configuration => ${error.message}`);
        } else {
            ret = new Error('Invalid component configuration '
                + `for '${config.displayName}' => ${error.message}`);
        }
    }
    
    return ret;
}
