'use client';

/**
 * window_splitter-mui-v2-T01: Keyboard-accessible separator: set Inspector to 24% and save
 *
 * Modal flow: "Customize layout" opens a MUI Dialog with Canvas (left) / Inspector (right),
 * a custom draggable separator, hint "This divider supports keyboard adjustment", live split
 * readout. Inspector starts at 40%. Footer: Cancel / Save changes. Draft until Save.
 *
 * Success: Inspector (right) 24% ±1% and "Save changes" clicked (committed).
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [inspectorPct, setInspectorPct] = useState(40);
  const canvasPct = 100 - inspectorPct;
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const successFired = useRef(false);

  const openDialog = () => {
    setInspectorPct(40);
    setOpen(true);
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(85, Math.max(15, (x / rect.width) * 100));
    setInspectorPct(Math.round(100 - pct));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setInspectorPct((p) => Math.min(85, p + 1));
    } else if (e.key === 'ArrowRight') {
      setInspectorPct((p) => Math.max(15, p - 1));
    }
  }, []);

  useEffect(() => {
    const up = () => { dragging.current = false; };
    window.addEventListener('pointerup', up);
    return () => window.removeEventListener('pointerup', up);
  }, []);

  const handleSave = () => {
    if (successFired.current) return;
    if (inspectorPct >= 23 && inspectorPct <= 25) {
      successFired.current = true;
      onSuccess();
    }
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 520 }} data-testid="modal-flow-layout-card">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="caption" color="text.secondary">
            Workspace · Appearance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tune the editor chrome. Changes stay draft until you save.
          </Typography>
          <Button variant="contained" size="small" onClick={openDialog}>
            Customize layout
          </Button>
        </Stack>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
          disableScrollLock
          disableEnforceFocus
          slotProps={{
            paper: { sx: { overflow: 'visible' } },
          }}
        >
          <DialogTitle>Customize layout</DialogTitle>
          <DialogContent sx={{ overflow: 'visible' }}>
            <Box
              ref={containerRef}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              sx={{
                height: 300,
                minHeight: 300,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 1,
                mt: 1,
                display: 'flex',
                position: 'relative',
                userSelect: 'none',
              }}
              data-testid="splitter-customize-dialog"
            >
              {/* Canvas panel */}
              <Box
                sx={{
                  flex: `0 0 ${canvasPct}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'action.hover',
                  overflow: 'hidden',
                }}
              >
                <Typography fontWeight={600}>Canvas</Typography>
              </Box>

              {/* Draggable separator */}
              <Box
                tabIndex={0}
                role="separator"
                aria-valuenow={inspectorPct}
                aria-valuemin={15}
                aria-valuemax={85}
                aria-label="Resize panels"
                onPointerDown={handlePointerDown}
                onKeyDown={handleKeyDown}
                sx={{
                  width: 12,
                  flexShrink: 0,
                  background: '#e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'col-resize',
                  touchAction: 'none',
                  outlineOffset: 2,
                  '&:hover': { background: '#bdbdbd' },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 28,
                    borderLeft: '2px dotted #757575',
                    borderRight: '2px dotted #757575',
                    pointerEvents: 'none',
                  }}
                />
              </Box>

              {/* Inspector panel */}
              <Box
                sx={{
                  flex: `0 0 ${inspectorPct}%`,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.200',
                  overflow: 'hidden',
                }}
              >
                <Typography fontWeight={600}>Inspector</Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              This divider supports keyboard adjustment
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
              Canvas: {canvasPct}% • Inspector: {inspectorPct}%
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save changes
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
