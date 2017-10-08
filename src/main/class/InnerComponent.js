import validateInitResult from '../validation/validateInitResult';

export default class InnerComponent {
    constructor(config, updateView, updateState) {
        const
            result = config.init(updateView, updateState),
            error = validateInitResult(result, config);

        if (error) {
            throw error;
        }

        this.__config = config;
        this.__receiveProps = result.receiveProps;
        this.__forceUpdate = result.forceUpdate;
        this.__applyPublicMethod = result.applyPublicMethod || null;
        this.__provideChildInjections = result.provideChildInjections || null;
    }

    receiveProps(props) {console.log('receiveProps2')
        this.__receiveProps(props);
    }

    forceUpdate() {console.log('forceUpdate2')
        this.__forceUpdate();
    }

    applyPublicMethod(methodName, args) {
        if (!this.__config.publicMethods || !this.__config.publicMethods.includes(methodName)) {
            throw new Error(
                `Tried to call unknown public method '${methodName}' `
                + `on component of type '${this.__config.displayName}'`);
        }

        return this.__applyPublicMethod(methodName, args);
    }

    provideChildInjections() {
        return this.__provideChildInjections
            ? this.__provideChildInjections()
            : null;
    }
}
