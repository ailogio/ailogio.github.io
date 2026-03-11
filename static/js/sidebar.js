export async function renderLatestSidebar() {
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
