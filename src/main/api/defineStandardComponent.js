import createPropsAdjuster from '../internal/component/helper/createPropsAdjuster.js';
import validateStandardComponentConfig from '../internal/component/validation/validateStandardComponentConfig.js';

import { defineBasicComponent } from 'js-surface';

export default function defineStandardComponent(config) {
    const err = validateStandardComponentConfig(config);

    if (err) {
        throw err;
    }

    const
        propsAdjuster = createPropsAdjuster(config),

        initProcess = (onRender, onState) => {
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
                    component = new config.componentClass(props);
                    
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

            // TODO
            const methods = {};

            return {
                onProps,
                methods
            };
        },

        adjustedConfig = {
            name: config.name,
            properties: config.properties,
            initProcess
        };

    return defineBasicComponent(adjustedConfig);
}
