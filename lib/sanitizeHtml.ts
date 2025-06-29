// lib/sanitizeHtml.ts
import sanitizeHtmlLib from 'sanitize-html';

export function sanitizeHtml(dirty: string) {
  return sanitizeHtmlLib(dirty, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      '*': ['style', 'class'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['data', 'http', 'https'],
    allowedSchemesByTag: {},
  });
}
