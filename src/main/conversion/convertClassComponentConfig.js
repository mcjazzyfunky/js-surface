import validateClassComponentConfig
    from '../validation/validateClassComponentConfig';

import Component from '../class/Component';

export default function convertClassComponentConfig(config) {
    const err = validateClassComponentConfig(config);
    
    if (err) {
        throw err;
    }

    const componentClass = class extends Component {
        constructor(props, platformComponent) {
            super(props, platformComponent);

            for (let key of Object.keys(this.constructor.prototype)) {
                if (typeof this[key] === 'function') {
                    this[key] = this[key].bind(this);
                }
            }

            if (config.constructor) {
                config.constructor.call(this, props);
            }
        }
    };

    for (let key of Object.keys(config)) {
        const value = config[key];

        if (typeof value !== 'function') {
            componentClass[key] = value;
        } else if (key !== 'constructor') {
            componentClass.prototype[key] = value;
        }
    }

    let childInjections = null;

    const
        init = (updateView, updateState) => {
            let
                component = null,
                content = null,
                done = false;

            const
                close = () => {
                    done = true;
                    
                    if (component) {
                        component.onWillUnmount();
                    }
                },

                setProps = props => {
                    if (done) {
                        return;
                    }

                    if (!component) {
                        component = new componentClass(props);

                        if (updateState) {
                            updateState(component.state);

                            component.__onStateUpdate = state => updateState(state);
                        } 
                        
                        let initialized = false;

                        component.__forceUpdate = function (prevProps, prevState) {
                            content = component.render();

                            const
                                childInjections =
                                    config.provides
                                    ? component.provideChildInjections()
                                    : null,

                                callbackWhenUpdated =
                                    () => {
                                        if (!initialized) {
                                            initialized = true;
                                            component.onDidMount();
                                        } else {
                                            component.onDidUpdate(prevProps, prevState);
                                        }
                                    };

                            updateView(content, childInjections, callbackWhenUpdated);
                        };

                        component.onWillMount();
                        component.forceUpdate();
                    } else {
                        component.onWillReceiveProps(props);

                        const shouldUpdate = component.shouldUpdate(props, component.state);

                        if (shouldUpdate) {
                            component.onWillUpdate(props, component.state);
                        }

                        const prevProps = component.props;

                        // Sorry for that :-(
                        component.__props = props;

                        if (shouldUpdate) {
                            component.forceUpdate(prevProps, component.state);
                        }
                    }
                },

                initResult = {
                    setProps,
                    close
                };

            if (config.publicMethods) {
                initResult.applyMethod = (methodName, args) => 
                    component[methodName](...args);
            }

            return initResult;
        };


    const stdConfig = {
        displayName:  componentClass.displayName,
        properties: componentClass.properties,
        init
    };

    if (config.provides) {
        stdConfig.provides = config.provides; 
    }

    if (config.publicMethods) {
        stdConfig.methods = config.publicMethods; 
    }

    return stdConfig;
}