export default class Component {
    constructor(initialProps) {
        this.__props = initialProps;
        this.__state = null;
        this.__stateConsumer = null;
        this.__initialized = false;
        this.__refresh = null;

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
        const
            currState = this.state;

        this.__state = nextState;

        if (this.__initialized && this.shouldUpdate(this.props, currState)) {
            this.onWillUpdate(this.props, nextState);
            this.refresh();
        }
        
        if (typeof this.__stateConsumer === 'function') {
            this.__stateConsumer(this.__state);
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
