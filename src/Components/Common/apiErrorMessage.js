// Turns an axios error from the backend into a message for the user (FR/EN).
// Known backend messages (order creation, checkout session, reviews…) get a
// translated wording; anything else falls back to the backend's own text,
// then to `fallback`.
const KNOWN_MESSAGES = {
  'This coupon has already been used.': {
    eng: 'This coupon has already been used.',
    fr: 'Ce coupon a déjà été utilisé.',
  },
  'Insufficient loyalty points balance.': {
    eng: 'You do not have enough loyalty points for this order.',
    fr: "Vous n'avez pas assez de points de fidélité pour cette commande.",
  },
  'Authentication required.': {
    eng: 'Your session has expired. Please log in again.',
    fr: 'Votre session a expiré. Veuillez vous reconnecter.',
  },
};

const INVALID_ARTICLE = {
  eng: 'One of the items in your cart is no longer available. Please remove it and try again.',
  fr: "Un des articles de votre panier n'est plus disponible. Veuillez le retirer et réessayer.",
};

const FORBIDDEN = {
  eng: 'You are not allowed to perform this action.',
  fr: "Vous n'êtes pas autorisé à effectuer cette action.",
};

// Review submits: the backend answers 403 when the order isn't the user's.
export const REVIEW_STATUS_MESSAGES = {
  403: {
    eng: 'You can only review orders that belong to you.',
    fr: 'Vous ne pouvez évaluer que vos propres commandes.',
  },
};

// statusMessages: optional { 403: { eng, fr }, … } to override the wording
// for a given HTTP status on a specific screen.
export const getApiErrorMessage = (error, language, fallback, statusMessages = {}) => {
  const lang = language === 'eng' ? 'eng' : 'fr';
  const status = error?.response?.status;
  const data = error?.response?.data;
  const raw =
    (typeof data?.message === 'string' && data.message) ||
    (typeof data?.error === 'string' && data.error) ||
    '';

  if (statusMessages[status]) return statusMessages[status][lang];
  if (KNOWN_MESSAGES[raw]) return KNOWN_MESSAGES[raw][lang];

  const invalidArticleField =
    data?.errors && Object.keys(data.errors).some((key) => key.endsWith('article_id'));
  if (/invalid article_id/i.test(raw) || invalidArticleField) return INVALID_ARTICLE[lang];

  if (status === 401) return KNOWN_MESSAGES['Authentication required.'][lang];
  if (status === 403) return FORBIDDEN[lang];

  return raw || fallback;
};
