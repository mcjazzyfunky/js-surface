export class InnerComponent {
    constructor(config, updateView, updateState) {
        this.__view = null;
        this.__state = null;
        this.__updateView = updateView;
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

        if (result === null) {
            throw new Error("Component's init function must not return null");
        } else if (typeof result !== 'object') {
            throw new Error("Component's init function must return an object");
        } else if (typeof result.receiveProps !== 'function') {
            throw new Error("Parameter 'receiveProps' in component's init result must be a function");
        } else if (!result.instance || typeof result.instance !== 'object') {
            throw new Error("Parmater 'instance' of component's init result must be an object");
        } else if (typeof result.forceUpdate !== 'function') {
            throw new Error("Parameter 'forceUpdate' of component's init result must be a function");
        } else {
            const keys = Object.keys(result);

            if (keys.length > 3) {
                for (const key of keys) {
                    if (key !== 'receiveProps' && key !== 'instance' && key !== 'forceUpdate') {
                        throw new Error(`Invalid key '${key}' in result of component's init function`);
                    }
                }
            }
        }

        this.__receiveProps = result.receiveProps;
        this.__instance = result.instance;
        this.__publicMethods = config.publicMethods || null;
        
        this.__namesOfPublicMethods =
            this.__publicMethods
            ? Object.keys(this.__publicMethods)
            : null;
            
        this.__provide =
            config.childInjections
            ? config.childInjections.provide
            : null;
    }

    consumeProps(props) {
        this.__receiveProps(props);
    }

    provideChildInjections() {
        return this.__provide
            ? this.__provide.apply(this.__instance)
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
            this.__forceUpdate.apply(this.__instance);
        }
    }
}
