export default function adaptCreateElement(
    {
        createElement,
        attributeAliases = null,
        attributeAliasesByTagName = null,
        argumentsMapper = null
    }) {

    let
        attributeAliasesEntries = null,
        attributeAliasesEntriesByTagName = null,
        
        needsPropNameAdjustment =
            !!(attributeAliases || attributeAliasesByTagName);

    if (attributeAliases) {
        attributeAliasesEntries = Object.entries(attributeAliases);
    }

    if (attributeAliasesByTagName) {
        attributeAliasesEntriesByTagName = {};

        for (const key of Object.keys(attributeAliasesByTagName)) {
            const entries = Object.entries(attributeAliasesByTagName[key]);

            attributeAliasesEntriesByTagName[key] = entries;
        }
    }

    const adaptedCreateElement = (...args) =>  {
        if (argumentsMapper) {
            args = argumentsMapper(args);
        }

        if (needsPropNameAdjustment) {
            const
                type = args[0],
                props = args[1];

            if (typeof type === 'string'
                && props
                && typeof props === 'object') {
                
                const adjustedProps = adjustPropNames(
                    props, type, attributeAliasesEntries,
                    attributeAliasesEntriesByTagName);

                if (adjustedProps !== props) {
                    args[1] = adjustedProps;
                }
            }
        }

        return createElement.apply(null, args);
    };

    return adaptedCreateElement;
}

function adjustPropNames(
    props, tagName,
    attributeAliasesEntries, attributeAliasesEntriesByTagName) {

    let ret = props;

    if (attributeAliasesEntries) {
        for (let i = 0; i < attributeAliasesEntries.length; ++i) {
            const
                [key, alias] = attributeAliasesEntries[i],
                value = props[key];

            if (value !== undefined) {
                if (ret === props) {
                    ret = Object.assign({}, props);
                }

                delete ret[key];
                ret[alias] = value;
            }
        }
    }

    const entries = attributeAliasesEntriesByTagName
        ? attributeAliasesEntriesByTagName[tagName]
        : null;
    
    if (entries) {
        for (let i = 0; i < entries.length; ++i) {
            const
                [key, alias] = entries[i],
                value = ret[key];

            if (value !== undefined) {
                if (ret === props) {
                    ret = Object.assign({}, props);
                }

                delete ret[key];
                ret[alias] = value;
            }
        }
    }

    return ret;
}
