import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

const markdown = remark()
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeStringify);

const content = document.querySelector('#wiki-content');
const sidebar = document.querySelector('#wiki-sidebar');
const root = document.documentElement;

function setRenderState(state, error) {
  root.dataset.wikiRenderState = state;
  if (error) {
    root.dataset.wikiRenderError = error.message;
  } else {
    delete root.dataset.wikiRenderError;
  }
}

async function waitForImages(element) {
  await Promise.all([...element.querySelectorAll('img')].map(image => {
    if (image.complete) {
      return image.naturalWidth > 0
        ? Promise.resolve()
        : Promise.reject(new Error(`Could not load image ${image.currentSrc || image.src}`));
    }

    return new Promise((resolvePromise, reject) => {
      image.addEventListener('load', resolvePromise, { once: true });
      image.addEventListener('error', () => {
        reject(new Error(`Could not load image ${image.currentSrc || image.src}`));
      }, { once: true });
    });
  }));
}

function route() {
  const [page = 'Home', anchor = ''] = decodeURIComponent(location.hash.slice(1).replace(/^\//, '')).split('#');
  return { page: page || 'Home', anchor };
}

function isExternalLink(href) {
  return /^(?:[a-z][a-z+.-]*:|\/\/)/i.test(href);
}

function rewriteLinks(element, currentPage) {
  element.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || isExternalLink(href)) return;

    if (href === '.') {
      link.href = '#/Home';
      return;
    }

    if (href.startsWith('#')) {
      link.href = `#/${currentPage}${href}`;
      return;
    }

    link.href = `#/${href.replace(/\.md(?=#|$)/i, '')}`;
  });
}

function updateActiveLink(page) {
  sidebar.querySelectorAll('a[aria-current]').forEach(link => link.removeAttribute('aria-current'));
  const active = [...sidebar.querySelectorAll('a[href]')]
    .find(link => routeFromLink(link.getAttribute('href')) === page);
  active?.setAttribute('aria-current', 'page');
}

function routeFromLink(href) {
  return decodeURIComponent(href.replace(/^#\//, '').split('#', 1)[0]);
}

async function renderPage() {
  const { page, anchor } = route();
  setRenderState('loading');
  content.textContent = 'Loading wiki preview…';

  try {
    const response = await fetch(`${encodeURI(page)}.md`);
    if (!response.ok) throw new Error(`Could not load ${page}.md`);

    content.innerHTML = String(await markdown.process(await response.text()));
    rewriteLinks(content, page);
    updateActiveLink(page);
    document.title = `${content.querySelector('h1')?.textContent || page} - Doombubbles BG3 Mods`;
    document.getElementById(anchor)?.scrollIntoView();
    await waitForImages(content);
    await document.fonts?.ready;
    setRenderState('ready');
  } catch (error) {
    content.innerHTML = `<h1>Page not found</h1><p>${error.message}</p>`;
    setRenderState('error', error);
  }
}

async function renderSidebar() {
  const response = await fetch('_Sidebar.md');
  if (!response.ok) throw new Error('Could not load _Sidebar.md');
  sidebar.innerHTML = String(await markdown.process(await response.text()));
  rewriteLinks(sidebar, 'Home');
  updateActiveLink(route().page);
}

window.addEventListener('hashchange', () => void renderPage());

try {
  await renderSidebar();
  await renderPage();
} catch (error) {
  content.innerHTML = `<h1>Preview error</h1><p>${error.message}</p>`;
  setRenderState('error', error);
}
