/* 目录高亮 + 首屏数字计数：仅用原生 API，file:// 与 Pages 均可用 */
(function () {
  /* ---------- 1 目录高亮 ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
  if (links.length) {
    var map = {};
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute('href').slice(1));
      if (el) map[el.id] = a;
    });
    var targets = Object.keys(map).map(function (id) { return document.getElementById(id); });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            links.forEach(function (a) { a.classList.remove('active'); });
            var a = map[e.target.id];
            if (a) a.classList.add('active');
          }
        });
      }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });
      targets.forEach(function (t) { io.observe(t); });
    }
  }

  /* ---------- 2 首屏 KPI 数字计数 ---------- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var nodes = document.querySelectorAll('.kpis .kpi .v');
  if (!nodes.length) return;

  function run(el) {
    var first = el.firstChild;
    if (!first || first.nodeType !== 3) return;
    var m = first.nodeValue.match(/^\s*(\d+(?:\.\d+)?)/);
    if (!m) return;

    var from = m.group(1);
    var target = parseFloat(from);
    var decimals = (from.split('.')[1] || '').length;
    var suffix = first.nodeValue.slice(m[0].length);
    var dur = 620, t0 = null;

    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      first.nodeValue = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else first.nodeValue = from + suffix;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var done = [];
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && done.indexOf(e.target) === -1) {
          done.push(e.target);
          run(e.target);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(nodes, function (n) { io2.observe(n); });
  } else {
    Array.prototype.forEach.call(nodes, run);
  }
})();
