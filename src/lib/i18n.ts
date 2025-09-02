import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// Import translation files
import en from "../locales/en.json"
import tr from "../locales/tr.json"
import ar from "../locales/ar.json"
import ru from "../locales/ru.json"

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  ar: { translation: ar },
  ru: { translation: ru },
}

i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
