import {
    createElement as h,
    defineComponent,
    mount 
} from 'js-surface';

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

    provides: ['locale'],

    init(updateView) {
        let locale = null;

        const
            render = () => {
                return (
                    h('div', null,
                        h('label',
                            { htmlFor: 'lang-selector' },
                            'Select language: '),
                        h('select',
                            {
                                id: 'lang-selector',
                                value: locale,
                                onChange: ev => {
                                    locale = ev.target.value;
                                    updateView(render(), { locale });
                                }
                            },
                            h('option', { value: 'en' }, 'en'),
                            h('option', { value: 'fr' }, 'fr'),
                            h('option', { value: 'de' }, 'de')),
                        h('div', null, Text({ name: 'salutation'})))
                );
            };

        return {
            setProps(props) {
                if (!locale) {
                    locale = props.defaultLocale;
                }

                updateView(render(), { locale });
            }
        };
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
            h('div', null,
                translations[props.locale].salutation)
        );
    }
});

mount(App(), 'main-content');
