import {
    createElement as h,
    defineClassComponent,
    defineFunctionalComponent,
    render
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

class Translator {
    constructor(translations) {
        this.__translations = translations;
        this.__lang = 'en';
    }

    setLang(lang) {
        this.__lang = lang;
    }

    getLang() {
        return this.__lang;
    }

    translate(key) {
        return this.__translations[this.__lang][key];
    }
}

const App = defineClassComponent({
    displayName: 'App',

    properties: {
        defaultLang: {
            type: String,
            constraint: Spec.oneOf('en', 'fr', 'de'),
            defaultValue: 'en'
        }
    },

    constructor() {
        this.__translator = new Translator(translations);
        this.__translator.setLang(this.props.defaultLang);
    },
    
    childInjections: {
        keys: ['translator'],

        provide() {
            return {
                translator: this.__translator
            };
        }
    },

    setLang(lang) {
        this.__translator.setLang(lang);
        this.forceUpdate();
    },

    render() {
        return (
            h('div',
                h('label[for=lang-selector]',
                    'Select language: '),
                h('select#lang-selector',
                    {   value: this.__translator.getLang(),
                        onChange: ev => this.setLang(ev.target.value)
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

        translator: {
            type: Translator,
            inject: true
        }
    },

    render(props) {
        return (
            h('div',
                props.translator.translate(props.name))
        );
    }
});

render(App(), 'main-content');
