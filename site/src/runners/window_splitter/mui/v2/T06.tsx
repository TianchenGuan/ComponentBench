'use client';

/**
 * window_splitter-mui-v2-T06: Collapse Navigator, reopen, finish at 17%
 *
 * Navigator (left) collapsible with collapsedSize 0; Content (right). Initial 28/72.
 * Readout shows percentages and collapsed state.
 *
 * Success: collapse_cycle_completed (Navigator was collapsed) and Navigator 17% ±1%, not collapsed.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, Box, Typography } from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [navPct, setNavPct] = useState(28);
  const collapseSeen = useRef(false);
  const successFired = useRef(false);

  const handleLayout = useCallback((layout: Record<string, number>) => {
    const n = layout.navigator;
    if (n !== undefined) setNavPct(n);
  }, []);

  useEffect(() => {
    if (navPct <= 1) collapseSeen.current = true;
  }, [navPct]);

  useEffect(() => {
    if (successFired.current) return;
    const expanded = navPct > 1;
    if (collapseSeen.current && expanded && navPct >= 16 && navPct <= 18) {
      successFired.current = true;
      onSuccess();
    }
  }, [navPct, onSuccess]);

  const collapsed = navPct <= 1;

  return (
    <Card sx={{ width: 640, maxWidth: '100%' }} variant="outlined">
      <CardHeader title="Navigator layout" subheader="Settings panel" />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Distractor: toggle row placeholder
          </Typography>
        </Box>
        <Box
          sx={{ height: 280, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}
        >
          <TwoPanelSplit
            leftId="navigator"
            rightId="content"
            defaultLeftPct={28}
            leftMin={12}
            leftMax={85}
            collapsible
            collapsedSize={0}
            onLayoutChange={handleLayout}
            data-testid="navigator-splitter"
            leftContent={
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                }}
              >
                {!collapsed && <Typography fontWeight={600}>Navigator</Typography>}
              </Box>
            }
            rightContent={
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                }}
              >
                <Typography fontWeight={600}>Content</Typography>
              </Box>
            }
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 1.5, textAlign: 'center' }}>
          Navigator: {collapsed ? 'collapsed' : `${navPct.toFixed(0)}%`} · Content:{' '}
          {collapsed ? '—' : `${(100 - navPct).toFixed(0)}%`}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
          Collapse state: {collapsed ? 'collapsed' : 'expanded'}
        </Typography>
      </CardContent>
    </Card>
  );
}
