
export default function adaptComponentClass(defineComponent) {
    const methodNamesByClassId = new Map();

    let nextClassId = 1;

    class Component {
        constructor(props) {
            this.___props = props;
            this.___state = undefined;
            this.___prevProps = undefined;
            this.___prevState = undefined;
            this.___updateView = null;
            this.___forwardState = null;
            this.___initialized = false;

            this.___callbackWhenUpdated =
                this.___callbackWhenUpdated.bind(this);

            const componentClass = this.constructor;

            let
                methodNames,
                classId = componentClass.___id;

            if (!classId) {
                const methodNameSet = new Set();
                
                classId = nextClassId++;
                componentClass.___id = classId;

                let obj = this;

                do {
                    const propertyNames = Object.getOwnPropertyNames(obj);

                    for (const methodName of propertyNames) {
                        if (typeof obj[methodName] === 'function'
                                && methodName.startsWith('on')
                                && methodName[2] >= 'A'
                                && methodName[2] <= 'Z') {
                            methodNameSet.add(methodName);
                        }
                    }

                    obj = Object.getPrototypeOf(obj);
                } while (obj != Object.prototype);

                methodNames = Array.from(methodNameSet);
                methodNamesByClassId[classId] = methodNames; 
            } else {
                methodNames = methodNamesByClassId[classId]; 
            }

            for (let i = 0; i < methodNames.length; ++i) {
                const
                    methodName = methodNames[i],
                    method = this[methodName];

                if (typeof method === 'function') {
                    this[methodName] = method.bind(this);
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

        componentWillMount() {
        }

        componentDidMount() {
        }

        componentWillReceiveProps(/* nextProps */) {
        }

        shouldComponentUpdate(/* nextProps, nextState */) {
            return true;
        }

        componentWillUpdate(/* nextProps, nextState */) {
        }

        componentDidUpdate(/* prevProps, prevState */) {
        }

        componentWillChangeState(/* nextState */) {
        }

        componentDidChangeState(/* prevState */) {
        }

        componentWillUnmount() {
        }

        componentDidCatch(/* error, info */) {
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
            const needsUpdate = force || this.shouldComponentUpdate(nextProps, nextState);

            if (needsUpdate) {
                this.componentWillUpdate(nextProps, nextState);
            }
            
            if (stateChanged) {
                this.componentWillChangeState(nextState);
            }
            
            this.___prevProps = this.___props;
            this.___prevState = this.___state;
            this.___props = nextProps;
            this.___state = nextState;

            if (stateChanged) {
                this.componentDidChangeState(this.___prevState);
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
                this.componentDidMount();
            } else {
                this.componentDidUpdate(this.___prevProps, this.___prevState);
            }
        }
    }

    Object.defineProperty(Component, 'factory', {
        get() {
            const componentClass = this;

            let factory = componentFactories.get(componentClass);

            if (!factory) {
                const
                    meta = determineComponentMeta(componentClass),
                    init = buildInitFunction(componentClass),
                    config = Object.assign({ init }, meta);
                
                factory = defineComponent(config);
                componentFactories.set(componentClass, factory);
            }

            return factory;
        }
    });

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

        const componentDidCatch = componentClass.prototype.componentDidCatch;

        if (typeof componentDidCatch === 'function'
            && componentDidCatch !== Component.prototype.componentDidCatch) {
        
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
                        component.componentWillMount();
                    } else {
                        if (component.shouldComponentUpdate(props, component.state)) {
                            component.componentWillUpdate();
                        }
                    }

                    updateView(
                        component.render(),
                        meta.provides ? component.getChildContext() : null,
                        component.___callbackWhenUpdated);
                },

                close = () => {
                    if (component) {
                        component.componentWillUnmount();
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
                        component.componentDidCatch(error, info);
                    }
                };
            }

            return ret;
        };
    }

    return Component;
}

// --- locals -------------------------------------------------------

const componentFactories = new Map();
