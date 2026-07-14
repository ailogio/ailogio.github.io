const routes = {
  'home': () => `<h1>Benvenuti / Welcome</h1>`,
  'it': () => `<h1>Pagina Iniziale</h1>`,
  'en/latest': () => `<h1>Latest English Posts</h1>`,
  'it/latest': () => `<h1>Ultimi Post</h1>`,
  'en/post': (name) => `<h1>English Post: ${name}</h1>`,
  'it/post': (name) => `<h1>Post Italiano: ${name}</h1>`,
  '404': () => `<h1>404 - Not Found</h1>`
};

function router() {
  const hash = location.hash.slice(2) || 'home'; // Remove '#/'
  const parts = hash.split('/');
  
  // Logic for dynamic posts (e.g., 'en/post/my-travel')
  if (parts.length === 3 && parts[1] === 'post') {
    const lang = parts[0]; // 'en' or 'it'
    const slug = parts[2];
    const routeKey = `${lang}/post`;
    
    render(routes[routeKey] ? routes[routeKey](slug) : routes['404']());
    return;
  }

  // Logic for static routes
  const view = routes[hash] || routes['404'];
  render(view());
}

function render(html) {
  document.getElementById('app').innerHTML = html;
}

// Listen for hash changes and page loads
window.addEventListener('hashchange', router);
window.addEventListener('load', router);


