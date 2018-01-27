import PropTypes from 'prop-types';

export default function convertPropType(
    propType, propName, componentDisplayName) {
    
    const propTypes = { [propName]: propType };

    return it => {
        let ret = null;

        PropTypes.checkPropTypes(
            propTypes,
            { [propName]: it},
            'property',
            componentDisplayName,
            () => { ret = new Error('Invalid value'); });

        return ret;
    };
}
