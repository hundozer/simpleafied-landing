// Progressive enhancement only: the page reads fully without this script.
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  // Nav background after scrolling
  var nav = document.getElementById('nav');
  function onNav() { nav.classList.toggle('scrolled', window.scrollY > 24); }
  onNav();
  window.addEventListener('scroll', onNav, { passive: true });

  // Staggered stamps on the hero sheet
  var checks = document.querySelector('.checks');
  if (checks) {
    checks.querySelectorAll('.stamp').forEach(function (s, i) { s.style.setProperty('--n', i); });
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
    if (checks) checks.classList.add('on');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.querySelector('.checks')) checks.classList.add('on');
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Chain fills as it scrolls through the viewport
  var chain = document.getElementById('chain');
  if (chain) {
    var steps = chain.querySelectorAll('li');
    var ticking = false;
    function onChain() {
      ticking = false;
      var r = chain.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.35)));
      chain.style.setProperty('--p', p.toFixed(3));
      steps.forEach(function (li, i) { li.classList.toggle('lit', p >= i / (steps.length - 1) - 0.001); });
    }
    onChain();
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onChain); } }, { passive: true });
    window.addEventListener('resize', onChain);
  }

  if (reduce || !fine) return;

  // Hero stack tilts with the pointer
  var stage = document.getElementById('stage');
  var stack = stage && stage.querySelector('.stack');
  if (stack) {
    document.querySelector('.hero').addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      stack.style.setProperty('--ry', (-18 + x * 14).toFixed(2) + 'deg');
      stack.style.setProperty('--rx', (10 - y * 10).toFixed(2) + 'deg');
    });
  }

  // Cursor spotlight on product cards
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();
