import adaptRenderEngine from
    './adaption/adaptRenderEngine';

import InnerComponent from './class/InnerComponent';

import InfernoCore from 'inferno';
import createInfernoElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';


const stateUpdatedPromise = Promise.resolve(true);

const Inferno = Object.assign({}, InfernoCore, {
    createElement: createInfernoElement,
    Component: InfernoComponent    
});

const {
    createElement,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
} = adaptRenderEngine({
    renderEngine: {
        name: 'inferno',
        api: Inferno,
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
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
    isRenderable,
    render,
    RenderEngine
};

// ------------------------------------------------------------------

function returnNull() {
    return null;
}

function customDefineFunctionalComponent(config) {
    let func;
    const injectPropsNames = [];

    if (config.properties) {
        for (let property of Object.keys(config.properties)) {
            if (config.properties[property].inject) {
                injectPropsNames.push(property);
            }
        }
    }

    if (injectPropsNames.length === 0) {
        func = props => config.render(props);
    } else {
        func = (props, context) => {
            return config.render(mixPropsWithContext(props, context));
        };

        func.contextTypes = {};

        for (let propName of injectPropsNames) {
            func.contextTypes[propName] = returnNull;
        }
    }

    func.displayName = config.displayName;

    const factory = Inferno.createElement.bind(null, func);
    factory.component = func;
    return factory;
}

function customDefineStandardComponent(config) {
    const ExtCustomComponent = class extends CustomComponent {
        constructor(...args) {
            super(config, ...args);
        }
    };

    if (config.publicMethods) {
        for (const key of config.publicMethods) {
            ExtCustomComponent.prototype[key] = function (...args) {
                return this.__innerComponent.applyPublicMethod(key, args);
            };
        }
    }

    ExtCustomComponent.displayName = config.displayName;

    if (config.childInjections) {
        ExtCustomComponent.childContextTypes = {};

        for (let key of config.childInjections) {
            ExtCustomComponent.childContextTypes[key] = returnNull;
        }

        ExtCustomComponent.prototype.getChildContext = function() {
            return this.__innerComponent.provideChildInjections();
        };
    }

    const factory = (...args) => {
        return createElement(ExtCustomComponent, ...args);
    };

    factory.component = ExtCustomComponent;

    return factory;
}

function customCreateElement(tag, props, ...children) {
    // TODO: For performance reasons
    if (tag === undefined || tag === null) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

    if (props && tag === 'label' && props.htmlFor) {
        props = Object.assign({}, props);
        props.for = props.htmlFor;
        delete(props.htmlFor);
    }

    if (!children) {
        ret = Inferno.createElement(tag, adjustProps(props));
    } else {
        const newArguments = [tag, adjustProps(props)];

        for (let child of children) {
            if (child && !Array.isArray(child) && typeof child[Symbol.iterator] === 'function') {
                newArguments.push(Array.from(child));
            } else {
                newArguments.push(child);
            }
        }

        ret = Inferno.createElement.apply(null, newArguments);
    }

    return ret;
}

function customIsElement(it) {
    return it !== undefined
        && it !== null
        && typeof it === 'object'
        && !!(it.flags & (28 | 3970 )); // 28: component, 3970: element
}

function customRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    Inferno.render(content, target);
}

class CustomComponent extends Inferno.Component {
    constructor(config, superArgs) {
        super(...superArgs);

        this.__view = null;
        this.__viewUpdateResolver = null;
 
        const
            updateView = view => {
                this.__view = view;

                return new Promise(resolve => {
                    this.__viewUpdateResolver = resolve;
                    super.forceUpdate();
                });
            },

            updateState = state => {
                this.state = state;
                return stateUpdatedPromise;
            };

        this.__innerComponent =
            new InnerComponent(config, updateView, updateState);
    }

    forceUpdate() {
        this.__innerComponent.forceUpdate();
    }

    componentWillMount() {
        this.props = mixPropsWithContext(this.props, this.context);
        this.__innerComponent.receiveProps(this.props);
    }

    componentDidMount() {
        if (this.__viewUpdateResolver) {console.log('componentDidMount3')
            this.__viewUpdateResolver(true);
            this.__viewUpdateResolver = null;
        }
    }

    componentDidUpdate() {
        if (this.__viewUpdateResolver) {
            this.__viewUpdateResolver();
            this.__viewUpdateResolver = null;
        }
    }

    componentWillUnmount() {
        this.__innerComponent.receiveProps(undefined);
    }

    componentWillReceiveProps(nextProps) {
        this.props = mixPropsWithContext(nextProps, this.context);
        this.__innerCompoennt.receiveProps(this.props);
    }

    render() {
        return this.__view;
    }
}

function mixPropsWithContext(props, context) {
    console.log(context)

    let ret = props;

    if (context) {
        ret = Object.assign({}, props);

        for (let key of Object.keys(context)) {
            if (context[key] !== undefined && props[key] === undefined) {
                ret[key] = context[key];
            }
        }
    }

    return ret;
}

function adjustProps(props) {
    let ret = props;

    if (props && props.ref) {
        ret = Object.assign({}, props);

        if (props.ref) {
            ret.ref = adjustRefCallback(props.ref);
        }
    }

    return ret;
}

function adjustRefCallback(refCallback) {
    let involvedElement = null;

    return element => {
        if (element) {
            refCallback(element, null);
            involvedElement = element;
        } else {
            refCallback(null, involvedElement);
            involvedElement = null;
        }
    };
}
