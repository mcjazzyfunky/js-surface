import determineAllMethodNames from '../util/determineAllMethodNames';

const callbackMethodNamesCache = new WeakMap();

export default class Component {
    constructor(props) {
        this.___props = props;
        this.___state = undefined;
        this.___refresh = null;
        this.___updateState = null;

        let callbackMethodNames =
            callbackMethodNamesCache.get(this.constructor);

        if (callbackMethodNames === undefined) {
            callbackMethodNames =
                determineAllMethodNames(this.constructor)
                    .filter(name => name.match(/^on[A-Z]/));

            callbackMethodNamesCache.set(this.constructor, callbackMethodNames);
        }

        for (let i = 0; i < callbackMethodNames.length; ++i) {
            const callbackMethodName = callbackMethodNames[i];

            this[callbackMethodName] = this[callbackMethodName].bind(this);
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(/* prevProps, prevState */) {
    }

    componentWillUnmount() {
    }

    componentDidCatch(/* error, info */) {
    }

    shouldComponentUpdate(/* nextProps, nextState */) {
        return true;
    }

    render() { 
        return null;
    }

    setState(firstArg) {
        if (!this.___updateState) {
            throw new Error('Calling setState within the constructor is not allowed');
        } else {
            const
                typeOfFirstArg = typeof firstArg,
                firstArgIsFunction = typeOfFirstArg === 'function',
                firstArgIsObject = firstArg !== null && typeOfFirstArg === 'object';

            if (firstArgIsFunction) {
                this.___updateState(firstArg);
            } else if (firstArgIsObject) {
                this.___updateState(() => firstArg, state => {
                    const shouldUpdate = this.shouldComponentUpdate(this.props, state);
                    this.___state = Object.assign({}, this.___state, state);

                    if (shouldUpdate) {
                        this.forceUpdate();
                    }
                });
            } else {
                throw new TypeError('First argument of setState must either be a function or an object');
            }
        }
    }

    forceUpdate(callback) {
        if (this.___refresh) {
            this.___refresh(callback);
        }
    }

    get props() {
        return this.___props;
    }

    set props(value) {
        throw new Error('Props are read-only');
    }

    get state() {
        return this.___state;
    }

    set state(state) {
        if (!this.___updateState) {
            this.___state = state;
        } else {
            throw new Error('Use method setState');
        }
    }

    static normalizeComponent(config) {
        const init = (props, refresh, updateState) => {
            const
                component = new this(props),

                render = () => {
                    return component.render();
                },

                receiveProps = props => {
                    const
                        oldProps = component.___props,
                        state = component.___state,
                        needsUpdate = component.shouldComponentUpdate(
                            props, state);

                    component.componentWillReceiveProps(
                        props, state);
                    
                    component.___props = props;


                    if (needsUpdate) {
                        this.___refresh(() => this.componentDidUpdate(oldProps, state));
                    }
                },

                finalize = () => {
                    if (component && component.___updateState) {
                        component.componentWillUnmount();
                    }
                };
            
            
            component.___props = props;
            component.___refresh = refresh;
            component.___updateState = updateState;
            component.componentDidMount();

            const ret = {
                render,
                receiveProps,
                finalize
            };

            if (config.isErrorBoundary) {
                ret.handleError = (error, info) => {
                    component.componentDidCatch(error, info);
                };
            }

            if (config.operations) {
                ret.runOperation = (name, args) => {
                    return component[name](...args);
                };
            }

            return ret;
        };

        return { init };
    }
}
