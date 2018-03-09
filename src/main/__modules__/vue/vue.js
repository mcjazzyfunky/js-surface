import adaptDefineComponentFunction from '../../adaption/adaptDefineComponentFunction.js';
import adaptMountFunction from '../../adaption/adaptMountFunction.js';

import createElement from 'js-hyperscript/universal';

import Vue from 'vue';

const
    doNothing = () => {},

    Surface = {}, // will be filled later

    isElement = it => it && it.isElement === true,

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
    };

Object.assign(Surface, {
    createContext,
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
    // no Fragment as Vue does not support fragments
});

Object.freeze(Surface);

export default Surface;

export {
    createContext,
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter
    // no Fragment as Vue does not support fragments
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
    const
        render = config.render,
        newConfig = {...config};

    newConfig.init = (initialProps, refresh) => {
        let props = initialProps;

        return {
            receiveProps(nextProps) {
                props = nextProps;
    
                refresh();
            },

            render() {
                return render(props);
            }
        };
    };

    delete newConfig.render;

    return createStandardComponentType(newConfig);
}

function createStandardComponentType(config) {
    const
        defaultValues = determineDefaultValues(config),
        propsConfig = {},
        keys = config.properties ? Object.keys(config.properties) : null;

    if (keys) {
        for (let i = 0; i < keys.length; ++i) {
            propsConfig[keys[i]] = {};
        }
    }

    propsConfig['__' + config.displayName + '__'] = {
        default() {
            if (this.__isInitialized && this.__receiveProps) {
                Vue.nextTick(() => {
                    this.__props = mixProps(
                        this.$options.propsData,
                        this.$slots.default,
                        this._events,
                        defaultValues,
                        config,
                        this);
                    this.__receiveProps(this.__props);
                });
            }

            return undefined;
        }
    };

    const component = Vue.extend({
        name: config.displayName,
        props:  propsConfig, 
        methods: determineOperations(config),

        created() {
            this.__refresh = callback => {
                this.$forceUpdate();

                if (callback) {
                    callback();
                }
            };

            this.__refCallbacks = {};
            this.__refCleanupCallbacks = {};
            this.__nextState = {};
            this.__isInitialized = false;

            this.__props = 
                mixProps(
                    this.$options.propsData,
                    this.$slots.default,
                    this._events,
                    defaultValues,
                    config,
                    this);

            this.__state = undefined;

            this.__updateState = (updater, callback) => {
                const newState = updater(this.__state);
                this.__nextState = Object.assign({}, this.__nextState, newState);

                if (!this.__isInitialized) {
                    this.__state = this.__nextState;
                } else {
                    Vue.nextTick(() => {
                        this.__state = this.__nextState;

                        if (callback) {
                            callback(this.__state);
                        }
                    });
                }
            };

            const initResult = config.init(
                this.__props, this.__refresh, this.__updateState);

            this.__render = initResult.render;

            if (initResult.receiveProps) {
                this.__receiveProps = props => {
                    initResult.receiveProps(props);
                };
            }

            this.__finalize = initResult.finalize || doNothing;
            this.__runOperation = initResult.runOperation;

            if (config.isErrorBoundary) {
                this.__isErrorBoundary = true;
                this.__handleError = initResult.handleError;
            }
        },

        beforeMount() {
            this.__props = 
                mixProps(
                    this.$options.propsData,
                    this.$slots.default,
                    this._events,
                    defaultValues,
                    config,
                    this);
        },

        mounted() {
            this.__isInitialized = true;
            this.__preventForceUpdate = false;
            
            handleRefCallbacks(this);
        },

        beforeUpdate() {
            handleRefCleanupCallbacks(this);
            
            this.__props =
                mixProps(
                    this.$options.propsData,
                    this.$slots.default,
                    this._events,
                    defaultValues,
                    config,
                    this);
        },

        updated() {
            this.__preventForceUpdate = false;
            
            handleRefCallbacks(this);
        },

        beforeDestroy() {
            this.__finalize();
            handleRefCleanupCallbacks(this);
        },

        render(vueCreateElement) {
            const ret = renderContent(vueCreateElement,
                this.__render(this.__props, this.__state), this);

            return ret;
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

function renderContent(vueCreateElement, content, component = null) {
    if (!content || content.isElement !== true) {
        throw new Error('not a virtual UI element');
    }

    let props = content.props;

    const
        type = content.type,
        children = content.children
            ? convertChildren(content.children, vueCreateElement, component)
            : null;

    let ret, refCallback = null, refName = null;

    if (props && props.ref) {
        refCallback = props.ref,
        refName = getNextRefName(),
        props = Object.assign({}, props);

        props.ref = refName;

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

function convertChildren(children, vueCreateElement, parent) {
    const ret = [];

    if (children && !Array.isArray(children) && typeof children[Symbol.iterator] !== 'function') {
        children = [children];
    }

    if (children) {
        for (let i = 0; i < children.length; ++i) {
            const item = children[i];

            if (Array.isArray(item)) {
                ret.push(...convertChildren(item, vueCreateElement, parent));
            } else if (typeof item === 'string') {
                ret.push(item);
            } else if (typeof item === 'function') {
                if (parent.__isContextConsumer !== true) {
                    throw new Error('Child of type "function" is only allowed for context consumers');
                } else if (i > 0) {
                    throw new Error('Only the first child of a context consumer can be a function');
                }

                ret.push({ apply: item });
            } else if (item && typeof item[Symbol.iterator] === 'function') {
                ret.push(...convertChildren(item, vueCreateElement, parent));
            } else if (item && item.isElement) {
                ret.push(renderContent(vueCreateElement, item, item.type));
            } else if (item !== undefined && item !== null) {
                ret.push(item);
            }
        }
    }

    return ret;
}

function determineDefaultValues(config) {
    const ret = {};

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].hasOwnProperty('defaultValue')) {
                ret[key] = config.properties[key].defaultValue;
            } else if (config.properties[key].getDefaultValue) {
                const getter = () => config.properties[key].getDefaultValue();
                
                Object.defineProperty(ret, key, { get: getter });
            }
        }
    }

    return ret;
}

function mixProps(props, children, events, defaultValues) {
    let ret = Object.assign({}, props);

    if (children && children.length > 0) {
        ret.children = children;
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

function determineOperations(config) {
    let ret = null;

    if (config.operations) {
        ret = {};

        for (let key of config.operations) {
            ret[key] = function (...args) {
                return this.__runOperation(key, args);
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

let nextContextId = 1;

function createContext(defaultValue) {
    const
        contextName = '__$$context-' + nextContextId++,

        Provider = Vue.extend({
            name: 'ContextProvider',
            functional: false,

            props: {
                value: defaultValue
            },

            data() {
                return {
                    contextData: { value: this.value }
                };
            },

            provide() {
                return {
                    [contextName]: this.contextData
                };
            },

            watch: {
                value() {
                    this.contextData.value = this.value;
                }
            },

            render(vueCreateElement) {
                return renderContent(vueCreateElement,
                    createElement('span', null, this.$slots.default));
            }
        }),

        Consumer = Vue.extend({
            name: 'ContextConsumer',
            functional: false,
            inject: [contextName],

            render(vueCreateElement) {
                const
                    value = this[contextName].value,
                    consume = this.$slots.default ? this.$slots.default[0].apply : null,
                    content = consume ? consume(value) : null;

                return renderContent(vueCreateElement,
                    createElement('span', null, content), this);
            }
        });

    Object.defineProperty(Consumer, '__isContextConsumer', {
        enumerable: false,
        value: true
    });

    return { Provider, Consumer };
}