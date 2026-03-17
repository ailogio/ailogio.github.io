// Consent categories (add your trackers)
const categories = {
  // analytics: { id: 'analytics', label: 'Analytics', scripts: ['/js/ga.js', 'gtag'] },  // Block these until approved
  analytics: { id: 'analytics', label: 'Analytics', scripts: ['/static/js/ga.js'] },  // Block these until approved
  marketing: { id: 'marketing', label: 'Marketing', scripts: ['/static/js/ads.js'] }
};

function setCookie(name, value, days = 365) {
  document.cookie = `${name}=${JSON.stringify(value)}; max-age=${days*86400}; path=/; samesite=strict`;
}
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? JSON.parse(match[2]) : null;
}
function loadScripts(urls) {
  urls.forEach(url => {
    const script = document.createElement('script');
    script.src = url;
    document.head.appendChild(script);
  });
}

const consent = getCookie('cookie-consent') || {};
if (!consent.version || consent.version !== '1') {
  document.getElementById('cookie-banner').classList.remove('hidden');
}

document.getElementById('save').onclick = () => {
  const newConsent = { version: '1', ...consent };
  Object.keys(categories).forEach(cat => {
    newConsent[cat] = document.getElementById(categories[cat].id).checked;
    if (newConsent[cat]) loadScripts(categories[cat].scripts);
  });
  setCookie('cookie-consent', newConsent);
  document.getElementById('cookie-banner').classList.add('hidden');
  document.getElementById('cookie-settings').style.display = 'block';
};

document.getElementById('reject-all').onclick = () => {
  const rejectConsent = { version: '1' };
  Object.keys(categories).forEach(cat => rejectConsent[cat] = false);
  setCookie('cookie-consent', rejectConsent);
  document.getElementById('cookie-banner').classList.add('hidden');
  document.getElementById('cookie-settings').style.display = 'block';
};

// Load approved scripts
Object.keys(categories).forEach(cat => {
  if (consent[cat]) loadScripts(categories[cat].scripts);
});

// Settings toggle
document.getElementById('cookie-settings').onclick = (e) => {
  e.preventDefault();
  document.getElementById('cookie-banner').classList.toggle('hidden');
  // Re-populate toggles
  Object.keys(categories).forEach(cat => {
    document.getElementById(categories[cat].id).checked = consent[cat] || false;
  });
};

document.getElementById('cookie-settings2').onclick = (e) => {
  e.preventDefault();
  document.getElementById('cookie-banner').classList.toggle('hidden');
  // Re-populate toggles
  Object.keys(categories).forEach(cat => {
    document.getElementById(categories[cat].id).checked = consent[cat] || false;
  });
};