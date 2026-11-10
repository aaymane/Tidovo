// ROOMRESET T1.1 — shared mission data and pure helpers (no side effects).
export const GLYPHS = {
  cup: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5c.6.8.6 1.7 0 2.5M12 3.5c.6.8.6 1.7 0 2.5"/>',
  shirt: '<path d="M8.5 4 4 6.6l1.7 3.5L8 9.2V20h8V9.2l2.3.9L20 6.6 15.5 4a3.6 3.6 0 0 1-7 0z"/>',
  book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z"/>',
  paper: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 15.5h5"/>',
  box: '<path d="M3.5 8 12 4l8.5 4v8.5L12 20.5 3.5 16.5z"/><path d="M3.5 8 12 12l8.5-4M12 12v8.5"/>',
};
export const glyphSvg = (g) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[g]}</svg>`;

export const MISSIONS = [
  { id: 'dishes', title: 'Rassembler la vaisselle', place: 'Bureau et table de nuit', min: 2, glyph: 'cup', tint: '#EBCB86', pr: '49% 51% 44% 56% / 55% 46% 54% 45%' },
  { id: 'clothes', title: 'Plier les vêtements', place: 'Lit et sol', min: 3, glyph: 'shirt', tint: '#B9CFBF', pr: '46% 54% 52% 48% / 50% 44% 56% 50%' },
  { id: 'books', title: 'Ranger les livres', place: 'Étagère au-dessus du lit', min: 2, glyph: 'book', tint: '#C3CFD9', pr: '52% 48% 47% 53% / 46% 52% 48% 54%' },
  { id: 'papers', title: 'Empiler les papiers', place: 'Bureau', min: 1, glyph: 'paper', tint: '#E4DFD2', pr: '47% 53% 50% 50% / 53% 49% 51% 47%' },
  { id: 'box', title: 'Glisser le carton sous le bureau', place: 'Milieu de la pièce', min: 2, glyph: 'box', tint: '#DDBF9C', pr: '50% 50% 54% 46% / 48% 55% 45% 52%' },
];
export const pebbleSize = (m) => (m.min <= 2 ? 52 : m.min <= 5 ? 60 : 68);
export const REST_ROT = [-9, 7, -5, 10, -7];

// Quadratic Bézier flight with a sideways curve; height is a separate lift curve (top-down view).
export function flightPoint(a, b, t) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const vw = typeof innerWidth === 'number' ? innerWidth : 390;
  const side = mx < vw / 2 ? 1 : -1; // bow toward the centre of the screen, never off-screen
  const bow = Math.min(70, Math.abs(b.y - a.y) * 0.2 + 24);
  const c = { x: Math.min(vw - 44, Math.max(44, mx + side * bow)), y: my - 24 };
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}
export const liftCurve = (t) => Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
