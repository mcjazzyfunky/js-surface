import validateComponentClass from '../validation/validateComponentClass.js';

import { defineComponent }  from 'js-surface';

export default function defineClassComponent(componentClass) {
    const
        err = validateComponentClass(componentClass),
        publicMethods = componentClass.publicMethods || null,
        instanceClass = function () {
            this.__component = null;
        };

    if (err) {
        throw err;
    }

    if (publicMethods) {
        for (let key of Object.keys(publicMethods)) {
            instanceClass.prototype[key] = function () {
                let ret = undefined;
                
                if (this.__component) {
                    ret = publicMethods[key].apply(this.__component, arguments);
                }

                return ret;
            };       
        }
    }

    const
        init = (viewConsumer, stateConsumer) => {
            let
                instance = new instanceClass(),
                component = null,
                content = null,
                done = false;

            const propsConsumer = props => {
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

                    if (stateConsumer) {
                        stateConsumer(component.state);
                    }
                        
                    component.__stateConsumer = state => {
                        if (stateConsumer) {
                            stateConsumer(state);
                        }    
                    };
                    
                    let initialized = false;

                    component.__refresh = function (prevProps, prevState) {
                        content = component.render();
                        const renderingDonePromise = viewConsumer(content);

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

            const initResult = {
                propsConsumer,
                instance 
            };

            if (config.childInjectionKeys) {
                initResult.getChildInjection = () => component
                        ? component.getChildInjection()
                        : null;
            }

            return initResult;
        };


    const config = {
        displayName:  componentClass.displayName,
        properties: componentClass.properties,
        init
    };

    if (componentClass.childInjectionKeys) {
        config.childInjectionKeys = componentClass.childInjectionKeys; 
    }

    if (publicMethods) {
        config.publicMethods = {};

        for (let key of Object.keys(publicMethods)) {
            config.publicMethods[key] = function (instance, args) {
                return publicMethods[key].apply(instance.__component, args);
            };
        }
    }

    return defineComponent(config);
}
