export default determineDisplayName;

function determineDisplayName(classOrConfig) {
    const displayName =
        classOrConfig && typeof classOrConfig.displayName === 'string'
        ? classOrConfig.displayName
        : null;

    return displayName || 'Anonymous';
}