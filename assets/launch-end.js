// The LAUNCH price ($149) ends Nov 30, 2026 at 11:59 PM CT. Stripe expires the LAUNCH
// code at the same moment (promo_1UXLItFwYg1BuWIIqcsi9xTv, expires_at 1796104740), so from
// then on the page shows $199 and the buy links stop pre-filling the code.
// After the deadline, tools/launch_end_cleanup.py hard-codes the $199 version into the HTML.
(function () {
  var END = 1796104740000; // 2026-11-30 23:59:00 CST = 2026-12-01 05:59:00 UTC
  var done = false;
  function endLaunch() {
    done = true;
    document.querySelectorAll('[data-launch-price]').forEach(function (el) { el.textContent = el.textContent.replace('$149', '$199'); });
    document.querySelectorAll('[data-launch-only]').forEach(function (el) { el.hidden = true; });
    document.querySelectorAll('[data-after-launch]').forEach(function (el) { el.hidden = false; });
    document.querySelectorAll('a[href*="prefilled_promo_code=LAUNCH"]').forEach(function (a) {
      a.href = a.href.replace(/[?&]prefilled_promo_code=LAUNCH/, '');
    });
  }
  function check() { if (!done && Date.now() >= END) endLaunch(); }
  check();
  if (done) return;
  var left = END - Date.now();
  if (left < 2147483647) setTimeout(check, left);
  // Timers stand still while a Mac sleeps, so check again whenever the page comes back,
  // every 30 seconds, and just before a buy link opens.
  setInterval(check, 30000);
  document.addEventListener('visibilitychange', check);
  addEventListener('pageshow', check);
  addEventListener('focus', check);
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a[href*="prefilled_promo_code=LAUNCH"]')) check();
  }, true);
})();
