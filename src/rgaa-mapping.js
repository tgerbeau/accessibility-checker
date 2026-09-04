/**
 * Correspondance règles axe-core → critères RGAA 4.1.
 * Politique « tests solides » : seules figurent les règles taguées WCAG A/AA
 * (donc réellement exécutées par le runner) et dont une violation prouve
 * objectivement l'échec du critère. Les critères de pertinence (jugement
 * humain : 1.2, 1.3, 3.3, 6.1, 8.7, 9.1, 9.2, 11.2, 11.7, 12.8…) sont exclus.
 * Chaque entrée : ruleId axe → { rgaa: [critères], theme }.
 */
export const AXE_TO_RGAA = {
  // Thématique 1 — Images (1.2/1.3 exclus : caractère décoratif et pertinence = jugement humain)
  'image-alt':            { rgaa: ['1.1'], theme: 'Images' },
  'input-image-alt':      { rgaa: ['1.1'], theme: 'Images' },
  'area-alt':             { rgaa: ['1.1'], theme: 'Images' },
  'object-alt':           { rgaa: ['1.1'], theme: 'Images' },
  'svg-img-alt':          { rgaa: ['1.1'], theme: 'Images' },
  'role-img-alt':         { rgaa: ['1.1'], theme: 'Images' },

  // Thématique 2 — Cadres
  'frame-title':          { rgaa: ['2.1'], theme: 'Cadres' },
  'frame-title-unique':   { rgaa: ['2.2'], theme: 'Cadres' },

  // Thématique 3 — Couleurs (3.3 exclu : axe ne teste que le contraste du texte, pas des composants)
  'color-contrast':       { rgaa: ['3.2'], theme: 'Couleurs' },
  'link-in-text-block':   { rgaa: ['3.1'], theme: 'Couleurs' },

  // Thématique 4 — Multimédia
  'video-caption':        { rgaa: ['4.3'], theme: 'Multimédia' },
  'no-autoplay-audio':    { rgaa: ['4.10'], theme: 'Multimédia' },

  // Thématique 5 — Tableaux
  'td-headers-attr':      { rgaa: ['5.7'], theme: 'Tableaux' },
  'th-has-data-cells':    { rgaa: ['5.7'], theme: 'Tableaux' },

  // Thématique 6 — Liens (6.1 exclu : caractère explicite d'un lien = jugement humain)
  'link-name':            { rgaa: ['6.2'], theme: 'Liens' },

  // Thématique 7 — Scripts
  'button-name':          { rgaa: ['7.1'], theme: 'Scripts' },
  'nested-interactive':   { rgaa: ['7.1'], theme: 'Scripts' },
  'aria-command-name':    { rgaa: ['7.1'], theme: 'Scripts' },
  'aria-toggle-field-name': { rgaa: ['7.1'], theme: 'Scripts' },
  'aria-tooltip-name':    { rgaa: ['7.1'], theme: 'Scripts' },
  'frame-focusable-content': { rgaa: ['7.3'], theme: 'Scripts' },
  'scrollable-region-focusable': { rgaa: ['7.3'], theme: 'Scripts' },

  // ARIA / états et propriétés (rattachés à la thématique 7 et 8)
  'aria-allowed-attr':    { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-required-attr':   { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-required-children': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-required-parent': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-roles':           { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-valid-attr':      { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-valid-attr-value': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-hidden-body':     { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-hidden-focus':    { rgaa: ['7.1'], theme: 'Scripts' },
  'aria-conditional-attr': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-deprecated-role': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'aria-prohibited-attr': { rgaa: ['8.2'], theme: 'Éléments obligatoires' },

  // Thématique 8 — Éléments obligatoires
  'document-title':       { rgaa: ['8.5'], theme: 'Éléments obligatoires' },
  'html-has-lang':        { rgaa: ['8.3'], theme: 'Éléments obligatoires' },
  'html-lang-valid':      { rgaa: ['8.4'], theme: 'Éléments obligatoires' },
  'html-xml-lang-mismatch': { rgaa: ['8.4'], theme: 'Éléments obligatoires' },
  'valid-lang':           { rgaa: ['8.8'], theme: 'Éléments obligatoires' },
  'duplicate-id-aria':    { rgaa: ['8.2'], theme: 'Éléments obligatoires' },
  'meta-refresh':         { rgaa: ['13.1'], theme: 'Consultation' },

  // Thématique 9 — Structuration (9.1/9.2 exclus : règles axe uniquement best-practice, jamais exécutées ici)
  'list':                 { rgaa: ['9.3'], theme: 'Structuration' },
  'listitem':             { rgaa: ['9.3'], theme: 'Structuration' },
  'definition-list':      { rgaa: ['9.3'], theme: 'Structuration' },
  'dlitem':               { rgaa: ['9.3'], theme: 'Structuration' },

  // Thématique 10 — Présentation de l'information
  'meta-viewport':        { rgaa: ['10.4'], theme: 'Présentation' },
  'avoid-inline-spacing': { rgaa: ['10.12'], theme: 'Présentation' },

  // Thématique 11 — Formulaires
  'label':                { rgaa: ['11.1'], theme: 'Formulaires' },
  'select-name':          { rgaa: ['11.1'], theme: 'Formulaires' },
  'aria-input-field-name': { rgaa: ['11.1'], theme: 'Formulaires' },
  'form-field-multiple-labels': { rgaa: ['11.1'], theme: 'Formulaires' },
  'autocomplete-valid':   { rgaa: ['11.13'], theme: 'Formulaires' },

  // Thématique 12 — Navigation (12.8 exclu : cohérence de l'ordre de tabulation = jugement humain)
  'bypass':               { rgaa: ['12.7'], theme: 'Navigation' },

  // Thématique 13 — Consultation
  'blink':                { rgaa: ['13.8'], theme: 'Consultation' },
  'marquee':              { rgaa: ['13.8'], theme: 'Consultation' },
  'server-side-image-map': { rgaa: ['1.1'], theme: 'Images' }
};

/** Retourne le mapping RGAA pour une règle axe, ou une valeur par défaut. */
export function mapRule(ruleId) {
  return AXE_TO_RGAA[ruleId] ?? { rgaa: [], theme: 'Hors RGAA (bonnes pratiques)' };
}
