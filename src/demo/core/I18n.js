import { defineContext, defineComponent } from 'js-surface'
import { Html } from 'js-surface/dom-factories'
import { Spec } from 'js-spec'

const { div, label, option, select } = Html

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
}

const LocaleCtx = defineContext({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
})

const App = defineComponent({
  displayName: 'App',

  properties: {
    defaultLocale: {
      type: String,
      constraint: Spec.oneOf('en', 'fr', 'de'),
      defaultValue: 'en'
    }
  },

  main: {
    functional: false,
    
    init(getProps, getState, updateState) {
      updateState({ locale: getProps().defaultLocale })

      return { 
        render: () => {
          const locale = getState().locale

          return (
            LocaleCtx.Provider({ value: locale },
              div(
                label({ htmlFor: 'lang-selector' },
                  'Select language: '),
                select(
                  {
                    id: 'lang-selector',
                    value: locale,
                    onChange: ev => {
                      const newLocale = ev.target.value

                      updateState(() => ({ locale: newLocale }))
                    }
                  },
                  option({ value: 'en' }, 'en'),
                  option({ value: 'fr' }, 'fr'),
                  option({ value: 'de' }, 'de')),
                div(
                  LocaleText({ id: 'salutation'}))))
          )
        }
      }
    }
  }
})

const LocaleText = defineComponent({
  displayName: 'LocaleText',

  properties: {
    id: {
      type: String,
    }
  },

  main: {
    functional: true,

    render(props) {
      return (
        div(
          LocaleCtx.Consumer(locale =>
            translations[locale][props.id]))
      )
    }
  }
})

export default App()
