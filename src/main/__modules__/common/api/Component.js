import determineAllMethodNames from '../internal/determineAllMethodNames';

const callbackMethodNamesCache = new Map();

export default class Component {
    constructor(props) {
        this.___props = props;
        this.___state = undefined;
        this.___updateView = null;
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

    componentWillMount() {
    }
    
    componentDidMount() {
    }

    componentWillReceiveProps(/* props */) {
    }

    componentWillUpate(/* nextProps, nextState */) {
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

    getChildContext() {
        return null;
    }

    render() {
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
        if (this.___updateView) {
            const view = this.render();

            this.___updateView(view, this.getChildContext(), callback);
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

    static normalizeComponent(meta) {
        return (updateView, updateState) => {
            let
                component = null,
                content = null;

            const
                setProps = props => {
                    let needsUpdate = false;

                    if (component === null) {
                        component = new this(props);
                        component.___updateView = updateView;
                        component.___updateState = updateState;
                        component.componentDidMount();
                        needsUpdate = true;
                    } else {
                        component.componentWillReceiveProps(
                            component.___props, component.___state);
                        
                        needsUpdate = component.shouldComponentUpdate(
                            props, component.___state);
                    }

                    if (needsUpdate) {
                        needsUpdate = false;
                        content = component.render();
                        
                        const childContext = component.getChildContext();
                        const callbackWhenDone = null; // TODO

                        updateView(content, childContext, callbackWhenDone);
                    }
                },

                close = () => {
                    if (component && component.___updateState) {
                        component.componentWillUnmount();
                    }
                };

            const ret = {
                setProps,
                close
            };

            if (meta.isErrorBoundary) {
                ret.handleError = (error, info) => {
                    component.componentDidCatch(error, info);
                };
            }

            if (meta.operations) {
                ret.runOperation = (name, args) => {
                    return component[name](...args);
                };
            }

            return ret;
        };
    }
}
