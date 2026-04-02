'use client';

/**
 * dialog_modal-mui-v2-T14: Inspector → bottom-left band + Save layout
 */

import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { boundsFromRect, withinBottomLeftViewport } from './dragBounds';

export default function T14({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  openRef.current = open;

  const sync = (extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Inspector',
      last_opened_instance: 'Inspector',
      layout_saved: false,
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-inspector-drag-title"
      cancel=".MuiDialogContent-root,.MuiDialogActions-root,button,a,input,textarea"
      onStart={() => {
        if (!openRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        sync({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
      onStop={() => {
        if (!openRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        sync({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  const saveLayout = () => {
    if (successCalledRef.current) return;
    const el = paperRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!withinBottomLeftViewport(r, 50, 50)) return;
    sync({
      last_drag_source: 'title_bar',
      modal_bounds: boundsFromRect(r),
      layout_saved: true,
    });
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
        {['Dark', 'EU', 'Audit'].map((l) => (
          <Chip key={l} size="small" label={l} />
        ))}
      </Stack>
      <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-open-inspector">
        Open inspector
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="cb-inspector-drag-title"
        maxWidth="sm"
        fullWidth
        sx={{ '& .MuiDialog-paper': { ml: 'auto' } }}
      >
        <DialogTitle id="cb-inspector-drag-title" sx={{ cursor: 'move', userSelect: 'none' }}>
          Inspector
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Drag via title bar into the bottom-left band, then save.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={saveLayout} variant="contained" data-testid="cb-save-layout">
            Save layout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
