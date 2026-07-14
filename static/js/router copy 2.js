
async function renderLatestSidebar() {
  const sidebarContainer = document.getElementById('latest-sidebar');
  if (!sidebarContainer) return;

  const response = await fetch('posts/index.json');
  const posts = await response.json();

  // Sort by date and take the last 6
  const latest = posts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  sidebarContainer.innerHTML = latest.map(post => `
    <li><a href="#/${post.lang}/post/${post.slug}">${post.title}</a></li>
  `).join('');
}



// Map your hash paths to the local HTML file paths
const routes = {
  'home': 'pages/home.html',
  'it': 'pages/it-home.html',
  'en/latest': 'pages/latest.html',
  'it/latest': 'pages/latest-it.html',
  'en/post': 'pages/post.html',
  'it/post': 'pages/post.html',
  '404': 'pages/404.html'
};



//2
async function router() {
  const app = document.getElementById('app');
  app.classList.remove('active'); // Fade out

  setTimeout(async () => {
    const hash = location.hash.slice(2) || 'home';
    const parts = hash.split('/'); // e.g. ["en", "latest"] or ["it", "post", "slug"]

    const filePath = routes[hash] || (parts.length === 3 ? routes[`${parts}/post`] : 'pages/404.html');
    
    const response = await fetch(filePath);
    const html = await response.text();
    app.innerHTML = html;

    // Determine language context
    const currentLang = parts[0] === 'it' ? 'it' : 'en';

    // If we are on a "latest" page, trigger the sidebar
    if (hash.endsWith('latest')) {
      await renderLatestSidebar(currentLang);
    }

    app.classList.add('active'); // Fade in
  }, 400);
}







function render(html, postName) {
  const app = document.getElementById('app');
  app.innerHTML = html;
  if (postName) {
    const title = app.querySelector('#post-title');
    if (title) title.textContent = postName;
  }
}
window.addEventListener('hashchange', router);
window.addEventListener('load', router);