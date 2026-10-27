import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const routeMap = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/home': 'index.html',
  '/home.html': 'index.html',
  '/apply': 'apply.html',
  '/apply.html': 'apply.html',
  '/contact-us': 'contact-us.html',
  '/contact-us.html': 'contact-us.html',
  '/contact us': 'contact-us.html',
  '/contact us.html': 'contact-us.html',
  '/events': 'events.html',
  '/events.html': 'events.html',
  '/faqs': 'faqs.html',
  '/faqs.html': 'faqs.html',
  '/our-team': 'our-team.html',
  '/our-team.html': 'our-team.html',
  '/our team': 'our-team.html',
  '/our team.html': 'our-team.html',
  '/resources': 'resources.html',
  '/resources.html': 'resources.html',
};

const NAV_PAGES = [
  { file: 'index.html', key: 'home', label: 'Home', href: '/index.html' },
  { file: 'apply.html', key: 'apply', label: 'Apply', href: '/apply.html' },
  { file: 'our-team.html', key: 'our-team', label: 'Our Team', href: '/our-team.html' },
  { file: 'resources.html', key: 'resources', label: 'Resources', href: '/resources.html' },
  { file: 'events.html', key: 'events', label: 'Events', href: '/events.html' },
  { file: 'faqs.html', key: 'faqs', label: 'FAQs', href: '/faqs.html' },
  { file: 'contact-us.html', key: 'contact-us', label: 'Contact us', href: '/contact-us.html' },
];

function buildNavMarkup(activeFile) {
  const desktopLinks = NAV_PAGES.map((p) => {
    const isActive = p.file === activeFile;
    return `<a href="${p.href}" class="mci-nav-link${isActive ? ' is-active' : ''}"${isActive ? ' aria-current="page"' : ''}>${p.label}</a>`;
  }).join('');

  const mobileLinks = NAV_PAGES.map((p) => {
    const isActive = p.file === activeFile;
    return `<li><a href="${p.href}" class="mci-drawer-link${isActive ? ' is-active' : ''}"${isActive ? ' aria-current="page"' : ''}>${p.label}</a></li>`;
  }).join('');

  return `<!-- MCI_CUSTOM_NAV_START -->
<style id="mci-custom-nav-styles">
  #atIdViewHeader {
    display: none !important;
  }
  .mci-topbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(24, 26, 30, 0.96);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
    z-index: 9990;
    font-family: 'Lato', 'Google Sans', Roboto, sans-serif;
    box-sizing: border-box;
  }
  .mci-topbar-inner {
    max-width: 1280px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    box-sizing: border-box;
  }
  .mci-brand-group {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }
  .mci-menu-btn {
    display: none;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-left: -8px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #ffffff;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.15s ease;
  }
  .mci-menu-btn:hover,
  .mci-menu-btn:focus-visible {
    background: rgba(255, 255, 255, 0.12);
    outline: none;
  }
  .mci-brand-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    text-decoration: none !important;
    color: #ffffff !important;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .mci-brand-logo {
    width: 36px;
    height: 36px;
    object-fit: contain;
    border-radius: 4px;
    flex-shrink: 0;
  }
  .mci-brand-title {
    font-size: 19px;
    font-weight: 400;
    letter-spacing: 0.2px;
    color: #ffffff;
    white-space: nowrap;
  }
  .mci-desktop-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mci-nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 8px 14px;
    color: rgba(255, 255, 255, 0.84) !important;
    text-decoration: none !important;
    font-size: 15px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 6px;
    transition: color 0.15s ease, background-color 0.15s ease;
  }
  .mci-nav-link:hover,
  .mci-nav-link:focus-visible {
    color: #ffffff !important;
    background: rgba(255, 255, 255, 0.08);
    outline: none;
  }
  .mci-nav-link.is-active {
    color: #49aad4 !important;
    font-weight: 700;
  }
  .mci-nav-link.is-active::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 2px;
    height: 2px;
    background: #49aad4;
    border-radius: 2px;
  }

  /* Mobile left-side open/close sidebar drawer */
  .mci-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 9998;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mci-backdrop.is-open {
    opacity: 1;
    pointer-events: auto;
  }
  .mci-drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    max-width: 82vw;
    background: #181a1e;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.45);
    z-index: 9999;
    transform: translateX(-100%);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    font-family: 'Lato', 'Google Sans', Roboto, sans-serif;
    box-sizing: border-box;
  }
  .mci-drawer.is-open {
    transform: translateX(0);
  }
  .mci-drawer-header {
    height: 60px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }
  .mci-close-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-right: -8px;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: rgba(255, 255, 255, 0.85);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .mci-close-btn:hover,
  .mci-close-btn:focus-visible {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    outline: none;
  }
  .mci-drawer-list {
    list-style: none !important;
    margin: 0;
    padding: 12px 10px;
    overflow-y: auto;
    flex: 1;
  }
  .mci-drawer-list li {
    list-style: none !important;
    margin: 2px 0;
  }
  .mci-drawer-link {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.86) !important;
    text-decoration: none !important;
    font-size: 16px;
    font-weight: 400;
    border-radius: 8px;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .mci-drawer-link:hover,
  .mci-drawer-link:focus-visible {
    background: rgba(255, 255, 255, 0.08);
    color: #ffffff !important;
    outline: none;
  }
  .mci-drawer-link.is-active {
    color: #49aad4 !important;
    background: rgba(73, 170, 212, 0.14);
    font-weight: 700;
  }

  @media only screen and (max-width: 767px) {
    .mci-topbar {
      height: 56px;
    }
    .mci-topbar-inner {
      padding: 0 14px;
    }
    .mci-menu-btn {
      display: inline-flex;
    }
    .mci-desktop-nav {
      display: none;
    }
    .mci-brand-title {
      font-size: 17px;
    }
  }
</style>

<div id="mci-nav-root">
  <div class="mci-topbar" role="banner">
    <div class="mci-topbar-inner">
      <div class="mci-brand-group">
        <button type="button" class="mci-menu-btn" id="mci-open-drawer-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mci-mobile-drawer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <a href="/index.html" class="mci-brand-link">
          <img src="/4c84bc06fb33b67e7fa169a5476073a8.jpg" alt="Math Circle India logo" class="mci-brand-logo" referrerpolicy="no-referrer" />
          <span class="mci-brand-title">Math Circle India</span>
        </a>
      </div>
      <nav class="mci-desktop-nav" aria-label="Primary Navigation">
        ${desktopLinks}
      </nav>
    </div>
  </div>

  <div class="mci-backdrop" id="mci-drawer-backdrop" aria-hidden="true"></div>

  <aside class="mci-drawer" id="mci-mobile-drawer" aria-label="Mobile Navigation Sidebar" aria-hidden="true">
    <div class="mci-drawer-header">
      <a href="/index.html" class="mci-brand-link">
        <img src="/4c84bc06fb33b67e7fa169a5476073a8.jpg" alt="Math Circle India logo" class="mci-brand-logo" referrerpolicy="no-referrer" />
        <span class="mci-brand-title">Math Circle India</span>
      </a>
      <button type="button" class="mci-close-btn" id="mci-close-drawer-btn" aria-label="Close navigation menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <ul class="mci-drawer-list">
      ${mobileLinks}
    </ul>
  </aside>
</div>

<script>
(function() {
  var openBtn = document.getElementById('mci-open-drawer-btn');
  var closeBtn = document.getElementById('mci-close-drawer-btn');
  var drawer = document.getElementById('mci-mobile-drawer');
  var backdrop = document.getElementById('mci-drawer-backdrop');

  function setDrawerOpen(isOpen) {
    if (!drawer || !backdrop || !openBtn) return;
    if (isOpen) {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = drawer && drawer.classList.contains('is-open');
      setDrawerOpen(!isOpen);
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      setDrawerOpen(false);
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', function() {
      setDrawerOpen(false);
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      setDrawerOpen(false);
    }
  });
})();
</script>
<!-- MCI_CUSTOM_NAV_END -->`;
}

