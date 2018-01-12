const
    SUPPORTED_RENDER_ENGINES = new Set([
        'react', 'react-native', 'preact', 'inferno', 'vue'
    ]),

    FORBIDDEN_METHOD_NAMES = new Set([
        'props', 'state', 'shouldComponentUpdate',
        'setState', 'componentWillReceiveProps',
        'componentWillMount', 'componentDidMount',
        'componentWillUpdate', 'componentDidUpdate',
        'constructor', 'forceUpdate']),

    REGEX_ADAPTER_NAME = /^[a-z][a-z]*(-[a-z][a-z]*)*$/,
    REGEX_DISPLAY_NAME = /^[A-Z][a-zA-Z0-9_\.]*$/,
    REGEX_PROPERTY_NAME = /^[a-z][a-zA-Z0-9_-]*$/,
    REGEX_CALLBACK_PROPERTY_NAME = /^on(-|[A-Z])[a-zA-Z0-9_-]+$/,
    REGEX_METHOD_NAME = /^[a-z][a-zA-Z0-9_-]*$/;

export {
    FORBIDDEN_METHOD_NAMES,
    REGEX_ADAPTER_NAME,
    REGEX_DISPLAY_NAME,
    REGEX_PROPERTY_NAME,
    REGEX_CALLBACK_PROPERTY_NAME,
    REGEX_METHOD_NAME,
    SUPPORTED_RENDER_ENGINES
};
