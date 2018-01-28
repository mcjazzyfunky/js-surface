import { Spec } from 'js-spec';

// constants needed for the validation
const
    FORBIDDEN_OPEN_METHOD_NAMES = new Set([
        'props', 'state', 'shouldComponentUpdate',
        'setState', 'componentWillReceiveProps',
        'componentWillMount', 'componentDidMount',
        'componentWillUpdate', 'componentDidUpdate',
        'componentDidThrow', 'context',
        'constructor', 'forceUpdate']),

    REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_METHOD_NAME = /^[a-z][a-zA-Z0-9_-]*$/;

// validation rules
const componentConfigSpec =
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

                                            nullable:
                                                Spec.optional(Spec.boolean),

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

        operations:
            Spec.optional(
                Spec.and(
                    Spec.arrayOf(Spec.match(REGEX_METHOD_NAME)),
                    
                    Spec.notIn(FORBIDDEN_OPEN_METHOD_NAMES))
                        .usingHint('Invalid method name'),

                    Spec.unique),
            
        childContextKeys:
            Spec.optional(
                Spec.and(
                    Spec.arrayOf( Spec.match(REGEX_PROPERTY_NAME)),
                    Spec.uniqe)),

        isErrorBoundary: Spec.optional(Spec.boolean)
    }); 

export default function validateComponentMeta(meta) {
    let ret = null;

    const error = componentConfigSpec.validate(meta);
    
    if (error) {
        if (!meta || typeof meta.displayName !== 'string') {
            ret = new Error(
                `Invalid component meta data => ${error.message}`);
        } else {
            ret = new Error('Invalid component meta data '
                + `for '${meta.displayName}' => ${error.message}`);
        }
    }
    
    return ret;
}
