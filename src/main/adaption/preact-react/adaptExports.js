import deriveStandardReactComponent from './deriveStandardReactComponent';
import adaptCreateElementFunction from '../adaptCreateElementFunction';
import adaptDefineComponentFunction from '../adaptDefineComponentFunction';
import adaptIsElementFunction from '../adaptIsElementFunction';
import adaptMountFunction from '../adaptMountFunction';
import adaptUnmountFunction from '../adaptUnmountFunction';
import createFactory from '../../helper/createFactory';
import normalizeComponentConfig from '../../helper/normalizeComponentConfig';

export default function adaptReactExport({
        adapterName,
        adapterAPI,
        React,
        ReactDOM = null,
        ReactNative = null
    }) {

    const
        Adapter = Object.freeze({
            name: adapterName,
            
            api: Object.freeze(Object.assign({}, adapterAPI))
        }),

        createElement = adaptCreateElementFunction({
            createElement: React.createElement
        }),

        defineComponent = adaptDefineComponentFunction({
            BaseComponentClass: React.Component,
            adaptedCreateElementFunction: createElement,
            decorateComponentFunction,
            decorateComponentClass,
            defineStandardComponent,
            Fragment: React.Fragment
        }),

        isElement = adaptIsElementFunction({
            isElement: React.isValidElement
        }),

        inspectElement = obj => {
            let ret = null;

            if (React.isValidElement(obj)) {
                ret = { type: obj.type, props: obj.props };

                const
                    children = obj.props.children,
                    hasChildrenProp = children !== undefined
                        || obj.props.hasOwnPropty('children');

                if (hasChildrenProp && !children
                    || Array.isArray(children) && children.length === 0) {
                    
                    ret.props = {...obj.props};
                    delete ret.props.children;
                } else if (children !== undefined && !Array.isArray(children)) {
                    ret.props = { ...obj.props, children: [children] };
                }
            }

            return ret;
        }, 

        mount = adaptMountFunction({
            mountFunction: ReactDOM.render,
            unmountFunction: ReactDOM.unmountComponentAtNode
        }),

        unmount = adaptUnmountFunction({
            unmountFunction: ReactDOM.unmountComponentAtNode
        });
        
    return {
        createElement,
        defineComponent,
        inspectElement,
        isElement,
        mount,
        unmount,
        Adapter
    };

    // ---- locals ------------------------------------------------------

    function decorateComponentFunction(componentFunction, meta) {
        const ret = function Component (props, context) {
            const newProps =
                context
                    ? mergePropsWithContext(props, context, meta)
                    : props;

            return componentFunction(newProps);
        };

        Object.assign(ret, convertConfig(meta));

        const config = normalizeComponentConfig(meta);

        ret.type = ret;
        ret.factory = createFactory(ret, config, Adapter); 

        return ret;
    }

    function decorateComponentClass(componentClass, meta) {
        const convertedConfig = convertConfig(meta);

        let ret = class Component extends componentClass {};

        if (convertedConfig.contextTypes) {
            const innerComponent = ret;

            innerComponent.displayName = meta.displayName + '-inner';

            ret = class Component extends componentClass {
                render() {
                    const props = mergePropsWithContext(
                        this.props, this.context, meta);

                    return createElement(innerComponent, props);
                }
            };
        }

        Object.assign(ret, convertedConfig);
        ret.type = ret;
        ret.factory = createFactory(ret, null, Adapter);

        return ret;
    }

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
                        throw new Error('TODO'); // TODO
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

        if (cfg.childContextKeys) {
            ret.childContextTypes = {};

            for (const key of cfg.childContextKeys) {
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

    function defineStandardComponent(config) {
        const componentClass =
                deriveStandardReactComponent(React.Component, config);

        const meta = { ...config };

        delete meta.init;

        return decorateComponentClass(componentClass, meta).factory;
    }
}

// --- locals ---------------------------------------------

const dummyValidator = function validator() {};