const
    Adapter = {
        name: null,
        api: null
    },

    Config = {
        validateProps: true,
        validateDefs: true,
        verbosity: 'off'
    },

    ComponentSystem = Object.freeze({
        adapter: Object.freeze({
            get name() {
                return Adapter.name;
            },

            get api() {
                return Adapter.api;
            }
        }),

        config: Object.freeze({
            get validateProps() {
                return Config.validateProps;
            },
            
            set validateProps(value) {
                if (typeof value !== 'boolean') {
                    throw new Error("Configuration parameter 'validateProps' must be boolean");
                }

                Config.validateProps = value;
            },

            get validateDefs() {
                return Config.validateDefs;
            },


            set validateDefs(value) {
                if (typeof value !== 'boolean') {
                    throw new Error("Configuration parameter 'validateDefs' must be boolean");
                }

                Config.validateDefs = value;
            },

            get verbosity() {
                return Config.verbosity;
            },

            set verbositiy(value) {
                if (value !== 'off' && value !== 'low'
                    && value !== 'medium' && value !== 'heigh') {
                
                    throw new Error(
                        "Configuration parameter 'verbosity' must be "
                        + "'off', 'low'. 'medium' or 'high'");
                }

                Config.verbosity = value;
            }
        })
    });

export {
    Adapter,
    Config,
    ComponentSystem
};
