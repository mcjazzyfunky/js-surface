import Vue from 'vue';

import { hyperscript as createElement } from '../../js-hyperscript/__modules__/universal';

import adaptDomMountFunction from '../adaption/adaptDomMountFunction';
import adaptIsElementFunction from '../adaption/adaptIsElementFunction';

import createDispatcher from '../helper/createDispatcher';
import createEventHandlerCreators from '../helper/createEventHandlerCreators';
import createLifecycleHandlers from '../helper/createLifecycleHandlers';

import validateProperty from '../validation/validateProperty';

import {} from '../polyfill/polyfill';

let nextRefID = 1;

const
    Adapter = {
        name: 'vue',
        api: { Vue }
    },

    isElement = adaptIsElementFunction({ isElement: customIsElement }),

    mount = adaptDomMountFunction({
        mount: customMount,
        unmount: customUnmount,
        isElement: customIsElement
    }),

    Html = adaptHtmlBuilders({ createElement }),
    Svg = adaptSvgBuilders({ createElement });

const Bling = Object.freeze({
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // add-ons
    Html,
    Svg
});

Bling.Adapter.api.Bling = Bling;

Object.freeze(Bling.Adapter);
Object.freeze(Bling);

export {
    // core
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    mount,
    Adapter,

    // add-ons
    Html,
    Svg
};


function createElement(type, props, ...children) {
    let ret;

    if (type && type.type && type.type.___isComponent === true && typeof type === 'function') {
        type = type.type; 
    }

    ret = {
        type,
        props,
        children,
        isVirtualElement: true
    };

    return ret;
}

function defineComponent(config) {
    const
        propNames =
            Array.isArray(config.properties)
                ? config.properties
                : (config.properties ? Object.keys(config.properties) : []);

    const component = Vue.extend({
        props: determineVuePropsConfig(config),
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
                __state: null,
                __childInjections: null
            };
        },

        created() {
            this.__refCallbacks = {};
            this.__refCleanupCallbacks = {};
            this.__isInitialized = false;

            if (config.initState) {
                this.__state = config.initState(this.__props);
            } else {
                this.__state = null;
            }

            this.__dispatch = createDispatcher(
                () => this.__props,
                () => this.__state,
                state => {
                    this.__state = { ...this.__state, ...state };

                    if (this.__isInitialized) {
                        this.$forceUpdate(); // TODO
                    }
                },
                config.updateState || null,
                config.initMiddleware | null);
            
            this.__lifecycleHandlers =
                config.lifecycle
                    ? createLifecycleHandlers(config.lifecycle, this.__dispatch)
                    : {};

            this.__eventHandlerCreators =
                config.events
                    ? createEventHandlerCreators(
                        config.events,
                        () => this.__props,
                        () => this.__state,
                        this.__dispatch)
                    : null;
        },

        beforeMount() {
            if (this.__lifecycleHandlers.willMount) {
                this.__lifecycleHandlers.willMount({
                    props: this.__props,
                    state: this.__state
                });
            }
        },
        
        mounted() {
            this.__isInitialized = true;

            if (this.__lifecycleHandlers.didMount) {
                this.__lifecycleHandlers.didMount({
                    props: this.__props,
                    state: this.__state
                });
            }
        },

        beforeUpdate() {
        },

        updated() {
            if (this.__lifecycleHandlers.didUpdate) {
                this.__lifecycleHandlers.didUpdate({
                    props: this.__props,
                    state: this.__state
                });
            }
        },

        beforeDestroy() {
            if (this.__lifecycleHandlers.willUnmount) {
                this.__lifecycleHandlers.willUnmount({
                    props: this.__props,
                    state: this.__state
                });
            }
        },

        render(vueCreateElement) {
            const content = config.render({
                props: this.__props,
                state: this.__state,
                events: this.__eventHandlerCreators
            });

            return renderContent(vueCreateElement, content, this);
        },

        errorCaptured(error) {
            if (this.__lifecycleHandlers.didCatch) {
                this.__lifecycleHandlers.didCatch(error, this.__props, this.__state);
            }
        },

        computed: {
            __props() {
                const ret = {};

                for (let i = 0; i < propNames.length; ++i) {
                    const propName = propNames[i];

                    ret[propNames[i]] = this[propName];
                }

                return ret;
            }
        }
    });

    const factory = createElement.bind(null, component);
    factory.type = component;
    factory.type.___isComponent = true;
    Object.freeze(factory);

    return factory;
}

function inspectElement(it) {
    let ret = null;

    if (isElement(it)) {
        ret = { type: it.type, props: it.props };
    }

    return ret;
}

function customIsElement(it) {
    return it !== null
        && typeof it === 'object'
        && it.isVirtualElement === true;
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
    if (!content || !content.isVirtualElement) {
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
        } else if (item && item.isVirtualElement) {
            ret.push(renderContent(vueCreateElement, item, component));
        } else if (item !== undefined && item !== null) {
            ret.push(item);
        }
    }

    return ret;
}


function getNextRefName() {
    const ret = 'ref-' + nextRefID.toString(16);

    if (nextRefID === Number.MAX_SAFE_INTEGER) {
        nextRefID = 0;
    } else {
        ++nextRefID;
    }

    return ret;
}

function determineVuePropsConfig(config) {
    let ret = null;

    if (Array.isArray(config.properties)) {
        ret = config.properties;
    } else if (config.properties) {
        const propNames = Object.keys(config.properties);
        
        ret = {};

        for (let i = 0; i < propNames.length; ++i) {
            const
                propName = propNames[i],
                propConfig = config.properties[propName];

            ret[propName] = {};

            if (propConfig.type
                || propConfig.constraint
                || propConfig.nullable !== true) {

                ret[propName].validator = it => {
                    const validationError = validateProperty(
                        it, propName, propConfig.type,
                        propConfig.nullable, propConfig.constraint);

                    if (validationError) {
                        const error = new Error(
                            'Validation error for component '
                                + `"${config.displayName}" => `
                                + validationError.message);

                        throw error;
                    }

                    return true;
                };
            }
            /*
            if (propConfig.type) {
                ret[propName].type = propConfig.type;
            }

            if (propConfig.constraint) {
                ret[propName].validator = it => {
                    const
                        validator = propConfig.constraint,

                        result = typeof validator === 'function'
                            ? validator(it)
                            : validator.validate(it);

                    if (result) {
                        let errorMsg;

                        if (typeof result.message === 'string') {
                            errorMsg = result.message.trim();
                        } else if (typeof result === 'string') {
                            errorMsg = result.trim();
                        } else {
                            errorMsg = 'Invalid property';
                        }

                        throw new Error(
                            `Validation error for property "${propName}" `
                            + `of component "${config.displayName}" => `
                            + errorMsg);
                    }

                    return true;
                }
            }
            */

            if (propConfig.hasOwnProperty('defaultValue')) {
                ret[propName].default = () => propConfig.defaultValue;
            } else if (propConfig.getDefaultValue) {
                ret[propName].default = propConfig.getDefaultValue;
            } else {
                ret[propName].required = true;
            }
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