function injectNavIntoHtml(htmlStr, fileName) {
  const cleaned = htmlStr.replace(/<!-- MCI_CUSTOM_NAV_START -->[\s\S]*?<!-- MCI_CUSTOM_NAV_END -->/g, '');
  const bodyMatch = cleaned.match(/<body[^>]*>/i);
  if (!bodyMatch) return htmlStr;
  const insertPos = bodyMatch.index + bodyMatch[0].length;
  return cleaned.slice(0, insertPos) + buildNavMarkup(fileName) + cleaned.slice(insertPos);
}

// Ensure all 7 HTML files on disk have the navigation banner persisted
for (const p of NAV_PAGES) {
  const fullPath = path.join(__dirname, p.file);
  if (fs.existsSync(fullPath)) {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('<!-- MCI_CUSTOM_NAV_START -->')) {
        fs.writeFileSync(fullPath, injectNavIntoHtml(content, p.file), 'utf8');
      }
    } catch {
      // Ignore write errors if read-only
    }
  }
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    if (ext === '.html') {
      const fileName = path.basename(filePath).toLowerCase();
      let html = data.toString('utf8');
      if (!html.includes('<!-- MCI_CUSTOM_NAV_START -->')) {
        html = injectNavIntoHtml(html, fileName);
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(html, 'utf8');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const rawPathname = decodeURIComponent(parsedUrl.pathname);
    const lowerPath = rawPathname.toLowerCase();

    if (routeMap[lowerPath]) {
      return sendFile(res, path.join(__dirname, routeMap[lowerPath]));
    }

    // Direct static file check (preserving original case for directories like "Our Team/", "Contact us/", etc.)
    const directPath = path.join(__dirname, rawPathname);
    if (
      directPath.startsWith(__dirname) &&
      fs.existsSync(directPath) &&
      fs.statSync(directPath).isFile()
    ) {
      return sendFile(res, directPath);
    }

    // Normalized lowercase/hyphenated HTML fallback
    const normalizedSlug = lowerPath.replace(/^\//, '').replace(/\s+/g, '-');
    const candidateHtml = normalizedSlug.endsWith('.html')
      ? normalizedSlug
      : `${normalizedSlug}.html`;
    const candidateFullPath = path.join(__dirname, candidateHtml);

    if (
      candidateFullPath.startsWith(__dirname) &&
      fs.existsSync(candidateFullPath) &&
      fs.statSync(candidateFullPath).isFile()
    ) {
      return sendFile(res, candidateFullPath);
    }

    // Fallback to index.html
    return sendFile(res, path.join(__dirname, 'index.html'));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

