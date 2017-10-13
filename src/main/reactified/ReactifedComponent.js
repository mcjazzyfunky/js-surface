import { createClassComponent } from 'js-spec';

export class ReactifiedComponent {
    constructor(props) {
        this.__props = props;
        this.defaultProps = null;
        this.__innerComponent = null;
    }

    componentWillMount() {
        this.__innerComponent.onWillMount();
    }

    componentDidMount() {
        this.__innerComponent.onDidMount();
    }

    componentWillReceiveProps(nextProps) {
        this.__innerComponent.onWillReceiveProps(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.__innerComponent.shouldUpdate(nextProps, nextState);
    }

    componentWillUpdate(nextProps, nextState) {
        this.__innerComponent.onWillUpdate(nextProps, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        this.__innerComponent.onDidUpdate(prevProps, prevState);
    }

    componentWillUnmount() {
        this.__innerComponent.onWillUnmount();
    }

    componentDidCatch(error, info) {
        // TODO
    }

    setState(state, callback = null) {
        this.__innerComponent.state = state;
        // TODO callback
    }

    forceUpdate(callback) {
        this.__innerComponent.forceUpdate();
    }

    getChildContext() {
        this.__innerComponent.provideChildInjections();
    }

    get props() {
        return this.__props;
    }

    get context() {
        return this.__props;
    }

    static get displayName() {
        return 'Anonymous';
    }

    static get propTypes() {
        return null;
    }

    static get defaultProps() {
        return null;
    }

    static get contextTypes() {
        return null;
    }

    static get childContextTypes() {
        return null;
    }

    static get publicMethods() {
        return null;
    }

    static get factory() {
        let ret = this.__factory;

        if (!ret) {
            const classComponentConfig = {


            }

            ret = defineClassComponent(classComponentConfig);
            
        }

        return ret;
    }
}
