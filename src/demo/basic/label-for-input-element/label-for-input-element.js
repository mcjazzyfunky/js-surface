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
                h('div',
                    h('label[htmlFor=first-name]',
                        'First name:'),
                    h('input#first-name'),
                h('div',
                    h('label',
                        { htmlFor: 'last-name' },
                        'Last name: '),
                    h('input#last-name'))))
        );
    }
});

mount(Demo(), 'main-content');
