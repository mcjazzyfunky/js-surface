import adaptDefineComponentFunction from '../adaptDefineComponentFunction';
import adaptIsElementFunction from '../adaptIsElementFunction';
import adaptMountFunction from '../adaptMountFunction';
import createPropsAdjuster from '../../helper/createPropsAdjuster';
import deriveStandardReactLikeComponent from '../../adaption/specific/deriveStandardReactLikeComponent';
import deriveStandardBaseComponent from '../../adaption/specific/deriveStandardReactLikeComponent';

export default function adaptReactLikeExports({
    adapterName,
    adapterAPI,
    createElement,
    isValidElement,
    render = null,
    unmountComponentAtNode = null,
    Component: BaseComponent,
    Fragment
}) {
    const
        Adapter = Object.freeze({
            name: adapterName,
            
            api: Object.freeze(Object.assign({}, adapterAPI))
        }),

        defineComponent = adaptDefineComponentFunction({
            createComponentType,
            createElement,
            Adapter
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
            unmountFunction: unmountComponentAtNode,
            isElement
        });

    const
        fragment = createElement.bind(null, Fragment);
        
    return {
        createElement,
        defineComponent,
        inspectElement,
        isElement,
        mount,
        Adapter,

        fragment,
        Fragment
    };

    // ---- locals ------------------------------------------------------

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

    function createComponentType(config) {
        // config is already normalized

        let ret,
            injectableProperties = null;

        const propsAdjuster = createPropsAdjuster(config);

        if (config.properties) {
            for (const key of Object.keys(config.properties)) {
                if (config.properties[key].inject === true) {
                    injectableProperties = injectableProperties || [];
                    injectableProperties.push(key);
                }
            }
        }

        if (config.render) {
            if (injectableProperties) {
                const derivedComponent = config.render.bind(null);

                derivedComponent.displayName = config.displayName;

                ret = (props, context) => {
                    const ret = createElement(derivedComponent, 
                        propsAdjuster(mergePropsWithContext(props, context, config), true));

                    return ret;
                };

                ret.displayName = config.displayName + '-wrapper';
            } else {
                ret = props => config.render(propsAdjuster(props, config));
                ret.displayName = config.displayName;
            }
        } else {
            if (injectableProperties) {
                const derivedComponent = deriveStandardBaseComponent(BaseComponent, config);

                ret = (props, context) => {
                    return createElement(derivedComponent, 
                        propsAdjuster(mergePropsWithContext(props, context, config), true));
                };

                ret.displayName = config.displayName + '-wrapper';
            } else {
                ret = deriveStandardReactLikeComponent(BaseComponent, config);
            }
        }

        if (injectableProperties) {
            ret.contextTypes = {};
            
            for (const key of injectableProperties) {
                ret.contextTypes[key] = dummyValidator;
            }
        }

        return ret;
    }
}

const dummyValidator = function validator() {
    return null;
};
