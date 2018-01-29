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

    setState(/* args */) {
    }

    forceUpdate(/* callback */) {
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

                    if (component === null) {
                        component = new this(props);
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
