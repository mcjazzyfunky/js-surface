import shapeOfAdaptReactLikeComponentSystemConfig from '../shape/shapeOfAdaptReactLikeComponentSystemConfig.js';

import { Spec } from 'js-spec';

import adaptComponentSystem from '../../../api/adaptComponentSystem.js';

import adaptDefineFunctionalComponent from
    './adaptDefineFunctionalComponent.js';

import adaptDefineStandardComponent from
    './adaptDefineStandardComponent.js';

const fakeState = Object.freeze({});

export default function adaptReactLikeComponentSystem(reactLikeConfig) {
    const err = Spec.shape(shapeOfAdaptReactLikeComponentSystemConfig)(reactLikeConfig);

    if (err) {
        throw new Error(
            "Illegal first argument 'reactLikeConfig' for "
            + "function 'adaptReactLikeComponentSystem':"
            + err);
    }

    const CustomComponent = defineCustomComponent(reactLikeConfig.Component);

    const newConfig = {
        isBrowserBased: reactLikeConfig.isBrowserBased !== false,

        defineFunctionalComponent(config) {
            return adaptDefineFunctionalComponent(config, adjustedConfig => {
                const ret = props => adjustedConfig.render(props);

                ret.displayName = adjustedConfig.displayName;
                
                if (adjustedConfig.properties) {
                    ret.properties = adjustedConfig.properties;
                }
                
                return ret;
            });
        },

        defineStandardComponent(config) {
            return adaptDefineStandardComponent(config, adjustedConfig => {
                class ExtCustomComponent extends CustomComponent {
                    constructor(...args) {
                        super(args, adjustedConfig);
                    }
                }

                ExtCustomComponent.displayName = adjustedConfig.displayName;

                return reactLikeConfig.createFactory(ExtCustomComponent);
            });
        },

        createElement: reactLikeConfig.createElement,

        isElement(it)  {
            return it !== undefined
                && it !== null
                && reactLikeConfig.isValidElement(it);
        },

        render: reactLikeConfig.render
    };

    return adaptComponentSystem(newConfig);
}

function defineCustomComponent(ReactLikeComponent) {
    return class CustomComponent extends ReactLikeComponent {
        constructor(superArgs, config) {
            super(...superArgs);

            this.__viewToRender = null;
            this.__resolveRenderingDone = null;
            this.__shouldUpdate = false;
            this.state = fakeState;

            let initialized = false;

            const
                { onProps, api } = config.init(
                    view => {
                        this.__viewToRender = view;

                        if (initialized) {
                            this.__shouldUpdate = true;
                            this.setState(fakeState);
                        } else {
                            initialized  = true;
                        }

                        return new Promise(resolve => {
                            this.__resolveRenderingDone = () => {
                                this.__resolveRenderingDone = null;
                                resolve(true);
                            };
                        });

                    },
                    state => {
                        this.state = state;
                    });

            this.__onProps = onProps;

            if (api) {
                Object.assign(this, api);
            }
        }

        componentWillMount() {
            this.__onProps(this.props);
        }

        componentDidMount() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }
        }

        componentDidUpdate() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }
        }

        componentWillUnmount() {
            this.__onProps(undefined);
        }

        componentWillReceiveProps(nextProps) {
            this.__onProps(nextProps);
        }

        shouldComponentUpdate() {
            const ret = this.__shouldUpdate;

            if (ret) {
                this.__shouldUpdate = false;
            }

            return ret;
        }

        render() {
            return this.__viewToRender;
        }
    };
}
