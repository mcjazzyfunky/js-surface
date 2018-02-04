import adaptHtmlBuilders from '../../adaption/adaptHtmlBuilders';
import adaptSvgBuilders from '../../adaption/adaptSvgBuilders';

import adaptCreateReactElement
    from '../../adaption/specific/adaptCreateReactElement';

import React from 'react';

const
    createElement = adaptCreateReactElement({}),
    Component = React.Component,
    Fragment = React.Fragment,
    fragment = createElement.bind(null, React.Fragment),
    Html = adaptHtmlBuilders({ createElement }),
    Svg = adaptSvgBuilders({ createElement });

fragment.type = Fragment;

export {
    fragment,
    Component,
    Fragment,
    Html,
    Svg
};

export default {
    fragment,
    Component,
    Fragment,
    Html,
    Svg
};
