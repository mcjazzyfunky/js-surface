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
    createElement: customCreateElement,
    defineFunctionalComponent: customDefineFunctionalComponent,
    defineStandardComponent: customDefineStandardComponent,
    isElement: customIsElement,
    render: customRender
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
    const
        propNames = [],
        injectPropNames = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            propNames.push(key);

            if (config.properties[key].inject) {
                injectPropNames.push(key);
            }
        }
    }

    const component = Vue.extend({
        props: propNames,

        inject: injectPropNames,

        render: function (vueCreateElement) {
            const props = this.$options.propsData;

            const content = config.render(props);

            return renderContent(vueCreateElement, content, this);
        }
    });



    return (props, ...children) => {
        const ret = customCreateElement(component, props, ...children); 
        return ret;
    };
}

function customDefineStandardComponent(config) {
    const
        propNames = [],
        injectPropNames = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            propNames.push(key);
            
            if (config.properties[key].inject) {
                injectPropNames.push(key);
            }
        }
    }
    injectPropNames.push('xxx');

    const component = Vue.extend({
        props: propNames,

        inject: injectPropNames,

        data: {
            index: 0
        },

        beforeMount() {
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
            this.__propsConsumer(this.$options.propsData);
            this.__refCallbacks = {};
        },

        mounted() {
            this.__propsConsumer(this.$options.propsData); 
        
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

        render: function (vueCreateElement) {
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
