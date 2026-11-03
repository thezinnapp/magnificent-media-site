// Google Analytics 4 for magnificentmediaict.com, on every page. Magnificent Media's own GA account only:
// never The ZINN App's account, property or tag (owner rule 2026-11-03). Sends page views (automatic), plays of
// every <video> (video_start, video_progress at 10/25/50/75 %, video_complete) and the key clicks:
// buy (begin_checkout), free trial (trial_click), Mac download (file_download), email (generate_lead / email_click).
// Nothing at all for browsers that send Global Privacy Control or for devices set to a European time zone; for
// anyone Google places in the EU/EEA, UK or Switzerland anyway, no cookies (consent defaults). No advertising
// cookies anywhere; the _ga cookies last 14 months, matching GA's 14-month retention. These promises are written
// on /#privacy and /photo-studio/privacy/: change both pages before changing any of them. Visit any page with
// ?internal=1 once per browser to mark the owner's and the agents' own visits (GA's "Internal Traffic" filter drops
// them); ?internal=0 undoes it.
(function () {
  var ID = 'G-3078E7HX3R';   // GA4 property 562093547 "magnificentmediaict.com" (account 414517609, hello@)
  if (!/^G-[A-Z0-9]{6,}$/.test(ID)) return;
  if (navigator.globalPrivacyControl === true) return;
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (/^Europe\//.test(tz) || /^(Atlantic\/(Reykjavik|Canary|Madeira|Azores)|Asia\/(Nicosia|Famagusta)|Indian\/(Reunion|Mayotte)|America\/(Guadeloupe|Martinique|Cayenne|Marigot))$/.test(tz)) return;

  var internal = false;
  try {
    var flag = new URLSearchParams(location.search).get('internal');
    if (flag === '1') localStorage.setItem('mm_internal', '1');
    if (flag === '0') localStorage.removeItem('mm_internal');
    internal = localStorage.getItem('mm_internal') === '1';
  } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'granted' });
  gtag('consent', 'default', { analytics_storage: 'denied', region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'RE', 'GP', 'MQ', 'GF', 'YT', 'MF', 'AX'] });
  gtag('js', new Date());
  var config = { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 36720000 };   // 425 days
  if (internal) config.traffic_type = 'internal';
  if (/[?&]ga_debug=1\b/.test(location.search)) config.debug_mode = true;
  gtag('config', ID, config);
  var tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(tag);

  // Where on the page a link sits: data-ga-location, else header / footer / the section's id or first class.
  function where(el) {
    var tagged = el.closest('[data-ga-location]');
    if (tagged) return tagged.getAttribute('data-ga-location');
    if (el.closest('header')) return 'header';
    if (el.closest('footer')) return 'footer';
    var sec = el.closest('section');
    if (sec) return sec.id || (sec.className || '').split(/\s+/)[0] || 'section';
    return 'main';
  }
  function text(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100); }

  // Stripe Payment Links shown on the site: id → product. The price follows the link (LAUNCH code = $149).
  var PRODUCTS = { eVq9ATa4j1cLbHl94kgMw04: { id: 'photo-studio-lifetime', name: 'Photo Studio Lifetime License', price: function (href) { return /prefilled_promo_code=LAUNCH/.test(href) ? 149 : 199; } } };

  // Left clicks and keyboard activation arrive as 'click'; a middle click (open in a new tab) only as 'auxclick'.
  function track(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.href, loc = where(a);
    if (/^https:\/\/buy\.stripe\.com\//.test(href)) {
      var link = href.split('?')[0].split('/').pop(), p = PRODUCTS[link];
      var item = p ? { item_id: p.id, item_name: p.name, price: p.price(href), quantity: 1 } : { item_id: link, item_name: 'Stripe link ' + link, quantity: 1 };
      var ev = { currency: 'USD', items: [item], link_location: loc, link_text: text(a) };
      if (p) ev.value = item.price;
      if (/prefilled_promo_code=LAUNCH/.test(href)) ev.coupon = 'LAUNCH';
      gtag('event', 'begin_checkout', ev);
    } else if (/\.dmg$/i.test(a.pathname)) {
      gtag('event', 'file_download', { file_name: a.pathname.split('/').pop(), file_extension: 'dmg', link_url: a.pathname, link_text: text(a), link_location: loc });
    } else if (a.host === location.host && /^\/photo-studio\/download\/?$/.test(a.pathname)) {
      gtag('event', 'trial_click', { link_location: loc, link_text: text(a) });
    } else if (/^mailto:/i.test(href)) {
      var subject = '';
      try { subject = new URLSearchParams(href.split('?')[1] || '').get('subject') || ''; } catch (err) {}
      var lead = /sample|plan|founding|creator|starter|growth/i.test(subject);
      gtag('event', lead ? 'generate_lead' : 'email_click', { email_subject: subject.slice(0, 100), link_location: loc, link_text: text(a) });
    }
  }
  document.addEventListener('click', function (e) { if (e.button === 0) track(e); }, true);
  document.addEventListener('auxclick', function (e) { if (e.button === 1) track(e); }, true);

  // Plays of every <video>: video_start on the first play, video_progress at 10/25/50/75 %, video_complete at the end.
  function watch(v) {
    var marks = [10, 25, 50, 75], sent, started, dur = 0;
    function reset() { sent = {}; started = false; }
    function info(percent) {
      // pages rewind or reload a film when it ends, so the last known length stands in for a reset one
      var d = isFinite(v.duration) && v.duration > 0 ? v.duration : dur;
      return {
        video_provider: 'magnificentmediaict.com',
        video_title: v.getAttribute('data-ga-title') || v.getAttribute('aria-label') || 'video',
        video_url: (v.currentSrc || v.src || '').replace(location.origin, '').split('?')[0],
        video_duration: Math.round(d), video_current_time: Math.round(percent === 100 ? d : v.currentTime),
        video_percent: percent, visible: true
      };
    }
    reset();
    v.addEventListener('durationchange', function () { if (isFinite(v.duration) && v.duration > 0) dur = v.duration; });
    v.addEventListener('loadstart', reset);
    v.addEventListener('play', function () { if (!started) { started = true; gtag('event', 'video_start', info(0)); } });
    v.addEventListener('timeupdate', function () {
      if (!started || !v.duration || !isFinite(v.duration)) return;
      var pct = v.currentTime / v.duration * 100;
      marks.forEach(function (m) { if (pct >= m && !sent[m]) { sent[m] = true; gtag('event', 'video_progress', info(m)); } });
    });
    v.addEventListener('ended', function () { if (started) gtag('event', 'video_complete', info(100)); reset(); });
  }
  function init() { document.querySelectorAll('video').forEach(watch); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
