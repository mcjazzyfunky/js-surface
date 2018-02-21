import adaptDefineComponentFunction from '../adaption/adaptDefineComponentFunction.js';
import adaptMountFunction from '../adaption/adaptMountFunction.js';

import Vue from 'vue';

const
    doNothing = () => {},

    Surface = {}, // will be filled later

    isElement = it => it && it.isSurfaceElement === true,

    mount = adaptMountFunction({
        mountFunction: customMount,
        unmountFunction: customUnmount, 
        isElement
    }),

    Adapter = Object.freeze({
        name: 'vue',
        api: { Surface, Vue }
    }),
    
    defineComponent = adaptDefineComponentFunction({
        createElement,
        createComponentType, 
        Adapter
    }),

    inspectElement = obj => {
        let ret = null;

        if (isElement(obj)) {
            ret = { type: obj.type, props: obj.props };
        }

        return ret;
    },

    Fragment = 'x-fragment', // TODO
    fragment = createElement.bind(null, Fragment);

Object.assign(Surface, {
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // addons
    fragment,
    Fragment
});

Object.freeze(Surface);

export default Surface;

export {
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,
    
    // addons
    fragment,
    Fragment
};

// ------------------------------------------------------------------

let nextRefID = 1;


function getNextRefName() {
    const ret = 'ref-' + nextRefID.toString(16);

    if (nextRefID === Number.MAX_SAFE_INTEGER) {
        nextRefID = 0;
    } else {
        ++nextRefID;
    }

    return ret;
}

function createComponentType(config) {
    return config.render
        ? createFunctionalComponentType(config)
        : createStandardComponentType(config);
}

function createFunctionalComponentType(config) {
    let ret;

    const defaultValues = determineDefaultValues(config);

    ret = Vue.extend({
        functional: true,
        props: Object.keys(config.properties || {}),
        inject: determineInjectionKeys(config),

        render: function (vueCreateElement, context) {
            const
                props = mixProps(context.props, context.listeners, context.injections, defaultValues, config),
                content = config.render(props);

            return renderContent(vueCreateElement, content, this);
        }
    });
    
    return ret;
}

function createStandardComponentType(config) {
    const defaultValues = determineDefaultValues(config);

    const component = Vue.extend({
        props: Object.keys(config.properties || {}),
        inject: determineInjectionKeys(config),
        methods: determineOperations(config),

        provide: !config.childContext ? null : function () {
            const ret = {};

            if (config.childContext) {
                for (const key of config.childContext) {
                    ret[key] = new Injection(() => this.__childInjections[key]);
                }
            }

            return ret;
        },

        data() {
            return {
                __childInjections: null
            };
        },

        created() {
            this.__refCallbacks = {};
            this.__refCleanupCallbacks = {};
            this.__content = null;
            this.__callbackWhenUpdated = null;
            this.__nextState = {};
            this.__isInitialized = false;

            this.__updateView = (content, provisions, callbackWhenUpdated) => {
                this.__content = content;

                if (config.childContext) {
                    this.__childInjections = provisions;
                }

                this.__callbackWhenUpdated = callbackWhenUpdated;

                if (!this.__preventForceUpdate) {
                    this.__preventForceUpdate = true;
                    this.$forceUpdate();
                }

                this.__isInitialized = true;
            };


            this.__updateState = (updater, callback) => {
                const newState = updater(this.__state);
                this.__nextState = Object.assign({}, this.__nextState, newState);

                if (!this.__isInitialized) {
                    this.__state = this.__nextState;
                } else {
                    setTimeout(() => {
                        this.__state = this.__nextState;

                        if (callback) {
                            callback(this.__state);
                        }
                    }, 0);
                }
            };

            const initResult = config.init(
                this.__updateView, this.__updateState);

            this.__setProps = props => {
                initResult.setProps(props);
            };

            this.__close = initResult.close || doNothing;
            this.__applyMethod = initResult.applyMethod;

            if (config.isErrorBoundary) {
                this.__isErrorBoundary = true;
                this.__handleError = initResult.handleError;
            }
        },

        beforeMount() {
            this.__setProps(
                mixProps(
                    this.$options.propsData,
                    this._events,
                    this,
                    defaultValues, config));
            
            if (this.__updateChildInjections) {
                this.__updateChildInjections();
            }
        },

        mounted() {
            this.__preventForceUpdate = false;
            
            if (this.__callbackWhenUpdated) {
                this.__callbackWhenUpdated(null);
            }

            handleRefCallbacks(this);
        },

        beforeUpdate() {
            handleRefCleanupCallbacks(this);

            if (!this.__preventForceUpdate) {
                if (this.__updateChildInjections) {
                    this.__updateChildInjections();
                }

                this.__setProps(
                    mixProps(
                        this.$options.propsData,
                        this._events,
                        this,
                        defaultValues, config));
            }
        },

        updated() {
            this.__preventForceUpdate = false;
            
            if (this.__callbackWhenUpdated) {
                this.__callbackWhenUpdated();
            }

            handleRefCallbacks(this);
        },

        beforeDestroy() {
            this.__close();
            handleRefCleanupCallbacks(this);
        },

        render(vueCreateElement) {
            return renderContent(vueCreateElement, this.__content, this);
        },

        errorCaptured(error) {
            const ret = config.isErrorBoundary ? false : null;

            if (config.isErrorBoundary) {
                this.__preventForceUpdate = false;
                this.__handleError(error);
            }

            return ret;
        }
    });

    return component;
}

