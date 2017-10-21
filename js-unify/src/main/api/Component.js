export default class Component {
    constructor(props) {
        this.___props = props;
        this.___state = undefined;
        this.___prevProps = undefined;
        this.___prevState = undefined;
        this.___updateView = null;
        this.___hasChildContext = false;
        this.___initialized = false;

        this.___callbackWhenUpdated =
            this.___callbackWhenUpdated.bind(this);
    }

    get props() {
        return this.___props;
    }

    get state() {
        return this.___state;
    }

    set state(nextState) {
        if (this.___updateView) {
            throw new Error(
                "It's not allowed to modify property 'state' directly outside "
                + "of the constructor - please use method 'setState' instead");
        }

        this.___state = nextState;
    }

    setState(nextState) {
        if (!this.___updateView) {
            throw new Error(
                "It's not allowed to modify property 'state' via 'setState' "
                + 'inside of the constructor - please set state '
                + 'directly instead');
        }

        this.___update(this.___props, nextState, false);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
    }

    componentDidCatch(error, info) {
        // TODO!!!
    }

    forceUpdate() {
        if (this.___updateView) {
            this.___update(this.___props, this.___state, true);
        }
    }

    render() {
        return null;
    }

    ___init(updateView) {
        this.___updateView = updateView;
    }

    ___update(nextProps, nextState, force) {
        const needsUpdate =
            force
            || this.shouldComponentUpdate(nextProps, nextState);
        
        if (needsUpdate) {
            this.componentWillUpdate(nextProps, nextState);
        }

        this.___prevProps = this.___props;
        this.___prevState = this.___state;
        this.___props = nextProps;
        this.___state = nextState;

        if (needsUpdate) {        
            this.___updateView(
                this.render(),
                this.___meta.provides ? this.getChildContext() : null,
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
