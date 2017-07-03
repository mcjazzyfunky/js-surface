import adaptComponentSystem from
    './api/adaptComponentSystem.js';

import Vue from 'vue';

const {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component,
    ComponentSystem
} = adaptComponentSystem({
    componentSystem: {
        name: 'vue',
        api: { Vue },
    },
    interface: {
        createElement: customCreateElement,
        defineFunctionalComponent: customDefineFunctionalComponent,
        defineStandardComponent: customDefineStandardComponent,
        isElement: customIsElement,
        render: customRender
    }
});

export {
    createElement,
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component,
    ComponentSystem
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

function customDefineFunctionalComponent(config) {
    const defaultValues = determineDefaultValues(config);

    const component = Vue.extend({
        functional: true,
        props: Object.keys(config.properties || {}),
        inject: determineInjectionKeys(config),

        render: function (vueCreateElement, context) {
            const
                props = mixProps(context.props, context.injections, defaultValues, config),
                content = config.render(props);

            return renderContent(vueCreateElement, content, this);
        }
    });

    return (props, ...children) => {
        const ret = customCreateElement(component, props, ...children); 
        return ret;
    };
}

function customDefineStandardComponent(config) {
    const defaultValues = determineDefaultValues(config);

    const component = Vue.extend({
        props: Object.keys(config.properties || {}),
        inject: determineInjectionKeys(config),

        provide: !config.childInjectionKeys ? null : function () {
            let ret = null;

            if (config.childInjectionKeys) {
                let injection = null;
                ret = {};

                for (let key of config.childInjectionKeys) {
                    Object.defineProperty(ret, key, {
                        enumerable: true,
                        
                        get: () => {
                            let val;

                            if (!injection && this.__getChildInjection) {
                                injection = this.__getChildInjection() || null;

                                if (this.childInjection) {
                                    this.childInjection = injection;
                                }
                            }

                            if (injection) {
                                val = this.data
                                    ? this.childInjection[key]
                                    : injection[key]
                            }

                            if (injection && !this.data) {
                            }

                            return val;
                        }
                    });
                }
            }

            return ret;
        },

        created() {
            this.__resolveRenderingDone = null;
            this.__viewConsumer = content => {
                this.__content = content;
                this.$forceUpdate();

                return new Promise(resolve => {
                    this.__resolveRenderingDone = () => {
                        this.__resolveRenderingDone = null;
                        resolve(true);
                    };
                });
            };

            this.__stateConsumer = state => {
                this.__state = state;
            };

            const initResult = config.init(
                 this.__viewConsumer, this.__stateConsumer);

            this.__propsConsumer = initResult.propsConsumer;
            this.__instance = initResult.instance;
            this.__getChildInjection = initResult.getChildInjection;
        },

        beforeMount() {

            this.__propsConsumer(
                mixProps(
                    this.$options.propsData,
                    this,
                    defaultValues, config));

            this.__refCallbacks = {};
        },

        mounted() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }
        },

        updated() {
            if (this.__resolveRenderingDone) {
                this.__resolveRenderingDone();
            }

            for (let key of Object.keys(this.$refs)) {
                this.__refCallbacks[key](this.$refs[key]);
            }
        },

        beforeDestroy() {
            this.__propsConsumer(undefined);
        },

        render(vueCreateElement) {
            if (this.childInjection) {
                Object.assign({}, this.childInjection);
            }


            return renderContent(vueCreateElement, this.__content, this);
        }
    });

    return (props, ...children) => {
        const ret = customCreateElement(component, props, ...children); 

        return ret;
    };
}

function customCreateElement(tag, props, ...children) {
    const ret = {
        type: tag,
        props,
        children,
        isSurfaceElement: true
    };

    return ret;
}

function customIsElement(it) {
    return it && it.isSurfaceElement;
}

function customRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    if (target) {
        target.innerHTML = '';
        target.appendChild(document.createElement('div'));

        new Vue({
            el: target.children[0],
            render(vueCreateElement) {
                return renderContent(vueCreateElement, content, this);
            }
        });
    }
}

function renderContent(vueCreateElement, content, component) {
    if (!content || !content.isSurfaceElement) {
        throw new Error('no surface element');
    }

    const
        type = content.type,
        props = content.props,
        children = convertChildren(content.children, vueCreateElement, component);

    let ret, ref = null, refName = null;


    if (props && props.ref) {
        ref = props.ref;
        refName = getNextRefName();

        if (!component.__refCallbacks) {
            component.__refCallbacks = {};
        }

        component.__refCallbacks[refName] = {
            callback: ref,
            element: null
        };
    }

    if (typeof type === 'string') {
        const attrs = Object.assign({}, props);
        const options = { attrs };

        if (attrs.className) {
            attrs.class = attrs.className;
            
            delete(attrs.className);
        }

        if (attrs.style) {
            options.style = attrs.style;
            delete(attrs.style);          
        }

        for (let key of Object.keys(attrs)) {
            if (key.substr(0, 2) === 'on' && key[2] >= 'A' && key[2] <= 'Z') {
                const handler = attrs[key];
                delete(attrs[key]);

                const newKey = key[2].toLowerCase() + key.substr(3);

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

        ret = vueCreateElement(type, options, children); 
    } else {
        const options = { props };

        if (refName) {
            options.ref = refName;
            delete(options.props.ref);
        }

        ret = vueCreateElement(type, options, children);
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

function mixProps(props, injections, defaultValues, config) {
    let ret = Object.assign({}, props);

    if (injections) {
        for (let key of Object.keys(config.properties)) {
            if (config.properties[key].inject
                && injections[key] !== undefined
                && props[key] === undefined) {
                
                ret[key] = injections[key];
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

