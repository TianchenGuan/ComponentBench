'use client';

/**
 * window_splitter-mui-v2-T08: Nested splitters — inner "Preview / History" only
 *
 * Card "Nested layout": outer Navigation | Workspace (32/68). Inside Workspace, inner
 * "Preview / History" (Preview left). Both readouts visible. Only inner Preview should move to target.
 *
 * Success: Preview (left) 29% ±1% within inner instance "Preview / History"; outer Navigation stays 32% ±1%.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, Stack } from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [outerNav, setOuterNav] = useState(32);
  const [innerPreview, setInnerPreview] = useState(50);
  const successFired = useRef(false);

  const onOuterLayout = useCallback((layout: Record<string, number>) => {
    const n = layout.outer_navigation;
    if (n !== undefined) setOuterNav(n);
  }, []);

  const onInnerLayout = useCallback((layout: Record<string, number>) => {
    const p = layout.inner_preview;
    if (p !== undefined) setInnerPreview(p);
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    const outerOk = outerNav >= 31 && outerNav <= 33;
    const innerOk = innerPreview >= 28 && innerPreview <= 30;
    if (outerOk && innerOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [outerNav, innerPreview, onSuccess]);

  return (
    <Card sx={{ width: 720, maxWidth: '100%' }} variant="outlined">
      <CardHeader title="Nested layout" subheader="Dashboard panel" />
      <CardContent>
        <Box
          sx={{ height: 320, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}
          data-testid="nested-split-root"
        >
          <TwoPanelSplit
            leftId="outer_navigation"
            rightId="outer_workspace"
            defaultLeftPct={32}
            leftMin={18}
            leftMax={45}
            onLayoutChange={onOuterLayout}
            leftContent={
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  p: 1,
                }}
              >
                <Typography fontWeight={600} textAlign="center">Navigation</Typography>
              </Box>
            }
            rightContent={
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1, boxSizing: 'border-box' }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }} data-instance-label="Preview / History">
                  Preview / History
                </Typography>
                <Box sx={{ flex: 1, minHeight: 0, border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1 }}>
                  <TwoPanelSplit
                    leftId="inner_preview"
                    rightId="inner_history"
                    defaultLeftPct={50}
                    leftMin={12}
                    leftMax={88}
                    onLayoutChange={onInnerLayout}
                    separatorColor="#d0d0d0"
                    separatorHoverColor="#b0b0b0"
                    dotColor="#666"
                    leftContent={
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.200',
                        }}
                      >
                        <Typography fontWeight={600}>Preview</Typography>
                      </Box>
                    }
                    rightContent={
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'action.hover',
                        }}
                      >
                        <Typography fontWeight={600}>History</Typography>
                      </Box>
                    }
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, textAlign: 'center' }}>
                  Inner · Preview: {innerPreview.toFixed(0)}% · History: {(100 - innerPreview).toFixed(0)}%
                </Typography>
              </Box>
            }
          />
        </Box>
        <Stack spacing={0.5} sx={{ mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Outer · Navigation: {outerNav.toFixed(0)}% · Workspace: {(100 - outerNav).toFixed(0)}%
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
