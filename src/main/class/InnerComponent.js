import validateInitResult from '../validation/validationInitResult';

export class InnerComponent {
    constructor(config, updateView, updateState) {
        this.__config = config;
        this.__view = null;
        this.__state = null;
        this.__updateView = updateView;
        this.__updateState = updateState;
        this.__isInitialized = false;

        const result = config.init(
            view => {
                this.__view = view;
                updateView(view);
                this.__isInitialized = true;
            },

            state => {
                this.__state = state;
                updateState(state);
            });
        
        const error = validateInitResult(result, config);

        if (error) {
            throw error;
        }

        this.__receiveProps = result.receiveProps;
        this.__forceUpdate = result.forceUpdate;
        this.__applyPublicMethod = config.applyPublicMethod || null;
        this.__provideChildInjections = config.provideChildInjections || null;
    }

    getConfig() {
        return this.__config;
    }

    receiveProps(props) {
        this.__receiveProps(props);
    }

    getNamsOfPublicMethods() {
        return this.__config.publicMethods || null;
    }

    applyPublicMethod(methodName, args) {
        if (!this.__config.publicMethods || !this.__config.publicMethods.includes(methodName)) {
            throw new Error(
                `Tried to call unknown public method '${methodName}' `
                + `on component of type '${this.__config.displayName}'`);
        }

        return this.__applyPublicMethod(methodName, args);
    }

    hasChildInjections() {
        return !!this.__provideChildInjections;
    }
    
    provideChildInjections() {
        return this.__provideChildInjections
            ? this.__provideChildInjections()
            : null;
    }

    // TODO: really needed?
    getView () {
        return this.__view;
    }

    // TODO: really needed?
    getState() {
        return this.__state;
    }

    forceUpdate() {
        if (this.__isInitialized) {
            this.__forceUpdate();
        }
    }
}
