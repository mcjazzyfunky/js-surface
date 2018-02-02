import adaptHtmlBuilders from '../../adaption/adaptHtmlBuilders';
import adaptSvgBuilders from '../../adaption/adaptSvgBuilders';
import Component from '../../component/Component';

import { createElement } from 'js-surface';

const
    Fragment = 'x-fragment', // TODO
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

