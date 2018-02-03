import adaptDefineComponentFunction from '../adaptDefineComponentFunction';
import adaptIsElementFunction from '../adaptIsElementFunction';
import adaptMountFunction from '../adaptMountFunction';
import normalizeComponentConfig from '../../helper/normalizeComponentConfig';
import createPropsAdjuster from '../../helper/createPropsAdjuster';
import deriveStandardReactComponent from '../../adaption/specific/deriveStandardReactLikeComponent';

export default function adaptReactLikeExports({
    adapterName,
    adapterAPI,
    createElement,
    isValidElement,
    render = null,
    unmountComponentAtNode = null,
    Component
}) {
    const
        Adapter = Object.freeze({
            name: adapterName,
            
            api: Object.freeze(Object.assign({}, adapterAPI))
        }),

        defineComponent = adaptDefineComponentFunction({
            createElement,
            Adapter,
            decorateComponent,
            BaseComponent: Component,
            createStandardComponentType,
            normalizeBaseComponent: function () {} // TODO
        }),

        isElement = adaptIsElementFunction({
            isElement: isValidElement
        }),

        inspectElement = obj => {
            let ret = null;

            if (isValidElement(obj)) {
                ret = { type: obj.type, props: obj.props };

                const
                    children = obj.props.children,
                    hasChildrenProp = children !== undefined
                        || obj.props.hasOwnPropty('children');

                if (hasChildrenProp && !children
                    || Array.isArray(children) && children.length === 0) {
                    
                    ret.props = Object.assign({}, obj.props);
                    delete ret.props.children;
                } else if (children !== undefined && !Array.isArray(children)) {
                    ret.props = Object.assign({ children: [children]}, obj.props);
                }
            }

            return ret;
        }, 

        mount = adaptMountFunction({
            mountFunction: render,
            unmountFunction: unmountComponentAtNode
        });
        
    return {
        createElement,
        defineComponent,
        inspectElement,
        isElement,
        mount,
        Adapter
    };

    // ---- locals ------------------------------------------------------

    function convertConfig(config) {
        const ret = { defaultProps: {} };

        const cfg = normalizeComponentConfig(config);

        ret.displayName = cfg.displayName;

        if (cfg.properties) {
            for (const propName of Object.keys(cfg.properties)) {
                const propCfg = cfg.properties[propName];

                if (propCfg.inject) {
                    ret.contextTypes = ret.contextTypes || {};
                    ret.contextTypes[propName] = dummyValidator;
                } else {
                    if (propCfg.hasOwnProperty('defaultValue') && propCfg.defaultValue === undefined) {
                        ret.defaultProps[propName] = undefined; // TODO?
                    } else if (propCfg.defaultValue !== undefined) {
                        ret.defaultProps[propName] = propCfg.defaultValue;
                    } else if (propCfg.getDefaultValue) {
                        Object.defineProperty(ret.defaultProps, propName, {
                            enumerable: true,

                            get: () => propCfg.getDefaultValue()
                        }); 
                    }
                }
            }
        }

        if (cfg.childContext) {
            ret.childContextTypes = {};

            for (const key of cfg.childContext) {
                ret.childContextTypes[key] = dummyValidator;
            }
        }

        return ret;
    }

    function mergePropsWithContext(props, context, config) {
        let ret = null;

        props = props || {};
        context = context || {};
        
        const contextKeys = Object.keys(context);

        for (let i = 0; i < contextKeys.length; ++i) {
            const
                contextKey = contextKeys[i],
                contextValue = context[contextKey];

            if (contextValue !== undefined && props[contextKey] === undefined) {
                if (ret === null) {
                    ret = Object.assign({}, props);
                }

                ret[contextKey] = contextValue;
            }
        }

        if (ret === null) {
            ret = props;
        }

        return ret;
    }

    function decorateComponent(component, normalizedConfig) {
        let ret;

        const
            isFunctional = !(component.prototype instanceof Component),

            dependsOnContext =
                !! normalizedConfig.properties
                    && Object.values(normalizedConfig.properties)
                        .findIndex(propConfig => propConfig.inject) >= 0,

            propsAdjuster = createPropsAdjuster(normalizedConfig);

        
        if (isFunctional && dependsOnContext) {
            const derivedComponent = component.bind(null);

            derivedComponent.displayName = normalizedConfig.displayName;

            ret = (props, context) => {
                return createElement(derivedComponent, 
                    propsAdjuster(mergePropsWithContext(props, context), true));
            };

        } else if (!isFunctional && dependsOnContext) {
            const derivedComponent = class Component extends component {};

            derivedComponent.displayName = normalizedConfig.displayName;

            ret = (props, context) => {
                const mergedProps = mergePropsWithContext(props, context);

                return createElement(derivedComponent, mergedProps);
            };
        } else {
            if (isFunctional) {
                ret = props => component(
                    propsAdjuster(props, normalizedConfig)); // TODO
            } else {
                ret = class Component extends component {
                    constructor(props) {
                        propsAdjuster(props, true);
                        super(props);
                    }

                    componentWillReceiveProps(nextProps) {
                        propsAdjuster(nextProps, true);
                        super.componentWillReceiveProps(nextProps);
                    }
                };
            }
        }

        Object.assign(ret, convertConfig(normalizedConfig));

        if (dependsOnContext) {
            ret.displayName += '-wrapper';
        }

        Object.defineProperty(ret, 'type', {
            get() {
                return this === ret ? ret : undefined;
            }
        });

        return ret;
    }

    function createStandardComponentType(config) {
        return deriveStandardReactComponent(Component, config);
    }
}

// --- locals ---------------------------------------------

const dummyValidator = function validator() {};