import adaptHtmlBuilders from '../../adaption/adaptHtmlBuilders';
import adaptSvgBuilders from '../../adaption/adaptSvgBuilders';

import { createElement, defineComponent } from 'js-surface/preact'; 
import Preact from 'preact';

const
    Component = Preact.Component,
    Fragment = defineComponent._jsxFrag,
    fragment = createElement.bind(null, Fragment),
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