// MANTA Robotics: two small behaviours.
// 1) Snap the chalk line once when the hero is on screen.
// 2) Drawing view tabs in the robot section.
(function () {
  document.documentElement.classList.add('js');

  var hero = document.querySelector('.elevation');
  if (hero) {
    var img = hero.querySelector('img');
    var snap = function () { hero.classList.add('is-snapped'); };
    if (img && !img.complete) { img.addEventListener('load', snap, { once: true }); setTimeout(snap, 1200); }
    else { requestAnimationFrame(snap); }
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.viewer__tabs [role="tab"]'));
  var view = document.querySelector('#view img');
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    view.src = tab.dataset.src;
    view.alt = tab.dataset.alt;
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); select(n);
    });
  });
  // warm the cache for the other views
  tabs.forEach(function (t) { var p = new Image(); p.src = t.dataset.src; });
})();

// 3) Vision: steps drive the cost stack and the running tally.
(function () {
  var box = document.querySelector('.scrolly');
  if (!box || !('IntersectionObserver' in window)) return;
  var steps = box.querySelectorAll('.step');
  var num = box.querySelector('.tally [data-tally]');
  var share = box.querySelector('.tally [data-share]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = parseFloat(num.textContent), raf;

  function tween(to, toShare) {
    share.textContent = toShare;
    cancelAnimationFrame(raf);
    if (reduce) { cur = to; num.textContent = to.toFixed(1); return; }
    var from = cur, t0 = performance.now(), d = 600;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / d); k = 1 - Math.pow(1 - k, 3);
      cur = from + (to - from) * k;
      num.textContent = cur.toFixed(1);
      if (k < 1) raf = requestAnimationFrame(tick);
    })(t0);
  }

  function activate(el) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s === el); });
    if (box.dataset.step === el.dataset.step) return;
    box.dataset.step = el.dataset.step;
    tween(parseFloat(el.dataset.tally), el.dataset.share);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) activate(e.target); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  steps.forEach(function (s) { io.observe(s); });
  activate(steps[0]);
})();
