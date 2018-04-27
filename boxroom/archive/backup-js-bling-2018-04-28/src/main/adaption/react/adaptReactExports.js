import adaptIsElementFunction from '../adaptIsElementFunction';
import createBinder from '../../helper/createBinder';
import createLifecycleHandlers from '../../helper/createLifecycleHandlers';
import ObservableObserver from '../../observable/ObservableObserver';

export default function adaptReactExports({
    createElement,
    isElement,
    mount,
    adapterName,
    adapterApi,
    Component,
    Fragment,
    extras
}) {
    const ret = Object.freeze({
        isElement: adaptIsElementFunction({ isElement }),
        mount,
        
        defineComponent: adaptDefineComponentFunction({
            createElement,
            Component,
            Fragment
        }),

        Adapter: Object.freeze({
            name: adapterName,
            api: { ...adapterApi }
        }),
        
        ...extras
    });

    ret.Adapter.api.Bling = ret;
    Object.freeze(ret.Adapter.api);

    return ret;
}

function adaptDefineComponentFunction({
    createElement,
    Component,
    Fragment
}) {
    const defineComponent = config => {
        // TODO

        class CustomComponent extends Component {
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



        Object.assign(CustomComponent, convertComponentConfigToReact(config));
        const factory = createElement.bind(null, CustomComponent);

        factory.type = CustomComponent;

        return factory;
    };

    defineComponent._jsx = createElement;

    if (Fragment) {
        defineComponent._jsxFragment = Fragment;
    }

    return defineComponent;
}


function convertComponentConfigToReact(config) {
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

const emptyDispatcher = function dispatcher() {
};