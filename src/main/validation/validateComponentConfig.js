import { Spec } from 'js-spec';

// --- constants needed for the validation --------------------------
const
    REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_.]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_OPERATION_NAME = /^[a-z][a-zA-Z0-9_-]*$/,

    FORBIDDEN_OPERATION_NAMES = new Set(
        ['props', 'state', 'context', 'shouldComponentUpdate',
            'setState', 'componentWillReceiveProps',
            'componentWillMount', 'componentDidMount',
            'componentWillUpdate', 'componentDidUpdate',
            'componentDidCatch', 'constructor', 'forceUpdate']);

// --- the spec of the component configuration ----------------------

const componentConfigSpec =
    Spec.and(
        Spec.shape({
            displayName:
                Spec.match(REGEX_DISPLAY_NAME),

            properties:
                Spec.optional(
                    Spec.or(
                        {
                            when: Spec.array,

                            check:
                                Spec.and(
                                    Spec.arrayOf(Spec.match(REGEX_PROPERTY_NAME),
                                    Spec.unique))
                        },
                        {
                            when:
                                Spec.any,

                            check:
                                Spec.and(
                                    Spec.object,

                                    Spec.keysOf(
                                        Spec.match(REGEX_PROPERTY_NAME)),

                                    Spec.valuesOf(
                                        Spec.and(
                                            Spec.shape({
                                                type:
                                                    Spec.optional(Spec.function),
                                                
                                                constraint:
                                                    Spec.optional(
                                                        Spec.or(
                                                            Spec.function,
                                                            Spec.extensibleShape({
                                                                validate: Spec.function
                                                            })
                                                        )),

                                                nullable:
                                                    Spec.optional(Spec.boolean),

                                                defaultValue:
                                                    Spec.optional(Spec.any),

                                                getDefaultValue:
                                                    Spec.optional(Spec.function),

                                                inject:
                                                    Spec.optional(
                                                        Spec.or(
                                                            {
                                                                when:
                                                                    Spec.array,

                                                                check:
                                                                    Spec.arrayOf(
                                                                        Spec.extensibleShape({
                                                                            Provider: Spec.isSomething,
                                                                            Consumer: Spec.isSomething
                                                                        }))
                                                            },

                                                            {
                                                                when:
                                                                    Spec.any,

                                                                check:
                                                                    Spec.shape({
                                                                        Provider: Spec.isSomething,
                                                                        Consumer: Spec.isSomething
                                                                    })
                                                            },

                                                        ))
                                            }),
                                        
                                            Spec.valid(
                                                it => !it.hasOwnProperty('defaultValue')
                                                    || it.getDefaultValue === undefined)
                                                .usingHint('Not allowed to set parameters "defaultValue" '
                                                    + 'and "getDefaultValue" both at once'))))
                        })),

            methods:
                Spec.optional(
                    Spec.arrayOf(
                        Spec.and(
                            Spec.match(REGEX_OPERATION_NAME),
                            Spec.notIn(FORBIDDEN_OPERATION_NAMES)))),

            isErrorBoundary:
                Spec.optional(Spec.boolean),

            render:
                Spec.optional(Spec.function),

            init:
                Spec.optional(Spec.function),

            main:
                Spec.optional(
                    Spec.or(
                        Spec.function,
                        Spec.extensibleShape({
                            normalizeComponent: Spec.function
                        })))
        }),

        Spec.valid(config => !!config.render + !!config.init + !!config.main === 1)
            .usingHint('Exactly one of the following parameters must be '
                + ' configured (not more, not less): '
                + ' "render", "init" or "main"'));

// --- the actual configuration validation function -----------------

export default function validateComponentConfig(config) {
    let ret = null;

    if (config === null || typeof config !== 'object') {
        ret = 'Component configuration must be an object';
    } else {
        ret = componentConfigSpec.validate(config);
    }

    return ret;
}