function createElement(tag, props, ...children) {
    let ret;
    
    if (tag && tag.meta) { // TODO: tag.meta checks for factory - find better solution!
        ret = tag(props, ...children);
    } else {
        ret = {
            type: tag,
            props,
            children,
            isSurfaceElement: true
        };
    }

    return ret;
}

function customMount(content, targetNode) {
    targetNode.innerHTML = '<span></span>';

    const vueComponent = new Vue({
        el: targetNode.firstChild,

        render(vueCreateElement) {
            return renderContent(vueCreateElement, content, this);
        },

        methods: {
            create() {
            },

            destroy() {
                this.$destroy();
            }
        }
    });

    targetNode.___destroyVueComponent = () => {
        delete targetNode.____destroyComponent;
        vueComponent.destroy();
        targetNode.innerHTML = '';
    };
}

function customUnmount(node) {
    if (typeof node.___destroyVueComponent === 'function') {
        node.___destroyVueComponent();
    }
}

function renderContent(vueCreateElement, content, component) {
    if (!content || !content.isSurfaceElement) {
        throw new Error('no surface element');
    }

    let props = content.props;

    const
        type = content.type,
        children = convertChildren(content.children, vueCreateElement, component);

    let ret, refCallback = null, refName = null;

    if (props && props.ref) {
        refCallback = props.ref,
        refName = getNextRefName(),
        props = Object.assign({}, props, { ref: refName });
        component.__refCallbacks[refName] = refCallback;

        /*
        if (!component.__refCallbacks) {
            component.__refCallbacks = {};
        }

        component.__refCallbacks[refName] = {
            callback: ref,
            element: null
        };
        */
    }

    if (props && type === 'label' && props.htmlFor) {
        props = Object.assign({}, props);
        props.for = props.htmlFor;
        delete(props.htmlFor);
    }


    if (typeof type === 'string') {
        const attrs = Object.assign({}, props);
        const options = { attrs };

        if (attrs.style) {
            options.style = attrs.style;
            delete(attrs.style);          
        }

        for (let key of Object.keys(attrs)) {
            if (key.substr(0, 2) === 'on' && key[2] >= 'A' && key[2] <= 'Z') {
                const handler = attrs[key];
                delete(attrs[key]);

                const newKey = (key[2].toLowerCase() + key.substr(3)).toLowerCase();

                if (!options.on) {
                    options.on = {};
                }

                options.on[newKey] = handler;
            }
        }

        if (refName) {
            options.ref = refName;
            delete(options.attrs.ref);
        }

        if (attrs.dangerouslySetInnerHTML) {
            const innerHTML =
                String(attrs.dangerouslySetInnerHTML.__html || '');

            options.domProps = { innerHTML };
        }

        if (props && props.className && !props.class) {
            options.attrs.class = props.className;
            delete options.attrs.className;
        }

        ret = vueCreateElement(type, options, children);
    } else {
        const options = { props };

        if (refName) {
            options.ref = refName;
            delete(options.props.ref);
        }

        if (type && type.meta) {
            ret = type(options, ...children);
        } else {
            ret = vueCreateElement(type, options, children);
        }
    }

    return ret;
}

