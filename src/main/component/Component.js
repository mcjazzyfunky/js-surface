export default class Component {
    constructor(props) {
        this.___props = props;
        this.___state = undefined;
        this.___updateState = null;
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
    }

    render() {
    }

    setState(firstArg, callback) {
        if (!this.___updateState) {
            throw new Error('Calling setState within the constructor is not allowed');
        } else {
            const
                typeOfFirstArg = typeof firstArg,
                firstArgIsFunction = typeOfFirstArg === 'function',
                firstArgIsObject = firstArg !== null && typeOfFirstArg === 'object';

            if (firstArgIsFunction) {
                this.___updateState(firstArg, () => console.log(firstArg(this.___state)));
            } else if (firstArgIsObject) {
                this.___updateState(() => firstArg, state => {
                    this.___state = state;
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

    set state(newState) {
        if (!this.___updateState) {
            this.___state = newState;
        } else {
            throw new Error('Use method setState');
        }
    }

    static buildComponentInitializer(meta) {
        return (updateView, updateState) => {
            let
                component = null,
                content = null;

            const
                setProps = props => {
                    let needsUpdate = false;

                    if (component === null) {console.log(2222)
                        component = new this(props);
                        component.___updateiew = updateView;
                        component.___updateState = updateState;
                        component.componentDidMount();
                        needsUpdate = true;
                    } else {
                        component.componentWillReceiveProps(
                            component.___props, component.___state);
                        
                        needsUpdate = component.shouldComponentUpdate(
                            props, component.___state);
                    }
console.log(1111)
                    if (needsUpdate) {
                        needsUpdate = false;
                        content = component.render();
                        
                        const childContext = null; // TODO
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

            if (meta.isErrorBoundary && component && component.componentDidCatch
                !== Component.prototype.componentDidCatch) {

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
