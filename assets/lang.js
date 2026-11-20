/* 中英文切换：基于 data-en / data-zh 的纯文本替换，不触碰 DOM 结构 */
(function () {
  var KEY = 'fv-lang';

  function apply(lang) {
    var list = document.querySelectorAll('[data-en]');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (!el.hasAttribute('data-zh')) {
        el.setAttribute('data-zh', el.textContent);
      }
      el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-zh');
    }
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');

    var btn = document.querySelector('.lang');
    if (btn) {
      btn.textContent = lang === 'en' ? '中' : 'EN';
      btn.setAttribute('title', lang === 'en' ? '切换为中文' : 'Switch to English');
      btn.setAttribute('aria-label', lang === 'en' ? '切换为中文' : 'Switch to English');
    }
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function initial() {
    var m = location.search.match(/[?&]lang=(en|zh)/);
    if (m) return m[1];
    try { return localStorage.getItem(KEY) || 'zh'; } catch (e) { return 'zh'; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (initial() === 'en') apply('en');

    var btn = document.querySelector('.lang');
    if (btn) {
      btn.addEventListener('click', function () {
        apply(document.documentElement.lang === 'en' ? 'zh' : 'en');
      });
    }
  });
})();
