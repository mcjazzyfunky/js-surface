export default class ElementInspector {
    constructor(type, props) {
        this.__type = type;

        if (!props) {
            this.__props = null;
        } else {
            const children = props.children;

            if (children === undefined || children === null
                || children instanceof Array) {
                
                this.__props = props;
            } else {
                const newProps = Object.assign({}, props);
            
                newProps.children = [props.children];
                this.__props = newProps;
            }
        }
    }

    getType() {
        return this.__type;
    }

    getProps() {
        return this.__props;
    }

    getChildren() {
        return this.__props ? this.__props.children || null : null;
    }

    getChild(index = 0) {
        return this.__props && this.__props.children
            ? this.props.children[index] || null
            : null;
    }
}
