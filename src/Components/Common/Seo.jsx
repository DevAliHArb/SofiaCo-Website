import { Helmet } from 'react-helmet-async';

/**
 * <Seo /> — composant SEO réutilisable.
 *
 * Centralise title / meta description / canonical / Open Graph / JSON-LD.
 * À utiliser sur chaque page à la place des <Helmet> dispersés.
 *
 * Exemples :
 *   <Seo title="Parfums | Sofiaco" description="..." path="/main/cp/parfums/123" />
 *   <Seo title={p.designation} description={...} path={url} image={img} jsonLd={productLd} />
 */
const SITE_NAME = 'Sofiaco';
const SITE_URL = 'https://sofiaco.fr';
const DEFAULT_DESC =
  "Sofiaco : boutique en ligne, large sélection de produits. Livraison rapide, paiement sécurisé.";
const DEFAULT_IMAGE = `${SITE_URL}/favicon.svg`;

export default function Seo({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noindex = false,
  keywords,
  jsonLd,
}) {
  const fullTitle = title
    ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
    : `${SITE_NAME}`;
  const desc = (description && String(description).trim()) || DEFAULT_DESC;
  const canonical = `${SITE_URL}${path || ''}`.replace(/\/+$/, '') || SITE_URL;
  const img = image || DEFAULT_IMAGE;
  const jsonLdList = (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean);

  return (
    <Helmet prioritizeSeoTags>
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={canonical} />

      {/* Open Graph (partages réseaux sociaux / WhatsApp) */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {/* Données structurées (JSON-LD) */}
      {jsonLdList.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLdList.length === 1 ? jsonLdList[0] : jsonLdList)}
        </script>
      )}
    </Helmet>
  );
}

/**
 * Construit l'objet JSON-LD Product à partir d'un article de l'API.
 * À passer à <Seo jsonLd={buildProductJsonLd(selectedBook, url)} />
 *
 * Champs API sofiaco : description = descriptif (champ HTML unique, pas de
 * description_fr/description_en), prix = prixpublic / _prix_public_ttc
 * (parfois sur 3 décimales -> formaté à 2), gtin = _code_barre en priorité,
 * repli sur isbn.
 */
export function buildProductJsonLd(article, canonicalPath) {
  if (!article) return null;
  const SITE = SITE_URL;
  const price =
    article?.prixpublic ?? article?._prix_public_ttc ?? article?.price_ttc ?? article?.prix ?? undefined;
  const inStock = Number(article?._qte_a_terme_calcule ?? 0) > 0;
  const images = (article?.articleimage || [])
    .map((im) => im?.link)
    .filter(Boolean);
  const description =
    article?.descriptif || article?.meta_description || article?.designation;

  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: article?.designation,
    description: stripHtml(description),
    sku: String(article?.id ?? ''),
    image: images.length ? images : [DEFAULT_IMAGE],
    url: `${SITE}${canonicalPath || ''}`,
  };
  const gtin = article?._code_barre || article?.isbn;
  if (gtin) ld.gtin13 = String(gtin);
  if (article?.article_famille?.parent?.nom || article?.marque?.nom) {
    ld.brand = {
      '@type': 'Brand',
      name: article?.marque?.nom || article?.article_famille?.parent?.nom,
    };
  }
  if (price !== undefined && price !== null && price !== '') {
    ld.offers = {
      '@type': 'Offer',
      url: `${SITE}${canonicalPath || ''}`,
      priceCurrency: 'EUR',
      price: Number(price).toFixed(2),
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    };
  }
  return ld;
}

function stripHtml(s) {
  return s ? String(s).replace(/<[^>]*>/g, '').trim().slice(0, 500) : undefined;
}

/**
 * Construit un objet JSON-LD BreadcrumbList à partir d'un tableau de
 * breadcrumbs `{ en, fr, url }` (le même format que celui déjà utilisé un
 * peu partout dans l'app pour alimenter <Breadcrumb paths={...} />).
 */
export function buildBreadcrumbJsonLd(paths, language = 'fr') {
  if (!Array.isArray(paths) || paths.length === 0) return null;

  const items = paths
    .map((p) => {
      if (!p) return null;
      const name = typeof p === 'string' ? p : (language === 'eng' ? p.en : p.fr);
      return typeof name === 'string' && name.trim() !== '' ? { name: name.trim(), url: p?.url } : null;
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${SITE_URL}${item.url}` } : {}),
    })),
  };
}

/**
 * Construit un objet JSON-LD FAQPage à partir des données retournées par
 * /faq-questions (utilisées par <FAQSection />) : chaque entrée a
 * `question_fr`/`question_en` et `answers[0].answer_fr`/`answer_en`.
 */
export function buildFaqJsonLd(faqData, language = 'fr') {
  if (!Array.isArray(faqData) || faqData.length === 0) return null;

  const mainEntity = faqData
    .map((card) => {
      const question = language === 'eng' ? card?.question_en : card?.question_fr;
      const answer = language === 'eng' ? card?.answers?.[0]?.answer_en : card?.answers?.[0]?.answer_fr;
      if (!question || !answer) return null;
      return {
        '@type': 'Question',
        name: stripHtml(question),
        acceptedAnswer: { '@type': 'Answer', text: stripHtml(answer) },
      };
    })
    .filter(Boolean);

  if (mainEntity.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

/**
 * <JsonLd /> — injecte un ou plusieurs blocs JSON-LD sans toucher au
 * title/description/canonical de la page. À utiliser sur les pages qui ont
 * déjà leur propre gestion de title/meta et n'ont besoin que de données
 * structurées additionnelles (ex: BreadcrumbList).
 *
 * Exemple :
 *   <JsonLd items={[buildBreadcrumbJsonLd(breadcrumbPaths, language)]} />
 */
export function JsonLd({ items }) {
  const list = (Array.isArray(items) ? items : [items]).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(list.length === 1 ? list[0] : list)}
      </script>
    </Helmet>
  );
}

/**
 * Construit l'objet JSON-LD Person à partir d'un collaborateur de l'API.
 * À passer à <Seo jsonLd={buildPersonJsonLd(CollaboratorData, url)} />
 */
export function buildPersonJsonLd(collaborator, canonicalPath) {
  if (!collaborator) return null;
  const SITE = SITE_URL;

  const ld = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    name: collaborator?.nom,
    description: stripHtml(collaborator?.meta_description || collaborator?.biographie),
    image: collaborator?.image || DEFAULT_IMAGE,
    url: `${SITE}${canonicalPath || ''}`,
  };
  if (collaborator?.type?.name) {
    ld.jobTitle = collaborator.type.name;
  }
  return ld;
}

/**
 * Construit l'objet JSON-LD Brand à partir d'un éditeur/marque de l'API.
 * À passer à <Seo jsonLd={buildBrandJsonLd(CollaboratorData, url)} />
 */
export function buildBrandJsonLd(publisher, canonicalPath) {
  if (!publisher) return null;
  const SITE = SITE_URL;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Brand',
    name: publisher?.title || publisher?.nom,
    description: stripHtml(publisher?.meta_description || publisher?.description || publisher?.biographie),
    logo: publisher?.image || DEFAULT_IMAGE,
    url: `${SITE}${canonicalPath || ''}`,
  };
}
