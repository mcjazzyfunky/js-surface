// TODO - not really working properly
export default function determineAllMethodNames(clazz) {
    const methodNameSet = new Set();
    let obj = clazz.prototype;

    do {
        const propertyNames = Object.getOwnPropertyNames(obj);

        for (const methodName of propertyNames) {
            if (typeof obj[methodName] === 'function' && methodName !== 'constructor') {
                methodNameSet.add(methodName);
            }
        }

        obj = Object.getPrototypeOf(obj);
    } while (obj != Object.prototype);

    return Array.from(methodNameSet);
}
