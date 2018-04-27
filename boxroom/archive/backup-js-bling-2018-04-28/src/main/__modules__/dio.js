import adaptIsElementFunction from '../adaption/adaptIsElementFunction';
import createBinder from '../helper/createBinder';
import createLifecycleHandlers from '../helper/createLifecycleHandlers';
import ObservableObserver from '../observable/ObservableObserver';
import adaptDomMountFunction from '../adaption/adaptDomMountFunction';

import Dio from 'dio';
import createElement from 'js-hyperscript/dio';

import {} from '../polyfill/polyfill';

const
    mount = adaptDomMountFunction({
        mount: Dio.render,
        unmount: Dio.unmountComponentAtNode,
        isElement: Dio.isValidElement
    }),

    isElement = adaptIsElementFunction({
        isElement: Dio.isValidElement
    }),

    inspectElement = elem => {
        throw 'TODO'; // TODO
    },

    Adapter = Object.freeze({
        name: 'dio',
        api: { Dio }
    }),

    emptyDispatcher = function dispatcher() {};

const Bling = Object.freeze({
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
});
console.log(Dio.createElement('div', { id: 3, key: 4, ref: () => {} }, 'some', 'text'))

Adapter.api.Bling = Bling;
Object.freeze(Adapter.api);

export default Bling;

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,
};

// --- locals -------------------------------------------------------

function convertComponentConfigToDio(config) {
    const ret = {
        displayName: config.displayName,
        defaultProps: {}
    };

    const propNames = Object.keys(config.properties || {});

    for (let i = 0; i < propNames.length; ++i) {
        const
            propName = propNames[i],
            propConfig = config.properties[propName];

        if (propConfig.hasOwnProperty('defaultValue')) {
            ret.defaultProps[propName] = propConfig.defaultValue;
        } else if (propConfig.getDefaultValue) {
            Object.defineProperty(ret.defaultProps, propName, {
                enumerable: true,
                get: () => propConfig.getDefaultValue()
            });
        }
    }

    return ret;
}

function defineComponent(config) {
    class CustomComponent extends Dio.Component {
        constructor(props) {
            super(props);
            
            this.isInitialized = false;
            this.dispatch = emptyDispatcher;
            this.unsubscribe = null;

            if (config.initDispatcher) {
                const dispatcher = config.initDispatcher(); 

                this.dispatch =  msg => {
                    // console.log('dispatched message:', msg);
                    return dispatcher(msg);
                };
            } else if (config.init) {
                const main = config.init(props);
            
                if (typeof main === 'function') {
                    const
                        actionProcessor = new ObservableObserver(),
                        stateObservable = main(actionProcessor.toObservable()),

                        stateObserver = {
                            next: state => {
                                if (!this.isInitialized) {
                                    this.state = state;
                                } else {
                                    this.setState(state);
                                }
                            }
                        },

                        stateSubscription = stateObservable.subscribe(
                            stateObserver);

                    this.dispatch = msg => actionProcessor.next(msg);

                    this.unsubscribe = () => {
                        stateSubscription.unsubscribe();
                    }; 
                } else if (main
                    && typeof main === 'object'
                    && typeof main.getState === 'function'
                    && typeof main.dispatch === 'function'
                    && typeof main.subscribe === 'function') {
                
                    const store = config.init(props);
                    this.state = store.getState();

                    this.dispatch = msg => {
                        // console.log('dispatched message:', msg);
                        return store.dispatch(msg);
                    };

                    this.unsubscribe = store.subscribe(() => {
                        if (this.isInitialized) {
                            this.setState(store.getState());
                        } else {
                            this.state = store.getState();
                        }
                    });
                } else {
                    throw new Error(`[Component "${config.displayName}"]`
                        + 'Illegal return value of "init" function');
                }
            }

            this.lifecycleHandlers = 
                config.lifecycle
                    ? createLifecycleHandlers(
                        config.lifecycle, this.dispatch)
                    : {};

            if (this.lifecycleHandlers.didCatch) {
                this.componentDidCatch = function (error) {
                    this.lifecycleHandlers.didCatch({
                        props: this.props,
                        state: this.state,
                        error
                    });
                };
            }

            if (this.lifecycleHandlers.willMount) {
                this.lifecycleHandlers.willMount({
                    props: this.props,
                    state: this.state
                });
            }

            this.binder = createBinder(
                () => this.props,
                () => this.state,
                this.dispatch,
                config.events);
        }

        render() {
            return config.render({
                props: this.props,
                state: this.state,
                bind: this.binder
            });
        }

        componentDidMount() {
            this.isInitialized = true;

            if (this.lifecycleHandlers.didMount) {
                this.lifecycleHandlers.didMount({
                    props: this.props,
                    state: this.state
                });
            }
        }

        componentWillUnmount() {
            if (this.unsubscribe) {
                this.unsubscribe();
            }

            if (this.lifecycleHandlers.willUnmount) {
                this.lifecycleHandlers.willUnmount({
                    props: this.props,
                    state: this.state
                });
            }
        }
        
        componentDidUpdate() {
            if (this.lifecycleHandlers.didUpdate) {
                this.lifecycleHandlers.didUpdate({
                    props: this.props,
                    state: this.state
                });
            }
        }
    }


    Object.assign(CustomComponent, convertComponentConfigToDio(config));
    
    const factory = Dio.createElement.bind(null, CustomComponent);
    factory.type = CustomComponent;

    return factory;
}

defineComponent._jsx = createElement;
defineComponent._jsxFragment = Dio.Fragment;
