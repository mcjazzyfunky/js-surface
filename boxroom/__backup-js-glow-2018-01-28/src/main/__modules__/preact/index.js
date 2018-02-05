import adaptReactExports from '../../adaption/adaptReactExports';
import convertIterablesToArrays from '../../util/convertIterablesToArrays';

import Preact from 'preact';

const { h, render, Component } = Preact;

const
    Surface = {}, // will be filled later
    VNode = h('').constructor,

    React = {
        isValidElement: it => it instanceof VNode,
        Component: Preact.Component,
        
        createElement(...args) {
            return h.apply(null, convertIterablesToArrays(args));
        },

        // TODO - Wait for a newer version of Preact that hopefully
        // will have some kind of fragment support.
        Fragment: 'x-fragment' // Not really working in all cases - but what shall we do?
    },

    ReactDOM = {
        render,
        unmountComponentAtNode: targetNode => render('', targetNode)
    };

const {
    createElement,
    defineComponent,
    inspectElement,
    isElement,
    isFactory,
    mount,
    unmount,
    Adapter
} = adaptReactExports({
    React,
    ReactDOM,
    adapterName: 'preact',
    adapterAPI: { Preact, Surface }
});

Surface.createElement = createElement;
Surface.defineComponent = defineComponent;
Surface.inspectElement = inspectElement;
Surface.isElement = isElement;
Surface.isFactory = isFactory;
Surface.mount = mount;
Surface.unmount = unmount;
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

// -----------------------------------------------------------------------

class Portal extends Component {
    componentDidUpdate(props) {
        for (let i in props) {
            if (props[i]!==this.props[i]) {
                return this.renderLayer();
            }
        }
    }

    componentDidMount() {
        this.renderLayer();
    }

    componentWillUnmount() {
        this.renderLayer(false);
        if (this.remote) this.remote.parentNode.removeChild(this.remote);
    }

    findNode(node) {
        return typeof node==='string' ? document.querySelector(node) : node;
    }

    renderLayer(show=true) {
        // clean up old node if moving bases:
        if (this.props.into!==this.intoPointer) {
            this.intoPointer = this.props.into;
            if (this.into && this.remote) {
                this.remote = render(h(PortalProxy), this.into, this.remote);
            }
            this.into = this.findNode(this.props.into);
        }

        this.remote = render((
            <PortalProxy context={this.context}>
                { show && this.props.children || null }
            </PortalProxy>
        ), this.into, this.remote);
    }

    render() {
        return null;
    }
}


// high-order component that renders its first child if it exists.
// used as a conditional rendering proxy.
class PortalProxy extends Component {
    getChildContext() {
        return this.props.context;
    }
    render({ children }) {
        return children && children[0] || null;
    }
}
