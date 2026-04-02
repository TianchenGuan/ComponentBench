/**
 * Client-side human action recorder.
 *
 * Captures click, type, keypress, drag, scroll events and sends them
 * as high-level steps to /api/record/append-step.
 *
 * Usage:
 *   const rec = new HumanRecorder(runId, taskId);
 *   rec.start();
 *   // ... user interacts ...
 *   await rec.finalize('SUCCESS');
 */
import type { RecordedStep, StepType, TargetSnapshot, EpisodeMeta, EpisodeStatus } from './schema';

function snapshotTarget(el: Element | null): TargetSnapshot | undefined {
  if (!el || !(el instanceof HTMLElement)) return undefined;
  const rect = el.getBoundingClientRect();
  return {
    tag: el.tagName,
    id: el.id || '',
    classes: el.className?.toString() || '',
    testid: el.getAttribute('data-testid') || '',
    role: el.getAttribute('role') || '',
    name: (el.getAttribute('aria-label') || el.innerText || '').slice(0, 120),
    bbox: { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) },
  };
}

function modifiers(e: MouseEvent | KeyboardEvent) {
  return { shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey, meta: e.metaKey };
}

export class HumanRecorder {
  private runId: string;
  private taskId: string;
  private pass: number;
  private stepIndex = 0;
  private startTime = 0;
  private active = false;
  private sendQueue: Promise<void> = Promise.resolve();

  // Drag tracking
  private dragStart: { x: number; y: number; time: number } | null = null;
  private isDragging = false;
  private readonly DRAG_THRESHOLD = 8;

  // Type buffering
  private typeBuffer = '';
  private typeTarget: Element | null = null;
  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly TYPE_DEBOUNCE_MS = 500;

  // Scroll aggregation
  private scrollAccum = { dx: 0, dy: 0 };
  private scrollTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly SCROLL_DEBOUNCE_MS = 300;

  // Bound handlers for cleanup
  private handlers: { event: string; fn: EventListener; options?: AddEventListenerOptions }[] = [];

  constructor(runId: string, taskId: string, pass = 1) {
    this.runId = runId;
    this.taskId = taskId;
    this.pass = pass;
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.startTime = performance.now();

    this.listen('pointerdown', this.onPointerDown.bind(this) as EventListener, { capture: true });
    this.listen('pointermove', this.onPointerMove.bind(this) as EventListener, { capture: true });
    this.listen('pointerup', this.onPointerUp.bind(this) as EventListener, { capture: true });
    this.listen('keydown', this.onKeyDown.bind(this) as EventListener, { capture: true });
    this.listen('input', this.onInput.bind(this) as EventListener, { capture: true });
    this.listen('wheel', this.onWheel.bind(this) as EventListener, { capture: true, passive: true });
  }

  stop() {
    this.flushTypeBuffer();
    this.flushScroll();
    this.active = false;
    for (const h of this.handlers) {
      document.removeEventListener(h.event, h.fn, h.options);
    }
    this.handlers = [];
  }

  get isActive() { return this.active; }
  get currentStep() { return this.stepIndex; }
  get elapsedMs() { return this.active ? Math.round(performance.now() - this.startTime) : 0; }

