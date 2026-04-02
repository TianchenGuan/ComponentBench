'use client';

/**
 * Custom draggable split panel components for MUI window_splitter tasks.
 * Replaces react-resizable-panels which has pointer-event issues in certain containers.
 */

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

const SEP_WIDTH = 8;

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

const separatorBaseSx = {
  width: SEP_WIDTH,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'col-resize',
  touchAction: 'none',
  outlineOffset: 2,
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
  },
};

function SepDots({ color = '#999', height = 24 }: { color?: string; height?: number }) {
  return (
    <Box
      sx={{
        width: 4,
        height,
        borderLeft: `2px dotted ${color}`,
        borderRight: `2px dotted ${color}`,
        pointerEvents: 'none',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  TwoPanelSplit                                                      */
/* ------------------------------------------------------------------ */

export interface TwoPanelSplitProps {
  leftId: string;
  rightId: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  defaultLeftPct?: number;
  leftMin?: number;
  leftMax?: number;
  collapsible?: boolean;
  collapsedSize?: number;
  onLayoutChange?: (layout: Record<string, number>) => void;
  height?: number | string;
  separatorColor?: string;
  separatorHoverColor?: string;
  dotColor?: string;
  'data-testid'?: string;
  containerSx?: Record<string, unknown>;
}

export function TwoPanelSplit({
  leftId,
  rightId,
  leftContent,
  rightContent,
  defaultLeftPct = 50,
  leftMin = 10,
  leftMax = 90,
  collapsible = false,
  collapsedSize = 0,
  onLayoutChange,
  height = '100%',
  separatorColor = '#e0e0e0',
  separatorHoverColor = '#bdbdbd',
  dotColor = '#999',
  'data-testid': testId,
  containerSx,
}: TwoPanelSplitProps) {
  const [leftPct, setLeftPct] = useState(defaultLeftPct);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const rightPct = 100 - leftPct;

  useEffect(() => {
    onLayoutChange?.({ [leftId]: leftPct, [rightId]: rightPct });
  }, [leftPct, rightPct, leftId, rightId, onLayoutChange]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let pct = (x / rect.width) * 100;
      if (collapsible && pct < collapsedSize + 2) {
        pct = collapsedSize;
      } else {
        pct = clamp(pct, leftMin, leftMax);
      }
      setLeftPct(Math.round(pct));
    },
    [leftMin, leftMax, collapsible, collapsedSize],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLeftPct((p) => {
          if (collapsible && p <= leftMin) return collapsedSize;
          return clamp(p - 1, leftMin, leftMax);
        });
      } else if (e.key === 'ArrowRight') {
        setLeftPct((p) => {
          if (collapsible && p <= collapsedSize) return leftMin;
          return clamp(p + 1, leftMin, leftMax);
        });
      }
    },
    [leftMin, leftMax, collapsible, collapsedSize],
  );

  useEffect(() => {
    const up = () => { dragging.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  return (
    <Box
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={testId}
      sx={{
        height,
        display: 'flex',
        userSelect: 'none',
        overflow: 'hidden',
        ...containerSx,
      }}
    >
      <Box sx={{ flex: `0 0 ${leftPct}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {leftContent}
      </Box>
      <Box
        tabIndex={0}
        role="separator"
        aria-valuenow={leftPct}
        aria-label="Resize panels"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        sx={{
          ...separatorBaseSx,
          background: separatorColor,
          '&:hover': { background: separatorHoverColor },
        }}
      >
        <SepDots color={dotColor} />
      </Box>
      <Box sx={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {rightContent}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/*  ThreePanelSplit                                                    */
/* ------------------------------------------------------------------ */

export interface ThreePanelSplitProps {
  ids: [string, string, string];
  contents: [React.ReactNode, React.ReactNode, React.ReactNode];
  defaultPcts: [number, number, number];
  mins?: [number, number, number];
  maxs?: [number, number, number];
  onLayoutChange?: (layout: Record<string, number>) => void;
  height?: number | string;
  separatorColor?: string;
  separatorHoverColor?: string;
  dotColor?: string;
  'data-testid'?: string;
}

export function ThreePanelSplit({
  ids,
  contents,
  defaultPcts,
  mins = [8, 15, 8],
  maxs = [85, 90, 85],
  onLayoutChange,
  height = '100%',
  separatorColor = '#bdbdbd',
  separatorHoverColor = '#9e9e9e',
  dotColor = '#757575',
  'data-testid': testId,
}: ThreePanelSplitProps) {
  const [pcts, setPcts] = useState(defaultPcts);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeSep = useRef<0 | 1 | null>(null);

  useEffect(() => {
    onLayoutChange?.({ [ids[0]]: pcts[0], [ids[1]]: pcts[1], [ids[2]]: pcts[2] });
  }, [pcts, ids, onLayoutChange]);

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
          next[1] = clamp(prev[1] - delta, mins[1], maxs[1]);
          next[2] = 100 - next[0] - next[1];
          if (next[2] < mins[2]) {
            next[2] = mins[2];
            next[1] = 100 - next[0] - next[2];
          }
        } else {
          const boundary = x;
          const newThird = clamp(100 - boundary, mins[2], 100 - mins[0] - mins[1]);
          const delta = newThird - prev[2];
          next[2] = newThird;
          next[1] = clamp(prev[1] - delta, mins[1], maxs[1]);
          next[0] = 100 - next[1] - next[2];
          if (next[0] < mins[0]) {
            next[0] = mins[0];
            next[1] = 100 - next[0] - next[2];
          }
        }
        return [Math.round(next[0]), Math.round(next[1]), Math.round(next[2])];
      });
    },
    [mins, maxs],
  );

  const handlePointerUp = useCallback(() => {
    activeSep.current = null;
  }, []);

  useEffect(() => {
    const up = () => { activeSep.current = null; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  const handleKeyDown = useCallback(
    (sepIdx: 0 | 1) => (e: React.KeyboardEvent) => {
      setPcts((prev) => {
        const next = [...prev] as [number, number, number];
        const delta = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
        if (!delta) return prev;
        if (sepIdx === 0) {
          next[0] = clamp(prev[0] + delta, mins[0], 100 - mins[1] - mins[2]);
          next[1] = clamp(prev[1] - delta, mins[1], maxs[1]);
          next[2] = 100 - next[0] - next[1];
        } else {
          next[2] = clamp(prev[2] - delta, mins[2], 100 - mins[0] - mins[1]);
          next[1] = clamp(prev[1] + delta, mins[1], maxs[1]);
          next[0] = 100 - next[1] - next[2];
        }
        return [Math.round(next[0]), Math.round(next[1]), Math.round(next[2])];
      });
    },
    [mins, maxs],
  );

  return (
    <Box
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={testId}
      sx={{
        height,
        display: 'flex',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flex: `0 0 ${pcts[0]}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[0]}
      </Box>
      <Box
        tabIndex={0}
        role="separator"
        aria-valuenow={pcts[0]}
        aria-label={`Resize ${ids[0]} and ${ids[1]}`}
        onPointerDown={handlePointerDown(0)}
        onKeyDown={handleKeyDown(0)}
        sx={{
          ...separatorBaseSx,
          width: 4,
          background: separatorColor,
          '&:hover': { background: separatorHoverColor },
        }}
      >
        <SepDots color={dotColor} height={20} />
      </Box>
      <Box sx={{ flex: `0 0 ${pcts[1]}%`, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[1]}
      </Box>
      <Box
        tabIndex={0}
        role="separator"
        aria-valuenow={pcts[1] + pcts[0]}
        aria-label={`Resize ${ids[1]} and ${ids[2]}`}
        onPointerDown={handlePointerDown(1)}
        onKeyDown={handleKeyDown(1)}
        sx={{
          ...separatorBaseSx,
          width: 4,
          background: separatorColor,
          '&:hover': { background: separatorHoverColor },
        }}
      >
        <SepDots color={dotColor} height={20} />
      </Box>
      <Box sx={{ flex: 1, height: '100%', overflow: 'hidden', minWidth: 0 }}>
        {contents[2]}
      </Box>
    </Box>
  );
}
