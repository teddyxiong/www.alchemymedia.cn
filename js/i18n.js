/* =========================================================
   i18n — locale switching for the bilingual single page.
   Copy lives in the markup as [data-lang] pairs; this module
   only flips <html data-locale> and keeps metadata in sync.
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'alchemy.locale';
  var DEFAULT_LOCALE = 'en';
  var SUPPORTED = ['zh', 'en'];
  var root = document.documentElement;

  function readStored() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(value) !== -1 ? value : null;
    } catch (error) {
      return null;
    }
  }

  function store(locale) {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch (error) {
      /* storage unavailable — session-only switch */
    }
  }

  function getLocale() {
    var current = root.getAttribute('data-locale');
    return SUPPORTED.indexOf(current) !== -1 ? current : DEFAULT_LOCALE;
  }

  function syncButtons(locale) {
    var buttons = document.querySelectorAll('[data-set-locale]');
    Array.prototype.forEach.call(buttons, function (button) {
      var isActive = button.getAttribute('data-set-locale') === locale;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function syncMeta(locale) {
    var title = root.getAttribute('data-title-' + locale);
    if (title) document.title = title;

    var description = root.getAttribute('data-desc-' + locale);
    var metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }

  function syncImageAlts(locale) {
    var images = document.querySelectorAll('img[data-alt-zh][data-alt-en]');
    Array.prototype.forEach.call(images, function (image) {
      var alt = image.getAttribute('data-alt-' + locale);
      if (alt !== null) image.setAttribute('alt', alt);
    });
  }

  function apply(locale) {
    var next = SUPPORTED.indexOf(locale) !== -1 ? locale : DEFAULT_LOCALE;
    root.setAttribute('data-locale', next);
    root.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
    syncButtons(next);
    syncMeta(next);
    syncImageAlts(next);
    document.dispatchEvent(
      new CustomEvent('localechange', { detail: { locale: next } })
    );
  }

  function set(locale, persist) {
    apply(locale);
    if (persist !== false) store(locale);
  }

  apply(readStored() || DEFAULT_LOCALE);

  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-set-locale]');
    if (!trigger) return;
    set(trigger.getAttribute('data-set-locale'));
  });

  window.AlchemyI18n = { get: getLocale, set: set };
})();
