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

    const
        publicMethods = componentClass.publicMethods || null,
        instanceClass = function () {
            this.__component = null;
        };

    if (publicMethods) {
        for (let key of publicMethods) {
            instanceClass.prototype[key] = function () {
                let ret = undefined;
                
                if (this.__component) {
                    ret = this[key].apply(this.__component, arguments);
                }

                return ret;
            };       
        }
    }

    const
        init = (updateView, updateState, platformComponent) => {
            let
                instance = new instanceClass(),
                component = null,
                content = null,
                done = false;

            const receiveProps = props => {
                if (done) {
                    return;
                } else if (props === undefined) {
                    if (component) {
                        component.onWillUnmount();
                    }

                    done = true;
                    return;
                }

                if (!component) {
                    component = new componentClass(props, platformComponent);
                    instance.__component = component;

                    if (updateState) {
                        updateState(component.state);
                    }
                        
                    component.__updateState = state => {
                        if (updateState) {
                            updateState(state);
                        }    
                    };
                    
                    let initialized = false;

                    component.__forceUpdate = function (prevProps, prevState) {
                        content = component.render();

                        updateView(content)
                            .then(
                                () => {
                                    if (!initialized) {
                                        initialized = true;
                                        component.onDidMount();
                                    } else {
                                        component.onDidUpdate(prevProps, prevState);
                                    }
                                }
                            );
                    };

                    component.onWillMount();
                    component.forceUpdate(null, null);
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
            };

            const initResult = {
                receiveProps,
                forceUpdate: () => {
                    console.log('forceUpdate')
                }
            };

            if (config.publicMethods) {
                initResult.applyPublicMethod = (methodName, args) => {
                    return instance.__component[methodName](...args); 
                };
            }

            if (config.childInjections) {
                initResult.provideChildInjections = () => component
                        ? instance.__component.provideChildInjections()
                        : null;
            }

            return initResult;
        };


    const stdConfig = {
        displayName:  componentClass.displayName,
        properties: componentClass.properties,
        init
    };

    if (config.childInjections) {
        stdConfig.childInjections = config.childInjections; 
    }

    if (config.publicMethods) {
        stdConfig.publicMethods = config.publicMethods; 
    }

    return stdConfig;
}