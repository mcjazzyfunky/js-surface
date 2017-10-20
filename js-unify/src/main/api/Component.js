export default class Component {
    constructor(props) {
        this.___state = undefined;
        this.___props = props;
        this.___updateView = null;
    }

    get props() {
        return this.___props;
    }

    get state() {
        return this.__state;
    }

    set state(nextState) {
        if (this.___updateView) {
            throw new Error(
                "It's not allowed to modify property 'state' directly outside "
                + "of the constructor - please use method 'setState' instead");
        } else {
            this.___state = nextState;
        }
    }

    setState() {

    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    shouldComponentUpdate(nextProps, nextState) {
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

    setState(nextState) {
        const prevState = this.___state;

        if (this.shouldComponentUpdate(this.props, nextState)) {
            this.___update(this.props, nextState);
        } else {
            this.___state = 
        }
    }

    forceUpdate() {
        if (this.__update) {
            this.___update();
        }
    }

    render() {
        return null;
    }
}
