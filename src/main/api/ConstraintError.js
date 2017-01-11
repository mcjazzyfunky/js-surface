export default class ConstraintError  {
	constructor(message, shortMessage, path) {
		this.__message = message;
		this.__shortMessage = shortMessage;
		this.__path = path;
	}

	get message() {
		return this.__message;
	}

	get shortMessage() {
		return this.__shortMessage;
	}

	get path() {
		return this.__path;
	}

	toString() {
		return 'ConstraintError: ' + this.message;
	}
}
