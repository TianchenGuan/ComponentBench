'use client';

/**
 * tooltip-mui-T10: Follow-cursor tooltip disambiguation between two boxes
 *
 * Light theme, comfortable spacing, dashboard layout anchored to the bottom-left of the viewport.
 * Two rectangular status boxes are shown side by side:
 * - "Production" box → Tooltip (followCursor=true) title "Live traffic"
 * - "Staging" box → Tooltip (followCursor=true) title "Requests routed to staging" (TARGET)
 * A small non-interactive Hint box on the page visually shows a tooltip bubble with the target text for comparison.
 * Because followCursor is enabled, the tooltip moves with the pointer while hovering over the box.
 * Instances: 2 tooltips. Clutter: low (a legend and a refresh button that are not required). Initial state: no tooltip visible.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, Card, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Requests routed to staging')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Environment Status</Typography>
          <IconButton size="small">
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Tooltip title="Live traffic" followCursor>
            <Box
              sx={{
                flex: 1,
                p: 3,
                background: '#e8f5e9',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid #4caf50',
              }}
              data-testid="tooltip-trigger-production"
            >
              <Typography variant="subtitle1" fontWeight={500}>Production</Typography>
              <Typography variant="h4" color="success.main">98.5%</Typography>
              <Typography variant="caption" color="text.secondary">uptime</Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Requests routed to staging" followCursor>
            <Box
              sx={{
                flex: 1,
                p: 3,
                background: '#fff3e0',
                borderRadius: 2,
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid #ff9800',
              }}
              data-testid="tooltip-trigger-staging"
            >
              <Typography variant="subtitle1" fontWeight={500}>Staging</Typography>
              <Typography variant="h4" color="warning.main">92.1%</Typography>
              <Typography variant="caption" color="text.secondary">uptime</Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#4caf50' }} />
              <Typography variant="caption">Healthy</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: '#ff9800' }} />
              <Typography variant="caption">Warning</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              background: 'rgba(97, 97, 97, 0.92)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Hint: </Typography>
            Requests routed to staging
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
