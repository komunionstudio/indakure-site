/*
 * IndaKure newsletter / "Get notified" signups.
 *
 * STEP 1 (one time): paste your Google Apps Script web-app URL between the quotes below.
 * It looks like: https://script.google.com/macros/s/AKfy.../exec
 * Until it is filled in, the forms show an error instead of silently losing signups.
 */
window.INDAKURE_SIGNUP_URL = '';

(function () {
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function kind(v) {
    if (EMAIL.test(v)) return 'email';
    var digits = v.replace(/[^\d]/g, '');
    if (/^[\d\s()+.-]+$/.test(v) && digits.length >= 10 && digits.length <= 15) return 'phone';
    return '';
  }
  window.IndaKureSignup = {
    valid: function (v) { return !!kind(String(v || '').trim()); },
    send: function (value, source) {
      var url = window.INDAKURE_SIGNUP_URL;
      value = String(value || '').trim();
      if (!url) {
        console.error('IndaKure signup: INDAKURE_SIGNUP_URL is not set in signup.js');
        return Promise.reject(new Error('signup endpoint not configured'));
      }
      var body = JSON.stringify({
        contact: value,
        type: kind(value),
        source: source || '',
        page: location.pathname + location.search
      });
      // text/plain + no-cors keeps this a "simple" request that Apps Script accepts from any site.
      return fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body, keepalive: true })
        .then(function () { return true; });
    }
  };
})();
