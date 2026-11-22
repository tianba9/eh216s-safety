/* 页内目录高亮 */
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

})();
