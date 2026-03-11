   // JAVASCRIPT LOGIC
    const PAGE_START = Date.now();
    const LTO1 = "cGFydHMvZHVuYW1pY19iZWFucy9QR1BSa2pGUkZvTFRSRVBOWFJPSG9GWWZnaw=="
    const LTO2 = "cGFydHMvZHVuYW1pY19iZWFucy9QR1BSbWpGUkZvZ2hqaGdHa3NkZ3NGZGZnU2w="

//     const routes = {
//   '#/': 'index.html',
//   '#/it': 'casa.html',
//   '#/test': 'pages/test.html',
//   '404': 'pages/404.html'
// };



// async function router() {
//   const root = document.getElementById('app');
//   const path = window.location.hash || '#/';
  
//   // Get the file path for the current route
//   const filePath = routes[path] || routes['404'];

//   try {
//     // 1. Fetch the HTML file
//     const response = await fetch(filePath);
    
//     if (!response.ok) throw new Error('Page not found');
    
//     // 2. Convert response to text
//     const html = await response.text();
    
//     // 3. Inject into the page
//     root.innerHTML = html;
//   } catch (error) {
//     console.error(error);
//     root.innerHTML = '<h1>Error</h1><p>Could not load the page.</p>';
//   }
// }


// window.addEventListener('hashchange', router);
// window.addEventListener('load', router);

// File Structure:
// (
// ├── index.html
// ├── it.html
// ├── app.js
// └── pages/
//     ├── test.html
//     └── 404.html
// )

// For local development I'm using: (python3 -m http.server 8080)







    // 1. Core Reveal Function
    async function revealContent(btn) {
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        // const ledto = btn.getAttribute('rq-section-name');


        // FIX: if the button points to a target that doesn't exist, stop here.
        if (!targetEl) {
            console.warn(`Target element #${targetId} not found.`);
            return; 
        }

        var ensource = "";

        if (targetId === "about") {  // Use === for strict equality; define ledto first
            ensource = LTO1;    // Define LTO1 first, e.g., const LTO1 = "/about";
        } else if (targetId === "contact") {  // Use === for strict equality; define ledto first
            ensource = LTO2;    // Define LTO1 first, e.g., const LTO1 = "/about";
        } 

        // Bot Checks
        const trap = btn.parentElement.querySelector('.required-field-if input');
        if (trap && trap.value !== "") return; // Honeypot fail
        if (Date.now() - PAGE_START < 1000) return; // Timing fail (1s)

        // ... inside revealContent ...
        if (targetEl.innerHTML.trim() === "") {
            targetEl.innerHTML = "Loading..."; // Optional: Quick placeholder
            try {
                const path = atob(ensource);
                const res = await fetch(path);
                const base64Content = await res.text();
                
                // Inject content
                targetEl.innerHTML = decodeURIComponent(escape(atob(base64Content.trim())));
                
                // NOW trigger the animation
                targetEl.classList.add('active');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => { // Double frame ensures display:block is rendered
                        targetEl.classList.add('visible');
                    });
                });
            } catch (e) {
                targetEl.innerHTML = "Error loading content.";
            }
        } else {
            // If already loaded, just toggle
            const isVisible = targetEl.classList.contains('visible');
            if (!isVisible) {
                targetEl.classList.add('active');
                setTimeout(() => targetEl.classList.add('visible'), 10);
            } else {
                targetEl.classList.remove('visible');
                setTimeout(() => targetEl.classList.remove('active'), 600);
            }
        }

    }

    // 2. Click Event Listener
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-target]');
        if (btn) revealContent(btn);
    });


    // async function loadComponent(containerId, filePath) {
    //   try {
    //     const response = await fetch(filePath);
    //     const html = await response.text();
    //     document.getElementById(containerId).innerHTML = html;
    //   } catch (error) {
    //     console.error('Error loading component:', error);
    //     document.getElementById(containerId).innerHTML = '<p>Error loading component</p>';
    //   }
    // }

//     async function loadComponent(containerId, filePath) {
//   const container = document.getElementById(containerId);
  
//   // If the ID doesn't exist on this specific page, just exit quietly
//   if (!container) return; 

//   try {
//     const response = await fetch(filePath);
//     if (!response.ok) throw new Error('Network response was not ok');
//     const html = await response.text();
//     container.innerHTML = html;
//   } catch (error) {
//     console.error(`Error loading ${filePath}:`, error);
//     container.innerHTML = '<p>Error loading component</p>';
//   }
// }


async function loadComponent(containerId, filePath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.style.opacity = "0"; // Start hidden
  container.style.transition = "opacity 0.5s ease";

  try {
    const response = await fetch(filePath);
    const html = await response.text();
    container.innerHTML = html;
    container.style.opacity = "1"; // Fade in once loaded
  } catch (error) {
    console.error('Error:', error);
  }
}




    // 3. Deep Linking Logic (Handling ?show=ID from other pages)
    window.addEventListener('DOMContentLoaded', () => {
        loadComponent('menu-container', 'parts/static_beans/menu.html');
        loadComponent('right-bar-container', 'parts/static_beans/sidebar-right.html');
        const urlParams = new URLSearchParams(window.location.search);
        const autoOpen = urlParams.get('show');
        if (autoOpen) {
            const btn = document.querySelector(`[data-target="${autoOpen}"]`);
            if (btn) setTimeout(() => btn.click(), 500);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });



  

        // Load components when page loads
        // window.addEventListener('DOMContentLoaded', () => {
        //     loadComponent('menu-container', 'menu.html');
        //     loadComponent('right-bar-container', 'right-bar.html');
        // });

//     window.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const autoOpen = urlParams.get('show');
//     if (autoOpen) {
//         const btn = document.querySelector(`[data-target="${autoOpen}"]`);
//         if (btn) {
            
//             window.addEventListener('load', () => {// Wait for styles + animations to settle
                
//                 const target = document.querySelector(`#${autoOpen}`);// Extra safety: check if target element exists
//                 if (target) {
//                     btn.click();
//                 }
//             }, { once: true });
//         }

//         window.history.replaceState({}, document.title, window.location.pathname);        // Clean URL immediately (doesn't affect layout)
//     }
// });




// Used to toggle the menu on small screens when clicking on the menu button
function myFunction() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}

// When the user clicks anywhere outside of the modal, close it
var modal = document.getElementById('noSlotsModal');
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

  document.addEventListener('click', function (event) {
  // Check if the clicked element is a menu link or a toggle button
  if (event.target.hasAttribute('data-loc')) {
    const targetId = event.target.getAttribute('data-loc');
    const targetEl = document.getElementById(targetId);

    if (targetEl) {
      // 1. Make it active (display: block)
      targetEl.classList.add('active');

      // 2. Trigger animation in next frame
      requestAnimationFrame(() => {
        targetEl.classList.add('visible');
      });

      // 3. Scroll to the element smoothly
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

console.log(PLNG);
