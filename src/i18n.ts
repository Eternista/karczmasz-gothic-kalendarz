import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Inicjalizacja i18next
i18n
  .use(HttpBackend) // Pozwala na ładowanie plików tłumaczeń z zewnętrznych plików
  .use(LanguageDetector) // Automatyczne wykrywanie języka
  .use(initReactI18next) // Integracja z React
  .init({
    fallbackLng: "en", // Domyślny język
    debug: true,
    interpolation: {
      escapeValue: false, // React sam dba o zabezpieczenia przed XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Ścieżka do plików tłumaczeń
    },
  });

export default i18n;
