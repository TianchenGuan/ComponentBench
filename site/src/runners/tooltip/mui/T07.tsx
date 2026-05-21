'use client';

/**
 * tooltip-mui-T07: Match reference tooltip among three actions
 *
 * Light theme, comfortable spacing, isolated card anchored near the top-right of the viewport.
 * Three MUI IconButtons are aligned horizontally, each wrapped in a Tooltip:
 * - Download icon → "Download CSV"
 * - Upload icon → "Upload file"
 * - Sync icon → "Sync now"
 * A separate "Reference" panel shows a static tooltip bubble with the target text.
 * Instances: 3 tooltips. Initial state: none visible. The target must be found by opening tooltips and comparing to the visual reference.
 */

import React, { useEffect, useRef } from 'react';
import { Tooltip, IconButton, Card, CardContent, Typography, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SyncIcon from '@mui/icons-material/Sync';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Upload file')) {
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
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Typography variant="subtitle2" gutterBottom>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Download CSV">
                <IconButton data-testid="tooltip-trigger-download">
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload file">
                <IconButton data-testid="tooltip-trigger-upload">
                  <UploadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sync now">
                <IconButton data-testid="tooltip-trigger-sync">
                  <SyncIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </div>

          <Box
            id="reference-tooltip-2"
            sx={{
              background: 'rgba(97, 97, 97, 0.92)',
              color: '#fff',
              padding: '6px 10px',
              borderRadius: 1,
              fontSize: 14,
              position: 'relative',
            }}
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 0.5 }}>
              Reference
            </Typography>
            Upload file
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
