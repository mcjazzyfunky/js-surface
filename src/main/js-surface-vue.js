
import adaptComponentSystem from
    './api/adaptComponentSystem.js';

import Vue from 'vue';


const {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component
} = adaptComponentSystem({
    createElement: customCreateElement,
    defineFunctionalComponent: customDefineFunctionalComponent,
    defineStandardComponent: customDefineStandardComponent,
    isElement: customIsElement,
    render: customRender
});

export {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    Component
};

// ------------------------------------------------------------------

function returnNull() {
    return null;
}

function customDefineFunctionalComponent(config) {
    const propNames = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            propNames.push(key);
        }
    }

    const component = Vue.extend({
        props: propNames,

        render: function (createElement) {
            const props = this.$options.propsData;

            const content = config.render(props);

            return renderContent(createElement, content);
        }
    });

    return (props, ...children) => {
        const ret = customCreateElement(component, props, ...children); 
        return ret;
    };
}

function customDefineStandardComponent(config) {
    let propNames = [];

    if (config.properties) {
        for (let key of Object.keys(config.properties)) {
            propNames.push(key);
        }
    }

    const component = Vue.extend({
        props: propNames,

        data: {
            index: 0
        },

        beforeMount() {
            this.__viewCallback = content => {
                this.__content = content;
                this.index++;
            };

            this.__stateCallback = state => {
                console.log("new state: ", state)
            };

            const initResult = config.init(
                 this.__viewCallback, this.__stateCallback);

            this.__propsCallback = initResult.propsCallback;
            this.__instance = initResult.instance;
            this.__propsCallback(this.$options.propsData);
        },

        mounted() {
            console.log("=== mounted ===");
            this.__propsCallback(this.$options.propsData); 
        },

        render: function (createElement) {
            console.log("=== render ===");
            return renderContent(createElement, this.__content);
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

    new Vue({
        el: target,
        render(createElement) {
            return renderContent(createElement, content);
        }
    });
}

function renderContent(createElement, content) {
    if (!content || !content.isSurfaceElement) {
        throw new Error('no surface element');
    }

    const
        type = content.type,
        props = content.props,
        children = convertChildren(content.children, createElement);

    let ret;

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

        ret = createElement(type, options, children); 
    } else {
        const options = { props };

        ret = createElement(type, options, children);
    }

    return ret;
}

function convertChildren(children, createElement) {
    const ret = [];

    if (typeof children === 'string') {
        children = [children];
    } else if (children && !Array.isArray(children) && typeof children[Symbol.iterator] !== 'function') {
        children = [children];
    }

    for (let item of children) {
        let convertedItem = null;

        if (Array.isArray(item)) {
            convertedItem = convertChildren(item, createElement);
        } else if (typeof item === 'string') {
            convertedItem = item;
        } else if (item && typeof item[Symbol.iterator] === 'function') {
            convertedItem = convertChildren(Array.prototype.slice(item), createElement);
        } else if (item && item.isSurfaceElement) {
            convertedItem = renderContent(createElement, item);
            
        } else {
            convertedItem = item;
        }

        if (convertedItem !== undefined && convertedItem !== null) {
            ret.push(convertedItem);
        }
    }

    return ret;
}