  async finalize(status: EpisodeStatus, notes = '') {
    this.stop();
    const meta: EpisodeMeta = {
      run_id: this.runId,
      pass: this.pass,
      task_id: this.taskId,
      started_at: new Date(Date.now() - this.elapsedMs).toISOString(),
      ended_at: new Date().toISOString(),
      status,
      n_steps: this.stepIndex,
      notes,
    };
    await this.sendQueue;
    await fetch('/api/record/finalize-episode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ run_id: this.runId, task_id: this.taskId, meta }),
    });
  }

  // --- Event handlers ---

  private onPointerDown(e: PointerEvent) {
    if (!this.active || e.button !== 0) return;
    this.flushTypeBuffer();
    this.dragStart = { x: e.clientX, y: e.clientY, time: performance.now() };
    this.isDragging = false;
  }

  private onPointerMove(e: PointerEvent) {
    if (!this.active || !this.dragStart) return;
    const dx = e.clientX - this.dragStart.x;
    const dy = e.clientY - this.dragStart.y;
    if (Math.hypot(dx, dy) > this.DRAG_THRESHOLD) {
      this.isDragging = true;
    }
  }

  private onPointerUp(e: PointerEvent) {
    if (!this.active || !this.dragStart) return;
    if (this.isDragging) {
      this.recordStep({
        type: 'drag',
        drag: {
          x1: Math.round(this.dragStart.x),
          y1: Math.round(this.dragStart.y),
          x2: Math.round(e.clientX),
          y2: Math.round(e.clientY),
          steps: 10,
        },
        pointer: {
          x: Math.round(e.clientX),
          y: Math.round(e.clientY),
          button: e.button,
          mod: modifiers(e),
        },
        target: snapshotTarget(e.target as Element),
      });
    } else {
      this.recordStep({
        type: 'click',
        pointer: {
          x: Math.round(e.clientX),
          y: Math.round(e.clientY),
          button: e.button,
          mod: modifiers(e),
        },
        target: snapshotTarget(e.target as Element),
      });
    }
    this.dragStart = null;
    this.isDragging = false;
  }

  private onKeyDown(e: KeyboardEvent) {
    if (!this.active) return;
    const special = ['Enter', 'Escape', 'Tab', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];
    if (special.includes(e.key) || e.ctrlKey || e.metaKey) {
      this.flushTypeBuffer();
      this.recordStep({
        type: 'key',
        key: e.key,
        target: snapshotTarget(e.target as Element),
      });
    }
  }

  private onInput(e: Event) {
    if (!this.active) return;
    const inputEvent = e as InputEvent;
    if (inputEvent.inputType?.startsWith('insert') && inputEvent.data) {
      this.typeTarget = e.target as Element;
      this.typeBuffer += inputEvent.data;
      if (this.typeTimer) clearTimeout(this.typeTimer);
      this.typeTimer = setTimeout(() => this.flushTypeBuffer(), this.TYPE_DEBOUNCE_MS);
    }
  }

  private onWheel(e: WheelEvent) {
    if (!this.active) return;
    this.scrollAccum.dx += e.deltaX;
    this.scrollAccum.dy += e.deltaY;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => this.flushScroll(), this.SCROLL_DEBOUNCE_MS);
  }

  // --- Flush helpers ---

  private flushTypeBuffer() {
    if (!this.typeBuffer) return;
    this.recordStep({
      type: 'type',
      text: this.typeBuffer,
      target: snapshotTarget(this.typeTarget),
    });
    this.typeBuffer = '';
    this.typeTarget = null;
    if (this.typeTimer) { clearTimeout(this.typeTimer); this.typeTimer = null; }
  }

  private flushScroll() {
    if (this.scrollAccum.dx === 0 && this.scrollAccum.dy === 0) return;
    this.recordStep({
      type: 'scroll',
      scroll: { dx: Math.round(this.scrollAccum.dx), dy: Math.round(this.scrollAccum.dy) },
    });
    this.scrollAccum = { dx: 0, dy: 0 };
    if (this.scrollTimer) { clearTimeout(this.scrollTimer); this.scrollTimer = null; }
  }

  // --- Core step recording ---

  private recordStep(partial: Partial<RecordedStep> & { type: StepType }) {
    const step: RecordedStep = {
      ...partial,
      i: this.stepIndex++,
      t_ms: Math.round(performance.now() - this.startTime),
      type: partial.type,
      url: window.location.href,
      viewport: { w: window.innerWidth, h: window.innerHeight },
    };
    this.enqueueSend(step);
  }

  private enqueueSend(step: RecordedStep) {
    this.sendQueue = this.sendQueue.then(() =>
      fetch('/api/record/append-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ run_id: this.runId, task_id: this.taskId, step }),
      }).then(() => {}).catch(err => {
        console.error('[Recorder] Failed to send step:', err);
      })
    );
  }

  private listen(event: string, fn: EventListener, options?: AddEventListenerOptions) {
    document.addEventListener(event, fn, options);
    this.handlers.push({ event, fn, options });
  }
}