function convertChildren(children, vueCreateElement, component) {
    const ret = [];

    if (children && !Array.isArray(children) && typeof children[Symbol.iterator] !== 'function') {
        children = [children];
    }

    for (let item of children) {
        if (Array.isArray(item)) {
            ret.push(...convertChildren(item, vueCreateElement, component));
        } else if (typeof item === 'string') {
            ret.push(item);
        } else if (item && typeof item[Symbol.iterator] === 'function') {
            ret.push(...convertChildren(item, vueCreateElement, component));
        } else if (item && item.isSurfaceElement) {
            ret.push(renderContent(vueCreateElement, item, component));
        } else if (item !== undefined && item !== null) {
            ret.push(item);
        }
    }

    return ret;
}

function determineDefaultValues(config) {
    const ret = {};

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].defaultValue) {
                ret[key] = config.properties[key].defaultValue;
            } else if (config.properties[key].getDefaultValue) {
                const getter = () => config.properties[key].getDefaultValue();
                
                Object.defineProperty(ret, key, { get: getter });
            }
        }
    }

    return ret;
}

function mixProps(props, events, injections, defaultValues, config) {
    let ret = Object.assign({}, props);

    // TODO
    const hasInjections = config.properties
        && Object.keys(config.properties).some(key => config.properties[key].inject);

    if (hasInjections) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].inject
                && injections[key] !== undefined
                && props[key] === undefined) {
                
                let injectedValue = injections[key];

                if (injectedValue instanceof Injection) {
                    injectedValue = injectedValue.value;
                }

                ret[key] = injectedValue;
            }
        }
    }

    if (defaultValues) {
        for (let key of Object.keys(defaultValues)) {
            if (ret[key] === undefined) {
                const defaultValue = defaultValues[key];

                ret[key] = defaultValue;
            }
        }
    }

    if (events) {
        for (let key of Object.keys(events)) {
            // TODO - what's with that array case
            const handler = Array.isArray(events[key])
                ? events[key][0]
                : events[key];

            ret['on' + key[0].toUpperCase() + key.substr(1)] = handler;
        }
    }

    return ret;
}


function determineInjectionKeys(config) {
    const ret = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].inject) {
                ret.push(key);
            }
        }
    }

    return ret;
}


function determineOperations(config) {
    let ret = null;

    if (config.methods) {
        ret = {};

        for (let key of config.methods) {
            ret[key] = function (...args) {
                return this.__applyMethod(key, args);
            };
        }
    }

    return ret;
}

function handleRefCallbacks(comp) {
    for (let key of Object.keys(comp.__refCallbacks)) {
        const
            callback = comp.__refCallbacks[key],
            ref = comp.$refs[key];
        
        delete(comp.__refCallbacks[key]);

        comp.__refCleanupCallbacks[key] = () => callback(null, ref);

        if (callback) {
            callback(ref, null);
        }
    }
}


function handleRefCleanupCallbacks(comp) {
    for (let key of Object.keys(comp.__refCleanupCallbacks)) {
        const callback = comp.__refCleanupCallbacks[key];
        
        delete(comp.__refCleanupCallbacks[key]);

        if (callback) {
            callback();
        }
    }
}

class Injection {
    constructor(getValue) {
        Object.defineProperty(this, 'value', { get: getValue });
    }
}