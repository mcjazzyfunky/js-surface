export default function buildInitFunction(componentClass, meta) {
    class CustomComponent extends componentClass {
        constructor(props) {
            super(props);
        }
    }

    CustomComponent.prototype.___meta = meta;

    return (updateView, forwardState) => {
        let component = null;

        const
            setProps = props => {
                if (!component) {
                    component = new CustomComponent(props);
                    component.___init(updateView, forwardState);
                    component.onWillMount();
                } else {
                    if (component.shouldUpdate(props, component.state)) {
                        component.onWillUpdate();
                    }
                }

                updateView(
                    component.render(),
                    meta.provides ? component.provide() : null,
                    component.___callbackWhenUpdated);
            },

            close = () => {
                if (component) {
                    component.onWillUnmount();
                    component = null;
                }
            };


        const ret = { setProps, close };

        if (meta.methods) {
            ret.applyMethod = (methodName, args) => {
                return component
                    ? component[methodName](...args)
                    : undefined; 
            };
        }

        if (meta.isErrorBoundary) {
            ret.handleError = (error, info) => {
                if (component) {
                    component.onDidCatchError(error, info);
                }
            }
        }

        return ret;
    };
}
