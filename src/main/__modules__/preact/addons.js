import adaptHtmlBuilders from '../../adaption/adaptHtmlBuilders';
import adaptSvgBuilders from '../../adaption/adaptSvgBuilders';

import adaptCreatePreactElement
    from '../../adaption/specific/adaptCreatePreactElement';

//import Preact from 'preact';

const
    createElement = adaptCreatePreactElement({}),
    //Component = Preact.Component,
    Fragment = 'x-fragment', // TODO
    fragment = createElement.bind(null, Fragment),
    Html = adaptHtmlBuilders({ createElement }),
    Svg = adaptSvgBuilders({ createElement });

fragment.type = Fragment;

export {
    fragment,
    //Component,
    Fragment,
    Html,
    Svg
};

export default {
    fragment,
    //Component,
    Fragment,
    Html,
    Svg
};
