(function () {
  'use strict';

  var endpoint = 'https://brodiemangan.goatcounter.com/count';
  var scriptSrc = 'https://gc.zgo.at/count.js';
  var queue = [];

  function eventPath(name) {
    var slug = String(name || 'custom')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return 'event/' + (slug || 'custom');
  }

  function send(payload) {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count(payload);
      return true;
    }
    return false;
  }

  function flush() {
    var pending = queue;
    queue = [];

    pending.forEach(function (payload) {
      if (!send(payload)) {
        queue.push(payload);
      }
    });
  }

  window.siteAnalytics = window.siteAnalytics || {};
  window.siteAnalytics.track = function (name) {
    var payload = {
      path: eventPath(name),
      title: String(name || 'Custom event'),
      event: true
    };

    if (!send(payload)) {
      queue.push(payload);
    }
  };

  window.goatcounter = window.goatcounter || {};

  if (!document.querySelector('script[data-site-analytics="goatcounter"]') &&
    !document.querySelector('script[src*="gc.zgo.at/count.js"]')) {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptSrc;
    script.setAttribute('data-goatcounter', endpoint);
    script.setAttribute('data-site-analytics', 'goatcounter');
    script.addEventListener('load', flush);
    document.head.appendChild(script);
  }

  window.setTimeout(flush, 1000);
})();
