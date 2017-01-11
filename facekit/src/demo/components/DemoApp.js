import { defineComponent, defineIntend, createElement as htm, Types, isElement } from 'js-surface';

import { Seq } from 'js-prelude';

import InputsDemo from './InputsDemo.js';
import ButtonsDemo from './ButtonsDemo.js';

import Button from '../../main/js/components/Button.js';
import Tabs from '../../main/js/components/Tabs.js';
import Tab from '../../main/js/components/Tab.js';

// import PaginationBar from '../main/js/compo
export default defineComponent({
    name: 'DemoApp',

    render({ props }) {
        return (
        htm('div',
        	null,
            Tabs({ activeTab: 0 },
                Tab({ caption: 'Inputs', id: 'inputs' },
                    InputsDemo()),
                Tab({ caption: 'Buttons', id: 'buttons' },
                    void(ButtonsDemo()))))
        );
    }
});
