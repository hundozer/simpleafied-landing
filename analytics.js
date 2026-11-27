// Google Analytics 4, loaded only after the visitor accepts analytics cookies.
// Nothing is sent to Google before consent. The choice is remembered in localStorage
// and can be changed from "Cookie settings" in the footer.
(function () {
  var GA_ID = 'G-JW7HQ15C7Q';
  var KEY = 'sf-analytics-consent'; // 'granted' | 'denied'
  var loaded = false;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function load() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearGaCookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^_ga/.test(name)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + location.hostname, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var banner = document.getElementById('consent');
  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  function choose(v) {
    var before = read();
    save(v);
    hide();
    if (v === 'granted') load();
    else {
      clearGaCookies();
      if (loaded || before === 'granted') location.reload(); // stop a running tag
    }
  }

  if (banner) {
    banner.querySelector('[data-consent="granted"]').addEventListener('click', function () { choose('granted'); });
    banner.querySelector('[data-consent="denied"]').addEventListener('click', function () { choose('denied'); });
  }
  document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(); });
  });

  var c = read();
  if (c === 'granted') load();
  else if (c !== 'denied') show();

  // For other scripts: record an event only if analytics is running.
  window.sfTrack = function (name, params) { if (loaded && window.gtag) window.gtag('event', name, params || {}); };
})();
