// The LAUNCH price ($149) ends Nov 30, 2026 at 11:59 PM CT. Stripe expires the LAUNCH
// code at the same moment (promo_1UXLItFwYg1BuWIIqcsi9xTv, expires_at 1796104740), so from
// then on the page shows $199 and the buy links stop pre-filling the code.
(function () {
  var END = 1796104740000; // 2026-11-30 23:59:00 CST = 2026-12-01 05:59:00 UTC
  function endLaunch() {
    document.querySelectorAll('[data-launch-price]').forEach(function (el) { el.textContent = el.textContent.replace('$149', '$199'); });
    document.querySelectorAll('[data-launch-only]').forEach(function (el) { el.hidden = true; });
    document.querySelectorAll('[data-after-launch]').forEach(function (el) { el.hidden = false; });
    document.querySelectorAll('a[href*="prefilled_promo_code=LAUNCH"]').forEach(function (a) {
      a.href = a.href.replace(/[?&]prefilled_promo_code=LAUNCH/, '');
    });
  }
  var left = END - Date.now();
  if (left <= 0) endLaunch();
  else if (left < 2147483647) setTimeout(endLaunch, left);
})();
