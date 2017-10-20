import determineDisplayName from './determineDisplayName';

import PropTypes from 'prop-types';

export default determinePropertiesConfig;

function determinePropertiesConfig(componentClass) {
    const
        properties =  {},
        { propTypes, defaultProps } = componentClass,
        displayName = determineDisplayName(displayName);

    if (propTypes && typeof propTypes === 'object') {
        for (let key of Object.keys(propTypes)) {
            properties[key] = {
                nullable: true,
                defaultValue: undefined
            };

            const propType = propTypes[key];

            if (typeof propType === 'function') {
                properties[key].constraint =
                    convertPropType(propType, key, displayName);
            } else {
                throw `Illegal prop type for property '${key}' - must be a function`;
            }
        }
    }  

    if (defaultProps && typeof defaultProps === 'object') {
        for (let key of Object.keys(defaultProps)) {
            properties[key] =
                properties[key]
                || { nullable: true, defaultValue: undefined };
            
            properties[key].defaultValue = defaultProps[key];
        }
    }

    return Object.keys(properties).length > 0
        ? properties
        : null;
}

function convertPropType(propType, propName, componentDisplayName) {
    const propTypes = { [propName]: propType };

    return it => {
        let ret = null;

        PropTypes.checkPropTypes(
            propTypes,
            { [propName]: it},
            'prop',
            componentDisplayName,
            () => { ret = new Error('Invalid value'); });

        return ret;
    };
}

