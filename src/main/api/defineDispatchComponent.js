import defineClassComponent from './defineClassComponent.js';

import validateDispatchComponentConfig
    from '../internal/component/validation/validateDispatchComponentConfig.js';

import Component from '../api/Component.js';

import { Spec } from 'js-spec';

import shapeOfStore from '../internal/component/shape/shapeOfStore.js';

export default function defineDispatchComponent(config) {
    const err = validateDispatchComponentConfig(config);

    if (err) {
        throw err;
    }

    class ExtCustomComponent extends CustomComponent {
        constructor(props) {
            super(props, config);
        }
    }

    ExtCustomComponent.displayName = config.displayName;
    ExtCustomComponent.properties = config.properties || null;
    ExtCustomComponent.childContext = config.childContext || null;

    return defineClassComponent(ExtCustomComponent);
}

class CustomComponent extends Component {
    constructor(props, config) {
        super(props);
        this.__config = config;
        this.__unsubscribe = null;
        this.__dispatch = null;
        this.__refresh = () => this.refresh();
    }

    onWillReceiveProps(nextProps) {
        if (this.__config.onWillReceiveProps) {
            this.__config.onWillReceiveProps({
                props: this.props,
                state: this.state,
                nextProps,
                dispatch: this.__dispatch,
                refresh: this.__refresh
            });
        }
    }

    onWillMount() {
        if (this.__config.init) {
            const store = this.__config.init();


            if (store != undefined && store !== null) {
                const err = Spec.hasShape(shapeOfStore, store);

                if (err) {
                    throw new Error(
                        "The return value of the init function of component '"
                        + this.__config.displayName
                        + "' is invalid");
                } else {
                    this.__dispatch = msg => store.dispatch(msg);

                    let unsubscribe;

                    if (typeof store.getState === 'function') {
                        unsubscribe = store.subscribe(() => {
                            this.state = store.getState();
                        });
                    } else {
                        unsubscribe = store.subscribe(state => {
                            this.state = state;
                        });
                    }

                    if (typeof unsubscribe !== 'function') {
                        throw new Error(
                            "The return value of the subscribe method of the store of component '"
                            + this.__config.displayName
                            + "' is invalid");
                    } else {
                        this.__unsubscribe = unsubscribe;
                    }
                }
            }
        }

        if (this.__config.onWillMount) {
            this.__config.onWillMount({
                props: this.props,
                state: this.state,
                dispatch: this.__dispatch,
                refresh: this.__refresh
            });
        }
    }

    onDidMount() {
        this.__dispatch = null;

        if (this.__unsubscribe) {
            this.__unsubscribe();
            this.__unsuubscribe = null;
        }

        if (this.__config.onDidMount) {
            this.__config.onDidMount({
                props: this.props,
                state: this.state,
                dispatch: this.__dispatch,
                refresh: this.__refresh
            });
        }

    }

    onWillUpdate(nextProps, nextState) {
        if (this.__config.onWillUpdate) {
            this.__config.onWillUpdate({
                props: this.props,
                state: this.state,
                nextProps,
                nextState,
                dispatch: this.__dispatch,
                refresh: this.__refresh
            });
        }
    }

    onDidUpdate(prevProps, prevState) {
        if (this.__config.onWillUpdate) {
            this.__config.onWillUpdate({
                props: this.props,
                state: this.state,
                prevProps,
                prevState,
                dispatch: this.__dispatch,
                refresh: this.__refresh
            });
        }
    }

    onWillUnmount() {
        if (this.__config.onUnmount) {
            this.__config.onWillUnmount({
                props: this.props,
                state: this.state,
                dispatch: this.__dispatch
            });
        }
    }

    render() {
        return this.__config.render({
            props: this.props,
            state: this.state
        });
    }
}
