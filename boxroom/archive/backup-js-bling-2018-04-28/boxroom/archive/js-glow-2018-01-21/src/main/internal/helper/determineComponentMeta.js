import convertPropType from './convertPropType';
import Component from '../../api/Component';

export default function determineComponentMeta(subject, functional) {
    const
        typeOfSubject = typeof subject,
        subjectIsFunction = typeOfSubject === 'function',
        subjectIsObject = subject !== null && typeOfSubject === 'object';

    if (!subjectIsFunction && !subjectIsObject) {        
        throw new Error("First argument 'subject' must either be an "
            + "object or a function");
    }

    const
        ret = {},
        displayName = subject.displayName || 'Anonymous',
        properties = subject.properties,
        publicMethods = subject.publicMethods,
        provides = subject.provides,

        hasProperties = properties !== undefined && properties !== null,
        hasPublicMethods  = publicMethods !== undefined && publicMethods !== null,
        hasProvides = provides !== undefined && provides !== null;
        
    if (functional && (hasPublicMethods || hasProvides)) {
        throw new Error(
            "Meta information for 'publicMethods' and 'provides' "
            + 'is not allowed for functional components');
    }

    ret.displayName = displayName;

    if (hasProperties && properties !== null) {
        if (typeof properties !== 'object') {
            throw new Error("Meta field 'properties' must be an object");
        }

        ret.properties = properties;
    }

    if (hasPublicMethods && publicMethods !== null) {
        if (!Array.isArray(publicMethods)) {
            throw new Error("Meta field 'publicMethods' must be an array");
        }

        ret.methods = publicMethods;
    }

    if (hasProvides && provides !== null) {
        if (!Array.isArray(provides)) {
            throw new Error("Meta field 'provides' must be an array");
        }

        ret.provides = provides;
    }

    if (!functional) {
        if (subjectIsObject && typeof subject.onDidCatchError === 'function') {
            ret.isErrorBoundary = true;
        } else if (subject.prototype instanceof Component) {
            const onDidCatchError = subject.prototype.onDidCatchError;

            if (typeof onDidCatchError === 'function'
                && onDidCatchError !== Component.prototype.onDidCatchError) {
            
                ret.isErrorBoundary = true;
            }
        } else if (typeof subject.onDidCatchError === 'function') {
            ret.isErrorBoundary = true;
        }
    }

    return ret;
}
