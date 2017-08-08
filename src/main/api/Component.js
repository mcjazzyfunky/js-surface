export default class Component {
    constructor(initialProps, platformComponent) {
        this.__props = initialProps;
        this.__state = null;
        this.__stateConsumer = null;
        this.__initialized = false;
        this.__refresh = null;
        this.__platformComponent = platformComponent;

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
            this.refresh();
      //      this.onDidUpdate(this.props, currState);
        }

        if (this.__initialized) {
            // TODO - isn't there a better solution?
            setTimeout(() => this.onDidChangeState(currState), 0);
        }

        if (typeof this.__stateConsumer === 'function') {
            this.__stateConsumer(this.__state);
        }
    }

    get component() {
        return this.__platformComponent;
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

    refresh() {
        if (this.__refresh) {
            this.__refresh(this.props, this.state);
        }
    }
}
