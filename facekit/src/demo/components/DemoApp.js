import { defineComponent, createElement as dom, isElement } from 'js-surface';

import InputsDemo from './InputsDemo.js';
import ButtonsDemo from './ButtonsDemo.js';

import Tabs from '../../main/js/components/Tabs.js';
import Tab from '../../main/js/components/Tab.js';

// import PaginationBar from '../main/js/compo
export default defineFunctionalComponent({
    displayName: 'DemoApp',

    render() {
        return (
            dom('div',
                Tabs({ activeTab: 0 },
 //                   Tab({ caption: 'Inputs', id: 'inputs' },
 //                       InputsDemo()),
                    Tab({ caption: 'Buttons', id: 'buttons' },
                        void(ButtonsDemo()))))
        );
    }
});
