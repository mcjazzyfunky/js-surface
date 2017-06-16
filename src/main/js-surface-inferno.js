import adaptComponentSystem from
    './api/adaptComponentSystem.js';

import adaptDefineStandardComponent from 
    './internal/component/adaption/adaptDefineStandardComponent.js';

import enhanceWithComponentMeta from
    './internal/component/helper/enhanceWithComponentMeta.js';

import { render as renderInferno } from 'inferno';
import createInfernoElement from 'inferno-create-element';
import InfernoComponent from 'inferno-component';

const {
    createElement,
    defineDispatchComponent,
    defineClassComponent,
    defineFunctionalComponent,
    defineStandardComponent,
    isElement,
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
    render,
    Component
};

// ------------------------------------------------------------------

function customDefineFunctionalComponent(config) {
    const ret = props => config.render(props);

    ret.displayName = config.displayName;

    return ret;
}

function customDefineStandardComponent(config) {
    return adaptDefineStandardComponent(config, adjustedConfig => {
        class ExtCustomComponent extends CustomComponent {
            constructor(...args) {
                super(args, adjustedConfig);
            }
        }

        ExtCustomComponent.displayName = adjustedConfig.displayName;

        enhanceWithComponentMeta(ExtCustomComponent, config);

        return (...args) => {
            return createElement(ExtCustomComponent, ...args);
        };
    });
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
        ret = createInfernoElement.apply(null, arguments);
    } else {
        const newArguments = [tag, props];

        for (let child of children) {
            if (child && !Array.isArray(child) && typeof child[Symbol.iterator] === 'function') {
                newArguments.push(Array.from(child));
            } else {
                newArguments.push(child);
            }
        }

        ret = createInfernoElement.apply(null, newArguments);
    }

    return ret;
}

function customIsElement(it) {
    return it !== undefined
        && it !== null
        && typeof it === 'object'
        && !!(it.flags & (28 | 3970 )); // 28: component, 3970: element
};

function customRender(content, targetNode) {
    if (!isElement(content)) {
        throw new TypeError(
            "[render] First argument 'content' has to be a valid element");
    }

    const target = typeof targetNode === 'string'
        ? document.getElementById(targetNode)
        : targetNode;

    renderInferno(content, target);
}

class CustomComponent extends InfernoComponent {
    constructor(superArgs, config) {
        super(...superArgs);

        this.__viewToRender = null;
        this.__resolveRenderingDone = null;
        this.__needsUpdate = false;

        let initialized = false;

        const
            { onProps, api } = config.init(
                view => {
                    this.__viewToRender = view;

                    if (initialized) {
                        this.__needsUpdate = true;
                        this.setState(null);
                    } else {
                        initialized = true;
                    }

                    return new Promise(resolve => {
                        this.__resolveRenderingDone = () => {
                            this.__resolveRenderingDone = null;
                            resolve(true);
                        };
                    });
                });

        this.__onProps = onProps;

        if (api) {
            Object.assign(this, api);
        }
    }

    componentWillMount() {
        this.__onProps(this.props);
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
        this.__onProps(undefined);
    }

    componentWillReceiveProps(nextProps) {
        this.__onProps(nextProps);
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

