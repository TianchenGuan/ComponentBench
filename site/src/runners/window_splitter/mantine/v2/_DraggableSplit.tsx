'use client';

/**
 * Custom draggable split panel components for Mantine window_splitter tasks.
 * Replaces @gfazioli/mantine-split-pane which has a "beforeRef or afterRef is not defined" bug.
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box } from '@mantine/core';

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

/* ------------------------------------------------------------------ */
/*  Separator visual                                                   */
/* ------------------------------------------------------------------ */

function SepKnob({ vertical }: { vertical?: boolean }) {
  const w = vertical ? 28 : 4;
  const h = vertical ? 4 : 28;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderTop: vertical ? '2px dotted #999' : undefined,
        borderBottom: vertical ? '2px dotted #999' : undefined,
        borderLeft: vertical ? undefined : '2px dotted #999',
        borderRight: vertical ? undefined : '2px dotted #999',
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  HorizSplit — left / right                                          */
/* ------------------------------------------------------------------ */

export interface HorizSplitProps {
  defaultLeftPct?: number;
  leftMin?: number;
  leftMax?: number;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  onLeftPctChange?: (pct: number) => void;
  /** Report raw pixel width of the left pane */
  onLeftPxChange?: (px: number) => void;
  height?: number | string;
  sepWidth?: number;
  'data-testid'?: string;
  style?: React.CSSProperties;
}

export function HorizSplit({
  defaultLeftPct = 50,
  leftMin = 10,
  leftMax = 90,
  leftContent,
  rightContent,
  onLeftPctChange,
  onLeftPxChange,
  height = '100%',
  sepWidth = 8,
  'data-testid': testId,
  style,
}: HorizSplitProps) {
  const [leftPct, setLeftPct] = useState(defaultLeftPct);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    onLeftPctChange?.(leftPct);
    if (containerRef.current && onLeftPxChange) {
      const w = containerRef.current.getBoundingClientRect().width;
      onLeftPxChange(Math.round((leftPct / 100) * w));
    }
  }, [leftPct, onLeftPctChange, onLeftPxChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = clamp(((e.clientX - rect.left) / rect.width) * 100, leftMin, leftMax);
      setLeftPct(Math.round(pct));
    },
    [leftMin, leftMax],
  );

  const handlePointerUp = useCallback(() => { dragging.current = false; }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLeftPct((p) => clamp(p - 1, leftMin, leftMax));
      else if (e.key === 'ArrowRight') setLeftPct((p) => clamp(p + 1, leftMin, leftMax));
    },
    [leftMin, leftMax],
  );

  useEffect(() => {
    const up = () => { dragging.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={testId}
      style={{
        height,
        display: 'flex',
        userSelect: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ flex: `0 0 ${leftPct}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {leftContent}
      </div>
      <div
        tabIndex={0}
        role="separator"
        aria-valuenow={leftPct}
        aria-label="Resize panels"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        style={{
          width: sepWidth,
          flexShrink: 0,
          background: 'var(--mantine-color-gray-3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'col-resize',
          touchAction: 'none',
          outlineOffset: 2,
        }}
      >
        <SepKnob />
      </div>
      <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {rightContent}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  VertSplit — top / bottom                                           */
/* ------------------------------------------------------------------ */

export interface VertSplitProps {
  defaultTopPct?: number;
  topMin?: number;
  topMax?: number;
  topContent: React.ReactNode;
  bottomContent: React.ReactNode;
  onTopPctChange?: (pct: number) => void;
  height?: number | string;
  sepHeight?: number;
  'data-testid'?: string;
  style?: React.CSSProperties;
}

export function VertSplit({
  defaultTopPct = 50,
  topMin = 10,
  topMax = 90,
  topContent,
  bottomContent,
  onTopPctChange,
  height = '100%',
  sepHeight = 8,
  'data-testid': testId,
  style,
}: VertSplitProps) {
  const [topPct, setTopPct] = useState(defaultTopPct);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    onTopPctChange?.(topPct);
  }, [topPct, onTopPctChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = clamp(((e.clientY - rect.top) / rect.height) * 100, topMin, topMax);
      setTopPct(Math.round(pct));
    },
    [topMin, topMax],
  );

  const handlePointerUp = useCallback(() => { dragging.current = false; }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') setTopPct((p) => clamp(p - 1, topMin, topMax));
      else if (e.key === 'ArrowDown') setTopPct((p) => clamp(p + 1, topMin, topMax));
    },
    [topMin, topMax],
  );

  useEffect(() => {
    const up = () => { dragging.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={testId}
      style={{
        height,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ flex: `0 0 ${topPct}%`, width: '100%', overflow: 'hidden', minHeight: 0 }}>
        {topContent}
      </div>
      <div
        tabIndex={0}
        role="separator"
        aria-valuenow={topPct}
        aria-label="Resize panels"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        style={{
          height: sepHeight,
          flexShrink: 0,
          background: 'var(--mantine-color-gray-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'row-resize',
          touchAction: 'none',
          outlineOffset: 2,
        }}
      >
        <SepKnob vertical />
      </div>
      <div style={{ flex: 1, width: '100%', overflow: 'hidden', minHeight: 0 }}>
        {bottomContent}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ThreeHorizSplit — 3 horizontal panes                               */
/* ------------------------------------------------------------------ */

export interface ThreeHorizSplitProps {
  defaultPcts: [number, number, number];
  mins?: [number, number, number];
  contents: [React.ReactNode, React.ReactNode, React.ReactNode];
  onPxChange?: (widths: [number, number, number]) => void;
  onPctChange?: (pcts: [number, number, number]) => void;
  height?: number | string;
  sepWidth?: number;
  sepColor?: string;
  'data-testid'?: string;
  style?: React.CSSProperties;
}

export function ThreeHorizSplit({
  defaultPcts,
  mins = [8, 12, 8],
  contents,
  onPxChange,
  onPctChange,
  height = '100%',
  sepWidth = 6,
  sepColor,
  'data-testid': testId,
  style,
}: ThreeHorizSplitProps) {
  const [pcts, setPcts] = useState(defaultPcts);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSep = useRef<0 | 1 | null>(null);

  useEffect(() => {
    onPctChange?.(pcts);
    if (containerRef.current && onPxChange) {
      const w = containerRef.current.getBoundingClientRect().width;
      onPxChange([
        Math.round((pcts[0] / 100) * w),
        Math.round((pcts[1] / 100) * w),
        Math.round((pcts[2] / 100) * w),
      ]);
    }
  }, [pcts, onPctChange, onPxChange]);

  const handlePointerDown = useCallback((sepIdx: 0 | 1) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    activeSep.current = sepIdx;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeSep.current === null || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const sep = activeSep.current;
      setPcts((prev) => {
        const next = [...prev] as [number, number, number];
        if (sep === 0) {
          const newFirst = clamp(x, mins[0], 100 - mins[1] - mins[2]);
          const delta = newFirst - prev[0];
          next[0] = newFirst;
          next[1] = clamp(prev[1] - delta, mins[1], 90);
          next[2] = 100 - next[0] - next[1];
          if (next[2] < mins[2]) { next[2] = mins[2]; next[1] = 100 - next[0] - next[2]; }
        } else {
          const boundary = x;
          const newThird = clamp(100 - boundary, mins[2], 100 - mins[0] - mins[1]);
          const delta = newThird - prev[2];
          next[2] = newThird;
          next[1] = clamp(prev[1] - delta, mins[1], 90);
          next[0] = 100 - next[1] - next[2];
          if (next[0] < mins[0]) { next[0] = mins[0]; next[1] = 100 - next[0] - next[2]; }
        }
        return [Math.round(next[0]), Math.round(next[1]), Math.round(next[2])];
      });
    },
    [mins],
  );

  const handlePointerUp = useCallback(() => { activeSep.current = null; }, []);

  useEffect(() => {
    const up = () => { activeSep.current = null; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  const bg = sepColor ?? 'var(--mantine-color-gray-4)';

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={testId}
      style={{ height, display: 'flex', userSelect: 'none', overflow: 'hidden', ...style }}
    >
      <div style={{ flex: `0 0 ${pcts[0]}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[0]}
      </div>
      <div
        tabIndex={0}
        role="separator"
        onPointerDown={handlePointerDown(0)}
        style={{
          width: sepWidth, flexShrink: 0, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'col-resize', touchAction: 'none',
        }}
      >
        <SepKnob />
      </div>
      <div style={{ flex: `0 0 ${pcts[1]}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[1]}
      </div>
      <div
        tabIndex={0}
        role="separator"
        onPointerDown={handlePointerDown(1)}
        style={{
          width: sepWidth, flexShrink: 0, background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'col-resize', touchAction: 'none',
        }}
      >
        <SepKnob />
      </div>
      <div style={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[2]}
      </div>
    </div>
  );
}
