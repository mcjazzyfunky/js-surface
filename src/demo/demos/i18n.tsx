import { createElement, createElement as h, component, context, useState, useContext }
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

const LocaleCtx = context({
  displayName: 'LocaleCtx',
  defaultValue: 'en'
})

type AppProps = {
  defaultLocale: string
}

const App: any = component<AppProps>({ // TODO
  displayName: 'App',

  validate: Spec.checkProps({
    optional: {
      defaultLocale: Spec.oneOf('en', 'fr', 'de')
    }
  }),

  render({ defaultLocale = 'en' }) {
    const [locale, setLocale] = useState(() => defaultLocale)

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

const LocaleText: any = component<LocaleTextProps>({ // any
  displayName: 'LocaleText',

  validate: Spec.checkProps({
    optional: {
      id: Spec.string
    }
  }),

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
