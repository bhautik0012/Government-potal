import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Government Help Portal",
      schemes: "Government Schemes",
      documents: "Required Documents"
    }
  },
  hi: {
    translation: {
      welcome: "सरकारी सहायता पोर्टल में आपका स्वागत है",
      schemes: "सरकारी योजनाएं",
      documents: "आवश्यक दस्तावेज"
    }
  },
  gu: {
    translation: {
      welcome: "સરકારી સહાય પોર્ટલમાં આપનું સ્વાગત છે",
      schemes: "સરકારી યોજનાઓ",
      documents: "જરૂરી દસ્તાવેજો"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;