import convertPropType from './convertPropType';

const
    allowedMetaFieldNames = new Set(
        ['displayName', 'properties', 'methods', 'provides',
            'propTypes', 'defaultProps']);

export default function determineComponentMeta(subject, functional) {
    const
        subjectType = typeof subject,
        subjectIsFunction = subjectType === 'function',
        subjectIsObject = subject !== null && typeof subject === 'object';

    if (!subjectIsFunction && !subjectIsObject) {
        throw new Error(
            "First argument 'subject' must either be an function "
            + 'or an object');
    } else if (typeof functional !== 'boolean') {
        throw new Error(
            "Second argumet 'functional' must be boolean");
    }

    const
        ret = {},
        displayName = subject.displayName || 'Anonymous',

        properties = subject.properties,
        methods = subject.methods,
        provides = subject.provides,

        hasProperties = properties !== undefined,
        hasMethods  = methods !== undefined,
        hasProvides = provides !== undefined,
        
        hasSurfaceOnlyMeta =
            hasProperties
            || hasMethods
            || hasProvides,

        propTypes = subject.propTypes,
        defaultProps = subject.defaultProps,
        contextTypes = subject.contextTypes,
        childContextTypes = subject.childContextTypes,

        hasPropTypes = propTypes !== undefined,
        hasDefaultProps = defaultProps !== undefined,
        hasContextTypes = contextTypes !== undefined,
        hasChildContextTypes = childContextTypes !== undefined,

        hasReactOnlyMeta =
            hasPropTypes
            || hasDefaultProps
            || hasContextTypes
            || hasChildContextTypes;
            
    if (hasSurfaceOnlyMeta && hasReactOnlyMeta) {
        throw new Error(
            'Mixing of jsSurface specific and React specific meta '
            + 'information is not allowed '
            + '({ properties, methods, provides } vs. '
            + '{ propTypes, defaultProps, contextTypes, childContextTypes })');
    } else if (hasContextTypes || hasChildContextTypes) {
        throw new Error(
            "Meta information for 'contextTypes' and 'childContextTypes' "
            + 'is not supported');
    } else if (
        hasSurfaceOnlyMeta
        && functional
        && (hasMethods || hasProvides)) {

        throw new Error(
            "Meta information for 'methods' and 'provides' "
            + 'is not allowed for functional components');
    }

    if (subjectIsObject) {
        for (const key of Object.keys(subject)) {
            if (!allowedMetaFieldNames.has(key)) {
                throw new Error(
                    "Meta information with key '${key}' is not allowed");
            }
        }
    }

    ret.displayName = displayName;

    if (hasSurfaceOnlyMeta) {
        if (hasProperties && properties !== null) {
            if (typeof properties !== 'object') {
                throw new Error("Meta field 'properties' must be an object");
            }

            ret.properties = properties;
        }

        if (hasMethods && methods !== null) {
            if (!Array.isArray(methods)) {
                throw new Error("Meta field 'methods' must be an array");
            }

            ret.methods = methods;
        }

        if (hasProvides && provides !== null) {
            if (!Array.isArray(provides)) {
                throw new Error("Meta field 'provides' must be an array");
            }

            ret.provides = provides;
        }
    } else {
        if (hasPropTypes && propTypes !== null) {
            if (typeof propTypes !== 'object') {
                throw new Error("Meta field 'propTypes' must be an object");
            }

            for (const key of Object.keys(propTypes)) {
                const propType = propTypes[key];

                if (typeof propType !== 'function') {
                    throw new Error(
                        `Meta field 'propTypes.${key}' must be a function`);
                }

                if (!ret.properties) {
                    ret.properties = {};
                }

                ret.properties[key] = {
                    constraint: convertPropType(propType, key, displayName),
                    defaultValue: undefined
                };
            }           
        }

        if (hasDefaultProps && defaultProps !== null) {
            if (typeof defaultProps !== 'object') {
                throw new Error("Meta field 'defaultProps' must be an object");
            }

            for (const key of Object.keys(defaultProps)) {
                if (!ret.properties) {
                    ret.properties = {};
                }

                if (!ret.properties[key]) {
                    ret.properties[key] = {};
                }

                ret.properties[key].defaultValue = defaultProps[key];
            }
        }
    }

    return ret;
}
