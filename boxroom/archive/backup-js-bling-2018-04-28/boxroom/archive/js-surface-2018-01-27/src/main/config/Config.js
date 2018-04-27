import ConfigValues from './ConfigValues';

export default Object.freeze({
    get validateProps() {
        return ConfigValues.validateProps;
    },
    
    set validateProps(value) {
        if (typeof value !== 'boolean') {
            throw new Error(
                "Configuration parameter 'validateProps' must be boolean");
        }

        ConfigValues.validateProps = value;
    },

    get validateDefs() {
        return ConfigValues.validateDefs;
    },


    set validateDefs(value) {
        if (typeof value !== 'boolean') {
            throw new Error(
                "Configuration parameter 'validateDefs' must be boolean");
        }

        ConfigValues.validateDefs = value;
    }
});
