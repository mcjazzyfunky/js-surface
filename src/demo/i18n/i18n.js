import {
    createElement as h,
    defineComponent,
    mount
} from 'js-surface';

import { Component } from 'js-surface/addons';

import { Spec } from 'js-spec';

const translations = {
    en: {
        salutation: 'Hello, ladies and gentlemen'
    },
    de: {
        salutation: 'Hallo, meine Damen und Herren'
    },
    fr: {
        salutation: 'Salut, Mesdames, Messieurs'
    }
};

const App = defineComponent({
    displayName: 'App',

    properties: {
        defaultLocale: {
            type: String,
            constraint: Spec.oneOf('en', 'fr', 'de'),
            defaultValue: 'en'
        }
    },

    childContextKeys: ['locale'],

    main: class extends Component {
        constructor(props) {
            super(props);
            this.state = { locale: props.defaultLocale };
        }

        getChildContext() {
            return {
                locale: this.state.locale
            };
        }

        setLocale(locale) {
            this.setState({ locale });
        }

        render() {
            return (
                h('div', null,
                    h('label', { htmlFor: 'lang-selector' },
                        'Select language'),
                    h('select',
                        { 
                            id: 'lang-selector',
                            value: '{this.props.locale}',
                            onChange: ev => this.setLocale(ev.target.value)
                        },
                        h('option', { value: 'en' }, 'en'),
                        h('option', { value: 'fr' }, 'fr'),
                        h('option', { value: 'de' }, 'de')),
                    h('div', null, 
                        Text({ name: 'salutation' })))
            );
        }
    }
});

const Text = defineComponent({
    displayName: 'Text',

    properties: {
        name: {
            type: String,
        },

        locale: {
            type: String, 
            inject: true,
            defaultValue: 'en'
        }
    },

    render(props) {
        return (
            h('div', null, translations[props.locale].salutation)
        );
    }
});

mount(App(), 'main-content');
