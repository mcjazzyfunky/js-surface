import validateComponentClass from '../internal/validation/validateComponentClass.js';

import { defineStandardComponent }  from 'js-surface';

export default function defineClassComponent(componentClass) {
    const
        err = validateComponentClass(componentClass),
        api = componentClass.api || null,
        instanceClass = function () {
            this.__component = null;
        };

    if (err) {
        throw err;
    }

    if (api) {
        for (let key of Object.keys(api)) {
            instanceClass.prototype[key] = function () {
                let ret = undefined;
                
                if (this.__component) {
                    ret = api[key].apply(this.__component, arguments);
                }

                return ret;
            };       
        }
    }

    const
        init = (viewCallback, stateCallback) => {
            let
                instance = new instanceClass(),
                component = null,
                content = null,
                done = false;

            const propsCallback = props => {
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
                    component = new componentClass(props);
                    instance.__component = component;

                    if (stateCallback) {
                        stateCallback(component.state);
                    }
                        
                    component.__stateCallback = state => {
                        if (stateCallback) {
                            stateCallback(state);
                        }    
                    };
                    
                    let initialized = false;

                    component.__refresh = function (prevProps, prevState) {
                        content = component.render();
                        const renderingDonePromise = viewCallback(content);

                        if (renderingDonePromise) {
                            renderingDonePromise.then(
                                successful => {
                                    if (successful) {
                                        if (!initialized) {
                                            initialized = true;
                                            component.onDidMount();
                                        } else {
                                            component.onDidUpdate(prevProps, prevState);
                                        }
                                    }
                                }
                            );
                        }
                    };

                    component.onWillMount();
                    component.refresh(null, null);
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
                        component.refresh(prevProps, component.state);
                    }
                }
            };

            return {
                propsCallback,
                instance 
            };
        };


    const config = {
        displayName:  componentClass.displayName,
        properties: componentClass.properties,
        init
    };

    if (api) {
        config.api = {};

        for (let key of Object.keys(api)) {
            config.api[key] = function (instance, args) {
                return api[key].apply(instance.__component, args);
            };
        }
    }
    
    return defineStandardComponent(config);
}
