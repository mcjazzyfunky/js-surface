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
    },

    get verbosity() {
        return ConfigValues.verbosity;
    },

    set verbositiy(value) {
        if (value !== 'off' && value !== 'low'
            && value !== 'medium' && value !== 'heigh') {
        
            throw new Error(
                "Configuration parameter 'verbosity' must be "
                + "'off', 'low'. 'medium' or 'high'");
        }

        ConfigValues.verbosity = value;
    }
});
