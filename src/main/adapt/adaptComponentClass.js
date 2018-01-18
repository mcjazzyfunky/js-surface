export default function adaptComponentClass(defineComponent) {
    class Component {
        constructor() {
            this.___props = undefined;
            this.___state = undefined;
            this.___prevProps = undefined;
            this.___prevState = undefined;
            this.___updateView = null;
            this.___forwardState = null;
            this.___initialized = false;

            // this.___callbackWhenUpdated =
            //    this.___callbackWhenUpdated.bind(this);

            for (const key in this) {
                if (typeof this[key] === 'function') {
                    this[key] = this[key].bind(this);
                }
            }
        }

        get props() {
            return this.___props;
        }

        get state() {
            return this.___state;
        }

        set state(state) {
            if (!this.___updateView) {
                this.___state = state;
            } else {
                this.___update(this.___props, state, true, false);
            }
        }

        onWillMount() {
        }

        onDidMount() {
        }

        onWillReceiveProps(/* nextProps */) {
        }

        shouldUpdate(/* nextProps, nextState */) {
            return true;
        }

        onWillUpdate(/* nextProps, nextState */) {
        }

        onDidUpdate(/* prevProps, prevState */) {
        }

        onWillChangeState(/* nextState */) {
        }

        onDidChangeState(/* prevState */) {
        }

        onWillUnmount() {
        }

        onDidCatchError(/* error, info */) {
        }

        forceUpdate() {
            if (this.___updateView) {
                this.___update(this.___props, this.___state, false, true);
            }
        }

        render() {
            return null;
        }

        provide() {
            return null;
        }

        ___init(updateView, forwardState) {
            this.___updateView = updateView;
            this.___forwardState = forwardState;
            forwardState(this.___state);
        }

        ___update(nextProps, nextState, stateChanged, force) {
            const needsUpdate = force || this.shouldUpdate(nextProps, nextState);

            if (needsUpdate) {
                this.onWillUpdate(nextProps, nextState);
            }
            
            if (stateChanged) {
                this.onWillChangeState(nextState);
            }
            
            this.___prevProps = this.___props;
            this.___prevState = this.___state;
            this.___props = nextProps;
            this.___state = nextState;

            if (stateChanged) {
                this.onDidChangeState(this.___prevState);
            }

            if (needsUpdate) {
                this.___updateView(
                    this.render(),
                    this.___meta.provides ? this.provide() : null,
                    this.___callbackWhenUpdated);
            }
        }
        
        ___callbackWhenUpdated() {
            if (!this.___initialized) {
                this.___initialized = true;
                this.onDidMount();
            } else {
                this.onDidUpdate(this.___prevProps, this.___prevState);
            }
        }
    }

    Component.asFactory = function () {
        const
            componentClass = this,
            meta = determineComponentMeta(componentClass),
            init = buildInitFunction(componentClass),
            config = Object.assign({ init }, meta);

        return defineComponent(config);
    };

    function determineComponentMeta(componentClass) {
        const
            ret = {},
            displayName = componentClass.displayName,
            properties = componentClass.properties,
            publicMethods = componentClass.publicMethods,
            provides = componentClass.provides,

            hasProperties = properties !== undefined && properties !== null,
            hasPublicMethods  = publicMethods !== undefined && publicMethods !== null,
            hasProvides = provides !== undefined && provides !== null;
            
        ret.displayName = displayName;

        if (hasProperties && properties !== null) {
            if (typeof properties !== 'object') {
                throw new Error("Meta field 'properties' must be an object");
            }

            ret.properties = properties;
        }

        if (hasPublicMethods && publicMethods !== null) {
            if (!Array.isArray(publicMethods)) {
                throw new Error("Meta field 'publicMethods' must be an array");
            }

            ret.methods = publicMethods;
        }

        if (hasProvides && provides !== null) {
            if (!Array.isArray(provides)) {
                throw new Error("Meta field 'provides' must be an array");
            }

            ret.provides = provides;
        }

        const onDidCatchError = componentClass.prototype.onDidCatchError;

        if (typeof onDidCatchError === 'function'
            && onDidCatchError !== Component.prototype.onDidCatchError) {
        
            ret.isErrorBoundary = true;
        }

        return ret;
    }

    function buildInitFunction(componentClass) {
        class CustomComponent extends componentClass {
            constructor(props) {
                super(props);
            }
        }

        const meta = determineComponentMeta(componentClass); 

        CustomComponent.prototype.___meta = meta;

        return (updateView, forwardState) => {
            let component = null;

            const
                setProps = props => {
                    if (!component) {
                        component = new CustomComponent(props);
                        component.___props = props;
                        component.___init(updateView, forwardState);
                        component.onWillMount();
                    } else {
                        if (component.shouldUpdate(props, component.state)) {
                            component.onWillUpdate();
                        }
                    }

                    updateView(
                        component.render(),
                        meta.provides ? component.provide() : null,
                        component.___callbackWhenUpdated);
                },

                close = () => {
                    if (component) {
                        component.onWillUnmount();
                        component = null;
                    }
                };


            const ret = { setProps, close };

            if (meta.methods) {
                ret.applyMethod = (methodName, args) => {
                    return component
                        ? component[methodName](...args)
                        : undefined; 
                };
            }

            if (meta.isErrorBoundary) {
                ret.handleError = (error, info) => {
                    if (component) {
                        component.onDidCatchError(error, info);
                    }
                };
            }

            return ret;
        };
    }

    return Component;
}
