// Photo Studio is a Mac app. On phones, tablets, Windows and Linux the .dmg download is hidden and visitors get
// a one-tap way to send the download page to themselves for later on their Mac (share sheet, copy link, or email).
// Download counts in GA (file_download) therefore come from Macs only. Elements:
//   [data-mac-only]  shown only on a Mac (the .dmg buttons)
//   [data-send-mac]  an empty box that becomes the "Send it to my Mac" panel everywhere except on a Mac
(function () {
  var ua = navigator.userAgent || '';
  var touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1; // iPadOS asks for the desktop site
  var isMac = /Macintosh|Mac OS X/.test(ua) && !/iPhone|iPad|iPod/.test(ua) && !touchMac;
  var force = /[?&]device=(mac|phone)/.exec(location.search); // preview/testing: ?device=phone or ?device=mac
  if (force) isMac = force[1] === 'mac';
  document.documentElement.classList.toggle('is-mac', isMac);
  if (isMac) return;

  var LINK = 'https://magnificentmediaict.com/photo-studio/download/?utm_source=send_to_mac&utm_medium=self_share';
  var css = document.createElement('style');
  css.textContent =
    '[data-mac-only]{display:none!important}' +
    '.send-mac{margin:26px auto 0;max-width:560px;padding:22px 22px 18px;border:1px solid rgba(201,169,110,.45);' +
    'background:linear-gradient(180deg,rgba(201,169,110,.08),rgba(201,169,110,.02));text-align:center}' +
    '.send-mac .t{font-family:var(--serif);font-size:24px;color:var(--ivory);margin:0 0 6px}' +
    '.send-mac .s{font-size:14px;color:var(--ivory-dim);margin:0 0 16px;line-height:1.55}' +
    '.send-mac .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.send-mac .row .btn{min-width:150px}' +
    '.send-mac .ok{font-size:13px;color:var(--gold-hi);min-height:18px;margin:12px 0 0}';
  document.head.appendChild(css);

  function track(method) {
    if (typeof gtag === 'function') gtag('event', 'send_to_mac', { method: method, link_location: location.pathname });
  }
  function build(box) {
    box.classList.add('send-mac');
    box.hidden = false;
    // where the box asks to come first (the download page), it goes above the buttons
    if (box.hasAttribute('data-first')) { var cta = box.parentNode.querySelector('.cta'); if (cta) cta.parentNode.insertBefore(box, cta); }
    var canShare = !!navigator.share;
    box.innerHTML =
      '<p class="t">Photo Studio is <em>for Mac.</em></p>' +
      '<p class="s">On your phone? Send yourself the download link and open it on your Mac. The 7-day free trial starts when you install it.</p>' +
      '<div class="row">' +
      (canShare ? '<button class="btn btn-gold" type="button" data-act="share">Send it to my Mac <span class="arrow"></span></button>' : '') +
      '<a class="btn ' + (canShare ? 'btn-glass' : 'btn-gold') + '" data-act="email" href="mailto:?subject=' +
      encodeURIComponent('Photo Studio for Mac: download link') + '&body=' +
      encodeURIComponent('Open this on your Mac to download the free 7-day trial:\n' + LINK) + '">Email me the link</a>' +
      '<button class="btn btn-glass" type="button" data-act="copy">Copy link</button>' +
      '</div><p class="ok" aria-live="polite"></p>';
    var ok = box.querySelector('.ok');
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var act = b.getAttribute('data-act');
      track(act);
      if (act === 'share') {
        e.preventDefault();
        navigator.share({ title: 'Photo Studio for Mac', text: 'Download the free 7-day trial on my Mac', url: LINK }).catch(function () {});
      } else if (act === 'copy') {
        e.preventDefault();
        var done = function () { ok.textContent = 'Link copied. Paste it into a note or message to yourself.'; };
        if (navigator.clipboard) navigator.clipboard.writeText(LINK).then(done, function () { ok.textContent = LINK; });
        else ok.textContent = LINK;
      }
    });
  }
  function init() { document.querySelectorAll('[data-send-mac]').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
