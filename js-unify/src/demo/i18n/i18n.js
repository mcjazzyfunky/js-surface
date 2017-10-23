import {
    createElement as h,
    mount 
} from 'js-surface';

import {
    defineClassComponent,
    defineFunctionalComponent,
} from 'js-unify';

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

const App = defineClassComponent({
    displayName: 'App',

    properties: {
        defaultLocale: {
            type: String,
            constraint: Spec.oneOf('en', 'fr', 'de'),
            defaultValue: 'en'
        }
    },

    provides: ['locale'],

    constructor(props) {
        this.setLocale(props.defaultLocale);
    },

    provide() {
        return {
            locale: this.state.locale
        };
    },

    setLocale(locale) {
        this.state = { locale };
    },

    render() {
        return (
            h('div',
                h('label[for=lang-selector]',
                    'Select language: '),
                h('select#lang-selector',
                    {   value: this.props.locale,
                        onChange: ev => this.setLocale(ev.target.value)
                    },
                    h('option[value=en]', 'en'),
                    h('option[value=fr]', 'fr'),
                    h('option[value=de]', 'de')),
                h('div', Text({ name: 'salutation'})))
        );
    }
});

const Text = defineFunctionalComponent({
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
            h('div',
                translations[props.locale].salutation)
        );
    }
});

mount(App(), 'main-content');
