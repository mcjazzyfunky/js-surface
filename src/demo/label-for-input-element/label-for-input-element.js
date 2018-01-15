import {
    createElement as h,
    defineComponent,
    mount 
} from 'js-surface';

const Demo = defineComponent({
    displayName: 'Demo',

    render() {
        return (
            h('div',
                h('label',
                    { htmlFor: 'text-field' },
                    'Text field: '),
                h('input#text-field')));
    }
});

mount(Demo(), 'main-content');
