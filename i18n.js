// Shared i18n helpers
(function() {
  function currentLanguage() {
    // Priorité : localStorage puis lang du document puis 'en'
    try {
      return localStorage.getItem('language') || document.documentElement.lang || 'en';
    } catch (e) {
      return document.documentElement.lang || 'en';
    }
  }

  function t(objOrStr) {
    if (objOrStr && typeof objOrStr === 'object') {
      const lang = currentLanguage();
      return objOrStr[lang] || objOrStr.en || objOrStr.fr || '';
    }
    return objOrStr || '';
  }

  function tr(key) {
    if (!key) return '';
    const translations = window.translations || {};
    const lang = currentLanguage();
    const value = (translations[lang] && translations[lang][key]) || '';
    return value;
  }

  window.i18n = { currentLanguage, t, tr };
})();
