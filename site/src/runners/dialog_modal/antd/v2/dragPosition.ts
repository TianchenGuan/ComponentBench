/**
 * Viewport tolerance checks for draggable Ant Design modals (v2 tasks).
 *
 * The content area starts below the presentation-mode header (~120-160px),
 * so vertical tolerance is more generous than horizontal.
 */

const V_EXTRA = 160;

export function getAntModalRect(containerEl: HTMLElement | null): DOMRect | null {
  if (!containerEl) return null;
  const modal = containerEl.querySelector('.ant-modal') as HTMLElement | null;
  return modal?.getBoundingClientRect() ?? null;
}

export function inTopRightBand(rect: DOMRect, tol: number): boolean {
  return Math.abs(rect.right - window.innerWidth) <= tol && rect.top <= tol + V_EXTRA;
}

export function inBottomLeftBand(rect: DOMRect, tol: number): boolean {
  return rect.left <= tol && Math.abs(rect.bottom - window.innerHeight) <= tol;
}

export function inBottomRightBand(rect: DOMRect, tol: number): boolean {
  return (
    Math.abs(rect.right - window.innerWidth) <= tol &&
    Math.abs(rect.bottom - window.innerHeight) <= tol
  );
}

export function inLeftCenterBand(rect: DOMRect, tol: number): boolean {
  const midY = window.innerHeight / 2;
  return rect.left <= tol && Math.abs(rect.top - midY) <= tol + V_EXTRA;
}
