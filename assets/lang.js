/* 兼容旧链接：?lang=en / ?lang=zh 仅做版本跳转，不再改写同页文字 */
(function () {
  'use strict';

  try { localStorage.removeItem('fv-lang'); } catch (e) {}

  var m = location.search.match(/[?&]lang=(en|zh)(?:&|$)/i);
  if (!m) return;

  var lang = m[1].toLowerCase();
  var inEn = /(?:^|\/)en\/[^/]*$/.test(location.pathname);
  var file = location.pathname.split('/').pop() || 'index.html';
  var target = null;

  if (lang === 'en' && !inEn) target = 'en/' + file;
  if (lang === 'zh' && inEn) target = '../' + file;

  if (target) {
    if (location.hash) target += location.hash;
    location.replace(target);
  }
})();
