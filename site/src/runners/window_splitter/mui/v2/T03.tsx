'use client';

/**
 * window_splitter-mui-v2-T03: Fixed-width pixel range: left pane 284–292 px
 *
 * Settings-style panel with fixed 860px card, Left / Right panes, live `Left width: ###px`.
 * Initial split 430px / 430px. Distractor controls nearby.
 *
 * Success: Left pane width in [284, 292] px inclusive (860px container).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  TextField,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { TwoPanelSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

const CONTAINER_W = 860;

export default function T03({ onSuccess }: TaskComponentProps) {
  const [leftPct, setLeftPct] = useState(50);
  const successFired = useRef(false);

  const leftPx = Math.round((leftPct / 100) * CONTAINER_W);

  const handleLayout = useCallback((layout: Record<string, number>) => {
    const l = layout.left;
    if (l !== undefined) setLeftPct(l);
  }, []);

  useEffect(() => {
    if (successFired.current) return;
    if (leftPx >= 284 && leftPx <= 292) {
      successFired.current = true;
      onSuccess();
    }
  }, [leftPx, onSuccess]);

  return (
    <Box sx={{ width: '100%', maxWidth: 960 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Workspace settings
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
        <Card variant="outlined" sx={{ flex: 1, minWidth: 260 }}>
          <CardHeader title="Notifications" />
          <CardContent>
            <FormControlLabel control={<Switch defaultChecked />} label="Email digests" />
            <TextField size="small" label="Digest hour" defaultValue="09:00" fullWidth sx={{ mt: 2 }} />
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ width: CONTAINER_W, maxWidth: '100%' }}>
          <CardHeader title="Preview pane width" subheader="Fixed-width splitter (860px content)" />
          <CardContent>
            <Box
              sx={{
                width: CONTAINER_W,
                maxWidth: '100%',
                height: 260,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <TwoPanelSplit
                leftId="left"
                rightId="right"
                defaultLeftPct={50}
                onLayoutChange={handleLayout}
                data-testid="fixed-width-splitter"
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
                    <Typography fontWeight={600}>Left</Typography>
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
                    <Typography fontWeight={600}>Right</Typography>
                  </Box>
                }
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5, fontFamily: 'monospace' }}>
              Left width: {leftPx}px
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
