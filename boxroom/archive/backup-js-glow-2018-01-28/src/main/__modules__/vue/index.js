import adaptDefineComponentFunction from '../../adaption/adaptDefineComponentFunction';
import adaptIsElementFunction from '../../adaption/adaptIsElementFunction';
import adaptMountFunction from '../../adaption/adaptMountFunction';

import Vue from 'vue';

let nextRefID = 1;


// ---------------------------------------------------------------

function renderContent(vueCreateElement, content, component) {
    if (!content || !content.isSurfaceElement) {
        throw new Error('no surface element');
    }

    console.log(content)

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

    if (children) {
        if (!Array.isArray(children) && typeof children[Symbol.iterator] !== 'function') {
            children = [children];
        } else {
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
        }
    }

    return ret;
}

// ------------------------------------------------------------------

function getNextRefName() {
    const ret = 'ref-' + nextRefID.toString(16);

    if (nextRefID === Number.MAX_SAFE_INTEGER) {
        nextRefID = 0;
    } else {
        ++nextRefID;
    }

    return ret;
}

// ------------------------------------------------------------------

function decorateComponentFunction(componentFunction, meta) {
    const ret = componentFunction.bind(null); 

    const type = Vue.extend({
        functional: true,
        props: Object.keys(meta.properties || {}),
        inject: null, //determineInjectionKeys(config),

        render: function (vueCreateElement, context) {
            const
                props = context.props, // mixProps(context.props, context.listeners, context.injections, defaultValues, config),
                content = componentFunction(props);

            return renderContent(vueCreateElement, content, this);
        }
    });

    ret.type = type;
    ret.factory = createFactory(type);

    return ret;
}


function decorateComponentClass() {
    // TODO
}

// ------------------------------------------------------------------

function createFactory(type) {
    const ret = createElement.bind(null, type);
    ret.type = type;

    return ret;
}

// ------------------------------------------------------------------

class Component {
    componentWillMount() {
    }

    componentDidMount() {
    }
    
    componentWillReceiveProps() {
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
    }


    componentWillUnmount() {
    }

    componentDidCatch() {
    }

    shouldComponentUpdate() {
    }

    render() {
    }
}

// ------------------------------------------------------------------

const
    createElement = (type, props, ...children) => 
        children.length === 0
            ? { type, props, isSurfaceElement: true }
            : { type, props, children, isSurfaceElement: true },

    defineComponent = adaptDefineComponentFunction({
        BaseComponentClass: Component,
        adaptedCreateElementFunction: createElement,
        decorateComponentFunction,
        decorateComponentClass
    }),

    isElement = adaptIsElementFunction({
        isElement: it =>
            !!it && typeof it === 'object' && it.isSurfaceElement === true
    }),

    isFactory = null, // TODO

    inspectElement = it =>
        it && typeof it === 'object' && it.isSurfaceElement === true
            ? { type: it.type, props: it.props }
            : null,
    
    mount = adaptMountFunction({
        mountFunction: (content, targetNode) => {
            const container = document.createElement('span');
            targetNode.appendChild(container);

            const vueComponent = new Vue({
                el: container,
        
                render(vueCreateElement) {
                    return renderContent(vueCreateElement, content, this);
                },
        
                methods: {
                    create() {
                    },
        
                    destroy() {
                        this.$destroy();
                        delete targetNode.__mountedVueComponent;
                        targetNode.innerHTML = '';
                    }
                }
            });

            targetNode.__mountedVueComponent = vueComponent;
        }
    }),

    unmount = adaptMountFunction({
        unmountFunction: node => {
            if (node && node.__mountedVueComponent) {
                const component = node.__mountedVueComponent;
                delete node.__mountedVueComponent;
                component.destroy();
            }
        }
    });


const Surface = {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    isFactory,
    mount,
    unmount,
    Adapter: null, // Adapter will be set below

    __internal__: {
        Component
    }
};

const Adapter = Object.freeze({
    name: 'vue',
    api: Object.freeze({
        Vue,
        Surface
    })
});

Surface.Adapter = Adapter;

Object.freeze(Surface);

export default Surface;

export {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    isFactory,
    mount,
    unmount,
    Adapter
};
