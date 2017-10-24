import validateInitResult from '../validation/validateInitResult';

export default class ComponentController {
    constructor(config, updateView, updateState) {
        const
            result = config.init(updateView, updateState),
            error = validateInitResult(result, config);

        if (error) {
            throw error;
        }

        this.__config = config;
        this.__setProps = result.setProps;
        this.__close = result.close || null;
        this.__applyMethod = result.applyMethod || null;
    }

    setProps(props) {
        this.__setProps(props);
    }

    applyMethod(methodName, args) {
        if (!this.__config.methods || !this.__config.methods.includes(methodName)) {
            throw new Error(
                `Tried to call unknown public method '${methodName}' `
                + `on component of type '${this.__config.displayName}'`);
        }

        return this.__applyMethod(methodName, args);
    }

    close() {
        if (this.__close) {
            this.__close();
        }
    }
}
