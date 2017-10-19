import validateInitResult from '../validation/validateInitResult';

export default class ComponentController {
    constructor(config, setView, setState, setProvisions) {
        const
            result = config.init(setView, setState, setProvisions),
            error = validateInitResult(result, config);

        if (error) {
            throw error;
        }

        this.__config = config;
        this.__setProps = result.setProps;
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
}
