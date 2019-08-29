import { createElement, createElement as h, defineComponent, defineContext, useState, useContext }
  from '../../modules/core/main/index'

  import { Spec } from 'js-spec'

const translations: Record<string, Record<string, string>> = {
  en: {
    salutation: 'Hello, ladies and gentlemen!'
  },
  de: {
    salutation: 'Hallo, meine Damen und Herren!'
  },
  fr: {
    salutation: 'Salut, Mesdames, Messieurs!'
  }
}

const LocaleCtx = defineContext({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
})

type AppProps = {
  defaultLocale: string
}

const App = defineComponent<AppProps>({
  displayName: 'App',

  properties: {
    defaultLocale: {
      type: String,
      validate: Spec.oneOf('en', 'fr', 'de'),
      defaultValue: 'en'
    }
  },

  render(props) {
    const [locale, setLocale] = useState(() => props.defaultLocale)

    return (
      <LocaleCtx.Provider value={locale}>
        <div>
          <label htmlFor="lang-selector">Select language: </label>
          <select id="lang-selector" value={locale} onChange={(ev: any) => setLocale(ev.target.value)}>
            <option value="en">en</option>
            <option value="fr">fr</option>
            <option value="de">de</option>
          </select>
          <LocaleText id="salutation"/>
        </div>
      </LocaleCtx.Provider>
    )
  }
})

interface LocaleTextProps {
  id: string
}

const LocaleText = defineComponent<LocaleTextProps>({
  displayName: 'LocaleText',

  properties: {
    id: {
      type: String,
    }
  },

  render(props) {
    const locale = useContext(LocaleCtx)

    return (
      <p>
        { translations[locale][props.id] }
      </p>
    )
  }
})

export default <App defaultLocale="en"/>
