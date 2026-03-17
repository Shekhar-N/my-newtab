/* =============================================
   CLOCK
   ============================================= */
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  document.getElementById('clockTime').textContent = `${hours}:${minutes}`;
  document.getElementById('clockAmpm').textContent = ampm;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('clockDate').textContent =
    `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

updateClock();
setInterval(updateClock, 1000);

/* =============================================
   GREETING
   ============================================= */
function setGreeting() {
  const h = new Date().getHours();
  let msg = 'Good evening';
  if (h < 12) msg = 'Good morning';
  else if (h < 17) msg = 'Good afternoon';
  document.getElementById('greeting').textContent = msg;
}
setGreeting();

/* =============================================
   GEOLOCATION → CITY NAME
   ============================================= */
function detectLocation() {
  if (!navigator.geolocation) {
    document.getElementById('locationText').textContent = 'Location unavailable';
    return;
  }
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude, longitude } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await res.json();
      const city = data.address.city || data.address.town || data.address.village || '';
      const state = data.address.state_code || data.address.state || '';
      document.getElementById('locationText').textContent =
        city ? `${city}${state ? ', ' + state : ''}` : 'Your location';
    } catch {
      document.getElementById('locationText').textContent = 'Your location';
    }
  }, () => {
    document.getElementById('locationText').textContent = 'Location unavailable';
  });
}
detectLocation();

/* =============================================
   MOST VISITED SITES
   ============================================= */
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch { return null; }
}

function getInitial(title, url) {
  if (title) return title.charAt(0).toUpperCase();
  try { return new URL(url).hostname.charAt(0).toUpperCase(); } catch { return '?'; }
}

function renderTopSites(sites) {
  const grid = document.getElementById('sitesGrid');
  grid.innerHTML = '';
  const shown = sites.slice(0, 8);
  shown.forEach((site, i) => {
    const a = document.createElement('a');
    a.className = 'site-tile';
    a.href = site.url;
    a.title = site.title || site.url;
    a.style.setProperty('--i', i);

    const faviconWrap = document.createElement('div');
    faviconWrap.className = 'site-favicon-wrap';

    const faviconUrl = getFaviconUrl(site.url);
    if (faviconUrl) {
      const img = document.createElement('img');
      img.className = 'site-favicon';
      img.src = faviconUrl;
      img.alt = site.title;
      img.onerror = () => {
        img.style.display = 'none';
        const fb = document.createElement('span');
        fb.className = 'site-favicon-fallback';
        fb.textContent = getInitial(site.title, site.url);
        faviconWrap.appendChild(fb);
      };
      faviconWrap.appendChild(img);
    } else {
      const fb = document.createElement('span');
      fb.className = 'site-favicon-fallback';
      fb.textContent = getInitial(site.title, site.url);
      faviconWrap.appendChild(fb);
    }

    const name = document.createElement('span');
    name.className = 'site-name';
    let displayName = site.title || site.url;
    try {
      if (!site.title) displayName = new URL(site.url).hostname.replace('www.', '');
    } catch {}
    name.textContent = displayName;

    a.appendChild(faviconWrap);
    a.appendChild(name);
    grid.appendChild(a);
  });
}

// Fallback sites (used when no Chrome API or empty)
const FALLBACK_SITES = [
  { title: 'Gmail', url: 'https://mail.google.com' },
  { title: 'Upgrad', url: 'https://www.upgrad.com/lxp/learner' },
  { title: 'Crunchyroll', url: 'https://www.crunchyroll.com' },
  { title: 'YouTube', url: 'https://youtube.com' },
  { title: 'GitHub', url: 'https://github.com/Shekhar-N' },
  { title: 'ChatGPT', url: 'https://chat.openai.com' },
  { title: 'Gemini', url: 'https://gemini.google.com' },
  { title: 'Claude', url: 'https://claude.ai' },
];

if (typeof chrome !== 'undefined' && chrome.topSites) {
  // Removed auto-fetch of most visited sites; always use static fallback sites
  renderTopSites(FALLBACK_SITES);
} else {
  renderTopSites(FALLBACK_SITES);
}

/* =============================================
   BOOKMARKS
   ============================================= */
const bookmarksToggle = document.getElementById('bookmarksToggle');
const bookmarksBody   = document.getElementById('bookmarksBody');
const bookmarksChevron = document.getElementById('bookmarksChevron');
const bookmarksTree   = document.getElementById('bookmarksTree');

bookmarksToggle.addEventListener('click', () => {
  const open = bookmarksBody.classList.toggle('open');
  bookmarksChevron.classList.toggle('open', open);
});

function createFolderNode(node) {
  const wrapper = document.createElement('div');

  const folderRow = document.createElement('div');
  folderRow.className = 'bm-folder';

  // Folder icon
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.classList.add('bm-folder-icon');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z');
  icon.appendChild(path);
  folderRow.appendChild(icon);

  const label = document.createElement('span');
  label.textContent = node.title || 'Untitled';
  label.style.flex = '1';
  label.style.overflow = 'hidden';
  label.style.textOverflow = 'ellipsis';
  folderRow.appendChild(label);

  // Chevron
  const chev = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  chev.setAttribute('viewBox', '0 0 24 24');
  chev.setAttribute('fill', 'none');
  chev.setAttribute('stroke', 'currentColor');
  chev.setAttribute('stroke-width', '2');
  chev.classList.add('bm-folder-chevron');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', '9 18 15 12 9 6');
  chev.appendChild(poly);
  folderRow.appendChild(chev);

  const childrenDiv = document.createElement('div');
  childrenDiv.className = 'bm-folder-children';

  if (node.children) {
    node.children.forEach(child => {
      childrenDiv.appendChild(buildBookmarkNode(child));
    });
  }

  folderRow.addEventListener('click', () => {
    const open = childrenDiv.classList.toggle('open');
    chev.classList.toggle('open', open);
  });

  wrapper.appendChild(folderRow);
  wrapper.appendChild(childrenDiv);
  return wrapper;
}

function createLinkNode(node) {
  const a = document.createElement('a');
  a.className = 'bm-link';
  a.href = node.url;
  a.title = node.url;
  a.target = '_self';

  // Favicon
  const faviconUrl = getFaviconUrl(node.url);
  if (faviconUrl) {
    const img = document.createElement('img');
    img.className = 'bm-favicon';
    img.src = faviconUrl;
    img.alt = '';
    img.onerror = () => img.style.display = 'none';
    a.appendChild(img);
  } else {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.classList.add('bm-link-icon');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12'); circle.setAttribute('cy', '12'); circle.setAttribute('r', '10');
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1','2'); line1.setAttribute('y1','12'); line1.setAttribute('x2','22'); line1.setAttribute('y2','12');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d','M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z');
    icon.appendChild(circle); icon.appendChild(line1); icon.appendChild(path);
    a.appendChild(icon);
  }

  const label = document.createElement('span');
  label.textContent = node.title || node.url;
  label.style.overflow = 'hidden';
  label.style.textOverflow = 'ellipsis';
  a.appendChild(label);

  return a;
}

function buildBookmarkNode(node) {
  if (node.url) return createLinkNode(node);
  return createFolderNode(node);
}

function renderBookmarks(bookmarkTree) {
  bookmarksTree.innerHTML = '';
  // Some environments return an array (Chrome), some may return a single root node object.
  const roots = Array.isArray(bookmarkTree)
    ? (bookmarkTree[0]?.children || [])
    : (bookmarkTree?.children || []);

  if (!roots.length) {
    bookmarksTree.innerHTML = '<div class="bm-loading">No bookmarks found.</div>';
    console.debug('renderBookmarks: no roots found', { bookmarkTree });
    return;
  }

  roots.forEach(root => {
    if (root.children) {
      root.children.forEach(child => {
        bookmarksTree.appendChild(buildBookmarkNode(child));
      });
    }
  });
}

// Demo bookmarks for preview (when not in Chrome)
const DEMO_BOOKMARKS = [{
  id: '0', title: 'root', children: [{
    id: '1', title: 'Bookmarks bar', children: [
      { id: '10', title: 'Work', children: [
        { id: '11', title: 'Gmail', url: 'https://mail.google.com' },
        { id: '12', title: 'Calendar', url: 'https://calendar.google.com' },
        { id: '13', title: 'Notion', url: 'https://notion.so' },
      ]},
      { id: '20', title: 'Social Media', children: [
        { id: '21', title: 'Twitter / X', url: 'https://x.com' },
        { id: '22', title: 'LinkedIn', url: 'https://linkedin.com' },
      ]},
      { id: '30', title: 'Dev', children: [
        { id: '31', title: 'GitHub', url: 'https://github.com' },
        { id: '32', title: 'Stack Overflow', url: 'https://stackoverflow.com' },
        { id: '33', title: 'MDN', url: 'https://developer.mozilla.org' },
      ]},
      { id: '40', title: 'Shopping', children: [
        { id: '41', title: 'Amazon', url: 'https://amazon.com' },
      ]},
      { id: '50', title: 'Medium', url: 'https://medium.com' },
      { id: '51', title: 'Unsplash', url: 'https://unsplash.com' },
    ]
  }]
}];

function showBookmarksMessage(message) {
  if (!bookmarksTree) return;
  bookmarksTree.innerHTML = `<div class="bm-loading">${message}</div>`;
}

if (typeof chrome !== 'undefined' && chrome.bookmarks) {
  try {
    chrome.bookmarks.getTree(tree => {
      if (chrome.runtime?.lastError) {
        showBookmarksMessage('Unable to load bookmarks. Please enable the Bookmarks permission in the extension settings.');
        return;
      }
      if (!tree || !tree.length) {
        showBookmarksMessage('No bookmarks found.');
        return;
      }
      renderBookmarks(tree);
    });
  } catch (err) {
    showBookmarksMessage('Unable to load bookmarks.');
    console.error('Bookmarks load failed', err);
  }
} else {
  renderBookmarks(DEMO_BOOKMARKS);
}
