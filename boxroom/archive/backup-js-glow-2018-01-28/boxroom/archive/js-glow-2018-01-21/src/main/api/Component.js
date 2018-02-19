export default class Component {
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

    onWillReceiveProps(nextProps) {
    }

    shouldUpdate(nextProps, nextState) {
        return true;
    }

    onWillUpdate(nextProps, nextState) {
    }

    onDidUpdate(prevProps, prevState) {
    }

    onWillChangeState(nextState) {
    }

    onDidChangeState(prevState) {
    }

    onWillUnmount() {
    }

    onDidCatchError(error, info) {
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
