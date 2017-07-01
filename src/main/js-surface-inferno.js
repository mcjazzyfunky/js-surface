import adaptComponentSystem from
    './api/adaptComponentSystem.js';

import InfernoCore from 'inferno';
import createInfernoElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

const Inferno = Object.assign({}, InfernoCore, {
    createElement: createInfernoElement,
    Component: InfernoComponent    
});

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
    defineComponent,
    isElement,
    isRenderable,
    render,
    Component,
    ComponentSystem
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

    return Inferno.createElement.bind(null, func);
}

function customDefineStandardComponent(config) {
    // Sorry for that evil eval hack - do not know how to
    // ExtCustomComponent's class name otherwise
    // (ExtCustomComponent.name is read-only).
    const ExtCustomComponent = eval(`(class ${config.displayName} extends CustomComponent {
        constructor(...args) {
            super(args, config);
        }
    })`);

    if (config.publicMethods) {
        for (let key of Object.keys(config.publicMethods)) {
            ExtCustomComponent.prototype[key] = function () {
                return config.publicMethods[key](this.__instance, arguments);
            };
        }
    }

    ExtCustomComponent.displayName = config.displayName;

    if (config.childInjectionKeys) {
        ExtCustomComponent.childContextTypes = {};

        for (let key of config.childInjectionKeys) {
            ExtCustomComponent.childContextTypes[key] = returnNull;
        }

        ExtCustomComponent.prototype.getChildContext = function() {
            return this.__getChildInjection();
        };
    }

    return (...args) => {
        return createElement(ExtCustomComponent, ...args);
    };
}

function customCreateElement(tag, props, ...children) {
    // TODO: For performance reasons
    if (tag === undefined || tag === null) {
        throw new TypeError(
            '[createElement] '
            + "First argument 'tag' must not be undefined or null");
    }

    let ret;

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
    constructor(superArgs, config) {
        super(...superArgs);

        this.__viewToRender = null;
        this.__resolveRenderingDone = null;
        this.__needsUpdate = false;

        let initialized = false;

        const
            { propsConsumer, instance, getChildInjection } = config.init(
                view => {
                    this.__viewToRender = view;

                    if (initialized) {
                        this.__needsUpdate = true;
                        this.setState(null);
                    } else {
                        initialized = true;
                    }

                    return buildUpdatedViewPromise(this);
                },
                state => {
                    this.state = state;
                });

        this.__propsConsumer = propsConsumer;
        this.__instance = instance;

        if (getChildInjection) {
            this.__getChildInjection = getChildInjection;
        }
    }

    componentWillMount() {
        this.props = mixPropsWithContext(this.props, this.context);
        this.__propsConsumer(this.props);
    }

    componentDidMount() {
        if (this.__resolveRenderingDone) {
            this.__resolveRenderingDone();
        }
    }

    componentDidUpdate() {
        if (this.__resolveRenderingDone) {
            this.__resolveRenderingDone();
        }
    }

    componentWillUnmount() {
        this.__propsConsumer(undefined);
    }

    componentWillReceiveProps(nextProps) {
        this.props = mixPropsWithContext(nextProps, this.context);
        this.__propsConsumer(this.props);
    }

    shouldComponentUpdate() {
        const ret = this.__needsUpdate;
        this.__needsUpdate = false;
        return ret;
    }

    render() {
        return this.__viewToRender;
    }
}

function mixPropsWithContext(props, context) {
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

function buildUpdatedViewPromise(infernoComponent) {
    let done = false;

    return new Promise(resolve => {
        if (!done) {
            infernoComponent.__resolveRenderingDone = () => {
                infernoComponent.__resolveRenderingDone = null;
                resolve(true);
            };

            done = true;
        } else {
            resolve(true);
        }
    });
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
