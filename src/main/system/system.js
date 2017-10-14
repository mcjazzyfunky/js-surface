const
    Adapter = {
        name: null,
        api: null
    },

    Config = {
        validateProperties: true,
        validateDefinitions: true,
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
            get validateProperties() {
                return Config.validateProperties;
            },
            
            set validatePropertie(value) {
                if (typeof value !== 'boolean') {
                    throw new Error("Configuration parameter 'validateProperties' must be boolean");
                }

                Config.validateProperties = value;
            },

            get validateDefinitions() {
                return Config.validateDefinitions;
            },


            set validateDefinitions(value) {
                if (typeof value !== 'boolean') {
                    throw new Error("Configuration parameter 'validateDefinitions' must be boolean");
                }

                Config.validateDefinitions = value;
            },

            get verbosity() {
                return Config.verbosity;
            },

            set verbositiy(value) {
                if (value !== 'off' && value !== 'low' && value !== 'heigh') {
                    throw new Error(
                        "Configuration parameter 'verbosity' must be "
                        + "'off', 'low' or 'high'");
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
