/**
 * generate-sitemap.mjs
 * ---------------------------------------------------------------------------
 * Génère public/sitemap.xml pour sofiaco.fr à partir de l'API Sofiadis.
 *
 * Couvre :
 *   - Pages statiques
 *   - Catégories parentes  (/main/cp/<cat>/<id>)
 *   - Sous-catégories       (/main/cp/<cat>/<sub>/<id>)
 *   - Sous-sous-catégories  (/main/cp/<cat>/<sub>/<ssc>/<id>)
 *   - Pages produits        (/cp/<cat>/<sub>/<ssc>/<prod>/<id>) — SANS préfixe /main
 *   - Blogs                 (/main/blogdetails/<id>)
 *   - Collaborateurs        (/main/collaborators/<id>/details)
 *   - Marques / Éditeurs    (/main/brands/<id>/details)
 *   - Événements            (/main/events/<id>/event-details)
 *
 * Note : les routes /collections et /collection-details existent dans le
 * code (imports + SEO_ROUTE_SECTION_MAP) mais ne sont PAS enregistrées dans
 * App.jsx (aucune <Route> ne les monte) — elles sont donc volontairement
 * absentes de ce générateur tant qu'elles ne sont pas branchées.
 *
 * Usage :
 *   node scripts/generate-sitemap.mjs
 *   npm run sitemap
 * ---------------------------------------------------------------------------
 */

import fs from 'node:fs';
import path from 'node:path';

const SITE = 'https://sofiaco.fr';
const API  = process.env.VITE_TESTING_API || 'https://api.leonardo-service.com/api/sofiadis/sofiaco';
const ECOM = process.env.VITE_ECOM_TYPE   || 'sofiaco';
const OUT  = path.resolve(process.cwd(), 'public', 'sitemap.xml');

// ---------- slugify (identical to the front-end helper) --------------------
const slugify = (text, placeholder = 'product') => {
  if (!text || String(text).trim() === '') return placeholder;
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ---------- static pages ---------------------------------------------------
const STATIC_PAGES = [
  { loc: '/main',              priority: '1.0', freq: 'daily'   },
  { loc: '/main/products',     priority: '0.8', freq: 'daily'   },
  { loc: '/bestsellers',       priority: '0.8', freq: 'daily'   },
  { loc: '/nouveautes',        priority: '0.8', freq: 'daily'   },
  { loc: '/main/blogs',        priority: '0.6', freq: 'weekly'  },
  { loc: '/main/brands',       priority: '0.6', freq: 'weekly'  },
  { loc: '/main/collaborators',priority: '0.5', freq: 'weekly'  },
  { loc: '/main/events',       priority: '0.5', freq: 'weekly'  },
  { loc: '/main/about',        priority: '0.4', freq: 'monthly' },
  { loc: '/main/contact',      priority: '0.4', freq: 'monthly' },
  { loc: '/main/policies',     priority: '0.2', freq: 'yearly'  },
];

// ---------- helpers --------------------------------------------------------
const xmlEscape = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const DELAY_MS  = 200;  // pause between requests to avoid rate-limiting
const MAX_RETRY = 3;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url) {
  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch (e) {
      if (attempt === MAX_RETRY) throw new Error(`${e.message} — ${url}`);
      await sleep(1000 * attempt); // 1s, 2s before final attempt
    }
  }
}

/**
 * Fetch all pages of an endpoint.
 * - Requests PER_PAGE items per page to minimise total API calls.
 * - Waits DELAY_MS between requests to avoid rate-limiting.
 * - Skips pages that keep failing rather than crashing.
 */
async function fetchAll(endpoint) {
  const base = `${API}/${endpoint}?ecom_type=${ECOM}`;
  const first = await getJSON(base);
  await sleep(DELAY_MS);

  // Plain array — no pagination
  if (Array.isArray(first)) return first;

  // Paginated envelope { data, last_page }
  const items   = Array.isArray(first.data) ? [...first.data] : [];
  const lastPage = first.last_page ?? first.meta?.last_page ?? 1;
  const skipped  = [];

  for (let p = 2; p <= lastPage; p++) {
    process.stdout.write(`  page ${p}/${lastPage}…\r`);
    try {
      const page = await getJSON(`${base}&page=${p}`);
      const rows = Array.isArray(page) ? page : (page.data ?? []);
      items.push(...rows);
    } catch (e) {
      skipped.push(p);
    }
    await sleep(DELAY_MS);
  }

  if (skipped.length > 0) {
    console.warn(`\n  ⚠ ${endpoint}: ${skipped.length} page(s) ignorée(s) — ${skipped.join(', ')}`);
  }

  return items;
}

