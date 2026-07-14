
// async function renderLatestSidebar() {
//   const sidebarContainer = document.getElementById('latest-sidebar');
//   if (!sidebarContainer) return;

//   const response = await fetch('posts/index.json');
//   const posts = await response.json();

//   // Sort by date and take the last 6
//   const latest = posts
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 6);

//   sidebarContainer.innerHTML = latest.map(post => `
//     <li><a href="#/${post.lang}/post/${post.slug}">${post.title}</a></li>
//   `).join('');
// }

async function renderLatestSidebar(lang) {
  const sidebarContainer = document.getElementById('latest-sidebar');
  if (!sidebarContainer) return;

  try {
    // const response = await fetch('posts/index.json');
    const response = await fetch('posts/side-bar.json');
    
    const allPosts = await response.json();

    // Filter by language and sort by newest date
    const filteredPosts = allPosts
      .filter(post => post.lang === lang)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    sidebarContainer.innerHTML = `
      <h3>${lang === 'it' ? 'Ultime Pubblicazioni' : 'Latest Posts'}</h3>
      <ul>
        ${filteredPosts.map(p => `
          <li>
            <img class="logo-pic" width="50px" height="50px" src="${p.preview}" alt="${p.preview_alt}">
            <a href="#/${p.lang}/post/${p.slug}">${p.title}</a>
            <p>${p.description}</p>
            <span>${p.date}</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (e) {
    console.error("Failed to load sidebar posts", e);
  }
}



async function loadPostPage(lang, slug) {
  const app = document.getElementById('app');

  try {
    // 1. Fetch Metadata and Template in parallel
    const [metaResponse, templateResponse] = await Promise.all([
      // fetch('posts/index.json'),
      // fetch('posts/side-bar.json'),
      // fetch('pages/post.html')
       fetch('./posts/side-bar.json'),
      fetch('./pages/post.html')
    ]);

    const allPosts = await metaResponse.json();
    const template = await templateResponse.text();
    
    // 2. Find the specific post info
    const postData = allPosts.find(p => p.slug === slug && p.lang === lang);
    
    if (!postData) {
      app.innerHTML = "<h1>Post not found</h1>";
      return;
    }

    // 3. Set the template shell
    app.innerHTML = template;

      await renderLatestSidebar(lang);

    // 4. Inject Metadata
    document.getElementById('post-title').textContent = postData.title;
    document.getElementById('post-date').textContent = postData.date;
    document.getElementById('post-lang').textContent = postData.lang.toUpperCase();
    document.getElementById('post-description').textContent = postData.description;

    // 5. Fetch the actual content file (e.g., posts/en/my-post.html)
    // const contentPath = `posts/${lang}/${slug}.html`; 

    // Change this:
    // const contentPath = `posts/${lang}/${slug}.html`; 

    // To this (to ensure it looks from the root):
    const contentPath = `./posts/${lang}/${slug}.html`; 


    const contentResponse = await fetch(contentPath);
    
    if (contentResponse.ok) {
      const contentHtml = await contentResponse.text();
      document.getElementById('post-content').innerHTML = contentHtml;
    } else {
      document.getElementById('post-content').innerHTML = "<p>Content file missing.</p>";
    }

  } catch (err) {
    console.error("Error loading post:", err);
    app.innerHTML = "<h1>Error loading post</h1>";
  }
}



// Map your hash paths to the local HTML file paths
const routes = {
  'home': 'pages/home.html',
  'it': 'pages/it-home.html',
  'en/latest': 'pages/latest.html',
  'it/latest': 'pages/latest-it.html',// Italian "Ultima"
  'en/post': 'pages/post.html',
  'it/post': 'pages/post.html',
  '404': 'pages/404.html'
};




async function router() {
  const app = document.getElementById('app');
  app.classList.remove('active'); // Fade out

  setTimeout(async () => {
    const hash = location.hash.slice(2) || 'home';
    const parts = hash.split('/'); // e.g. ["en", "latest"] or ["it", "post", "slug"]


    if (parts.length === 3 && parts[1] === 'post') {
      // const [lang, _, slug] = parts;
         const lang = parts[0]; // 'en'
        const slug = parts[2]; // 'my-post'
      await loadPostPage(lang, slug);
    } else {
      // Handle static pages (home, latest, etc.)
      // const filePath = routes[hash] || 'pages/404.html';
      const filePath = routes[hash] || routes['404'];
      // const html = await fetch(filePath).then(r => r.text());
      // app.innerHTML = html;
    


  //  const filePath = routes[hash] || routes['404'];
    
    // IMPORTANT: Check if filePath exists before fetching
    if (!filePath) {
      console.error("Route not found for hash:", hash);
      return;
    }

    const response = await fetch(filePath);
    const html = await response.text();
    // app.innerHTML = html;
    document.getElementById('app').innerHTML = html;
  }
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