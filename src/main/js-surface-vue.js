
import adaptComponentSystem from
    './api/adaptComponentSystem.js';

import Vue from 'vue';

console.log(Object.keys(Vue));

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
    const component = Vue.extend({
        render: function (createElement) {console.log(1111, this)
            return renderContent(createElement, config.render(this.$options.propsData));
        }
    });

    return (props, ...children) => customCreateElement(component, props, ...children); 
}

function customDefineStandardComponent(config) {
    return defineFunctionalComponent({
        displayName: 'XXX',
        render() {
            return createElement('div', null, ['Juhuuuuuuuuuu']);
        }
    });
}

function customCreateElement(tag, props, ...children) {
    return {
        type: tag,
        props,
        children,
        isSurfaceElement: true
    };
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

function renderContent(createElement, content) {console.log(1)
    const
        type = content.type,
        props = content.props,
        children = content.children;
    
    let ret;

    if (typeof type === 'string') {
        ret = createElement(type, { attrs: props }, children); 
    } else {console.log(5555, props, type)
        ret = createElement(type, { props }, children);
    }

    return ret;
}