function urlEntry(loc, { lastmod, priority = '0.6', freq = 'weekly' } = {}) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(SITE + loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <changefreq>${freq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n');
}

const lastmod = (obj) =>
  (obj?.updated_at || obj?.updatedAt || obj?.created_at || '').slice(0, 10) || undefined;

// ---------- URL builders ---------------------------------------------------
// Product pages live at /cp/... with NO /main prefix (unlike category browsing,
// which is under /main/cp/...) — confirmed against App.jsx's <Route> list.
function productUrl(a) {
  const cat  = slugify(a?.article_famille?.parent?.nom,  'category');
  const sub  = slugify(a?.article_famille?.type_nom,     'subcategory');
  const ssc  = slugify(a?.article_sous_categorie?.nom,   'sb');
  const prod = slugify(a?.designation,                   'product');
  return `/cp/${cat}/${sub}/${ssc}/${prod}/${a.id}`;
}

function categoryUrl(cat) {
  return `/main/cp/${slugify(cat.nom, 'category')}/${cat.id}`;
}

function subCategoryUrl(sub, parentSlug) {
  return `/main/cp/${parentSlug}/${slugify(sub.type_nom, 'subcategory')}/${sub.id}`;
}

function subSubCategoryUrl(ssc) {
  const cat = slugify(ssc?.article_famille?.parent?.nom, 'category');
  const sub = slugify(ssc?.article_famille?.type_nom,    'subcategory');
  const nom = slugify(ssc?.nom,                          'sb');
  return `/main/cp/${cat}/${sub}/${nom}/${ssc.id}`;
}

// ---------- main -----------------------------------------------------------
async function main() {
  const seen    = new Set();
  const entries = [];
  let counts    = {};

  const add = (loc, opts) => {
    if (!loc || seen.has(loc)) return;
    seen.add(loc);
    entries.push(urlEntry(loc, opts));
  };

  // 1) Static pages
  for (const p of STATIC_PAGES) {
    add(p.loc, { priority: p.priority, freq: p.freq });
  }
  counts.static = STATIC_PAGES.length;

  // 2) Parent categories
  console.log('\nFetching parent categories…');
  let parents = [];
  try {
    parents = await fetchAll('article-famille-parents');
  } catch (e) {
    console.warn('  article-famille-parents: impossible de récupérer —', e.message);
  }
  const parentMap = new Map(parents.map((c) => [c.id, slugify(c.nom, 'category')]));
  for (const cat of parents) {
    if (!cat?.id) continue;
    add(categoryUrl(cat), { lastmod: lastmod(cat), priority: '0.8', freq: 'weekly' });
  }
  counts.categories = parents.length;
  console.log(`  ${parents.length} catégories parentes.`);

  // 3) Sub-categories
  console.log('Fetching sub-categories…');
  try {
    const subs = await fetchAll('article-famille');
    for (const sub of subs) {
      if (!sub?.id) continue;
      const parentSlug = parentMap.get(sub.b_usr_parentcategorie_id) || 'category';
      add(subCategoryUrl(sub, parentSlug), { lastmod: lastmod(sub), priority: '0.7', freq: 'weekly' });
    }
    counts.subcategories = subs.length;
    console.log(`  ${subs.length} sous-catégories.`);
  } catch (e) {
    console.warn('  article-famille: impossible de récupérer —', e.message);
  }

  // 4) Sub-sub-categories
  console.log('Fetching sub-sub-categories…');
  try {
    const sscs = await fetchAll('article-sous-categories');
    for (const ssc of sscs) {
      if (!ssc?.id) continue;
      add(subSubCategoryUrl(ssc), { lastmod: lastmod(ssc), priority: '0.7', freq: 'weekly' });
    }
    counts.subsubcategories = sscs.length;
    console.log(`  ${sscs.length} sous-sous-catégories.`);
  } catch (e) {
    console.warn('  article-sous-categories: impossible de récupérer —', e.message);
  }

  // 5) Products (articles)
  console.log('Fetching products…');
  try {
    const articles = await fetchAll('articles');
    for (const a of articles) {
      if (!a?.id) continue;
      add(productUrl(a), { lastmod: lastmod(a), priority: '0.7', freq: 'weekly' });
    }
    counts.products = articles.length;
    console.log(`  ${articles.length} produits.`);
  } catch (e) {
    console.warn('  articles: impossible de récupérer —', e.message);
  }

  // 6) Blogs
  console.log('Fetching blogs…');
  try {
    const blogs = await fetchAll('blogs');
    for (const b of blogs) {
      if (!b?.id) continue;
      add(`/main/blogdetails/${b.id}`, { lastmod: lastmod(b), priority: '0.5', freq: 'weekly' });
    }
    counts.blogs = blogs.length;
    console.log(`  ${blogs.length} articles de blog.`);
  } catch (e) {
    console.warn('  blogs: impossible de récupérer —', e.message);
  }

  // 7) Collaborators
  console.log('Fetching collaborators…');
  try {
    const collabs = await fetchAll('collaborators');
    for (const c of collabs) {
      if (!c?.id) continue;
      add(`/main/collaborators/${c.id}/details`, { lastmod: lastmod(c), priority: '0.5', freq: 'monthly' });
    }
    counts.collaborators = collabs.length;
    console.log(`  ${collabs.length} collaborateurs.`);
  } catch (e) {
    console.warn('  collaborators: impossible de récupérer —', e.message);
  }

  // 8) Brands / Publishers
  console.log('Fetching brands/publishers…');
  try {
    const publishers = await fetchAll('publishers');
    for (const p of publishers) {
      if (!p?.id) continue;
      add(`/main/brands/${p.id}/details`, { lastmod: lastmod(p), priority: '0.5', freq: 'monthly' });
    }
    counts.publishers = publishers.length;
    console.log(`  ${publishers.length} marques/éditeurs.`);
  } catch (e) {
    console.warn('  publishers: impossible de récupérer —', e.message);
  }

  // 9) Events
  console.log('Fetching events…');
  try {
    const events = await fetchAll('events');
    for (const e of events) {
      if (!e?.id) continue;
      add(`/main/events/${e.id}/event-details`, { lastmod: lastmod(e), priority: '0.4', freq: 'weekly' });
    }
    counts.events = events.length;
    console.log(`  ${events.length} événements.`);
  } catch (e) {
    console.warn('  events: impossible de récupérer —', e.message);
  }

  // Write file
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, xml, 'utf8');

  console.log('\n✓ Sitemap écrit :', OUT);
  console.log('  Total URLs :', entries.length);
  console.table(counts);
}

main().catch((e) => {
  console.warn('Échec génération sitemap :', e.message);
  // Exit 0 so a sitemap failure never blocks the build
  process.exit(0);
});
