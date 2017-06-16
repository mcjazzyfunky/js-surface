import createPropsAdjuster from '../internal/component/helper/createPropsAdjuster.js';
import validateComponentClass from '../internal/component/validation/validateComponentClass.js';

import { defineStandardComponent }  from 'js-surface';

export default function defineClassComponent(config) {
    const
        err = validateComponentClass(config),
        api = config.api || null;

    if (err) {
        throw err;
    }

    const
        propsAdjuster = createPropsAdjuster(config),

        init = (onRender, onState) => {
            let
                component = null,
                content = null,
                done = false;

            const onProps = origProps => {
                if (done) {
                    return;
                } else if (origProps === undefined) {
                    if (component) {
                        component.onWillUnmount();
                    }

                    done = true;
                    return;
                }

                const props = propsAdjuster(origProps);

                if (!component) {
                    component = new config(props);
                    
                    if (onState) {
                        onState(component.state);
                    }
                        
                    component.__onState = state => {
                        if (onState) {
                            onState(state);
                        }    
                    };
                    
                    let initialized = false;

                    component.__refresh = function (prevProps, prevState) {
                        content = component.render();
                        const renderingDonePromise = onRender(content);

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

            let methods = null;

            if (api) {
                methods = {};

                for (let key of Object.keys(api)) {
                    methods[key] = (...args) => api[key].apply(component, args);
                }
            }

            return {
                onProps,
                api: methods 
            };
        },

        adjustedConfig = {
            displayName:  config.displayName,
            properties: config.properties,
            init
        };

    return defineStandardComponent(adjustedConfig);
}
