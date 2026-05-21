/**
 * Viewport tolerance checks for draggable dialog tasks (v2).
 * V_EXTRA accounts for the presentation-mode header (~120-160px).
 */

const V_EXTRA = 160;

export function withinTopRightViewport(r: DOMRect, tolX: number, tolY: number): boolean {
  const w = window.innerWidth;
  return Math.abs(r.right - w) <= tolX && r.top <= tolY + V_EXTRA;
}

export function withinBottomLeftViewport(r: DOMRect, tolX: number, tolY: number): boolean {
  const h = window.innerHeight;
  return Math.abs(r.left - 0) <= tolX && Math.abs(r.bottom - h) <= tolY;
}

export function withinBottomRightViewport(r: DOMRect, tolX: number, tolY: number): boolean {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.abs(r.right - w) <= tolX && Math.abs(r.bottom - h) <= tolY;
}

/** Top-left corner near left edge and near vertical center of viewport */
export function withinLeftCenterBand(r: DOMRect, tolX: number, tolY: number): boolean {
  const h = window.innerHeight;
  return Math.abs(r.left - 0) <= tolX && Math.abs(r.top - h / 2) <= tolY + V_EXTRA;
}

export function boundsFromRect(r: DOMRect) {
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
}
