export default class Injector {
	constructor() {
		this.__registry = new Map();
	}

	bind(type, qualification = null) {
		return {
			to: instance => {
				let subReg = this.__registry.get(type);

				if (!subReg) {
					subReg = new Map();
					this.__registry.set(type, subReg);
				}

				subReg.set(qualification, instance);
			}
		};
	}

	unbind(type, qualification = null) {
		const subReg = this.__registry.get(type);

		if (subReg) {
			subReg.delete(qualification);
		}
	}

	getInstance(type, qualification = null) {
		let ret;

		const subReg = this.__registry.get(type);

		if (subReg) {
			ret = subReg.get(qualification);
		}

		return ret;
	}
}
