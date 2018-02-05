export default class Component {
    constructor(initialProps) {
        this.__props = initialProps;
        this.__state = null;
        this.__initialized = false;
        this.__onStatepdate = null;
        this.__forceUpdate = null;

        // TODO - isn't there a better solution?
        setTimeout(() => {
            this.__initialized = true;
        }, 0);
    }

    get props() {
        return this.__props;
    }

    get state() {
        return this.__state;
    }

    set state(nextState) {
        const currState = this.state;

        if (this.__initialized) {
            this.onWillChangeState(nextState);
        }

        this.__state = nextState;

        if (this.__initialized && this.shouldUpdate(this.props, currState)) {
            this.onWillUpdate(this.props, nextState);
            this.forceUpdate();
      //      this.onDidUpdate(this.props, currState);
        }

        if (this.__initialized) {
            // TODO - isn't there a better solution?
            setTimeout(() => this.onDidChangeState(currState), 0);
        }

        if (typeof this.__onStateUpdate === 'function') {
            this.__onStateUpdate(this.__state);
        }
    }

    shouldUpdate() {
        return true;
    }

    onWillReceiveProps() {
    }

    onWillMount() {
    }

    onDidMount() {
    }

    onWillUpdate() {
    }

    onDidUpdate() {
    }

    onWillChangeState() {
    }

    onDidChangeState() {
    }

    onWillUnmount() {
    }

    render() {
        return null;
    }

    provideChildInjections() {
        return null;
    }

    forceUpdate() {
        this.__forceUpdate();
    }
}
