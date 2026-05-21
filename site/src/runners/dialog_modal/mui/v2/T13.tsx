'use client';

/**
 * dialog_modal-mui-v2-T13: Draggable Notes → top-right band
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
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { boundsFromRect, withinTopRightViewport } from './dragBounds';

export default function T13({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  openRef.current = open;

  const pushOpen = (extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Notes',
      last_opened_instance: 'Notes',
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-notes-drag-title"
      cancel=".MuiDialogContent-root,.MuiDialogActions-root,button,a,input,textarea"
      onStart={() => {
        if (!openRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        pushOpen({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
      onStop={() => {
        if (!openRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        pushOpen({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
        if (withinTopRightViewport(r, 40, 40) && !successCalledRef.current) {
          successCalledRef.current = true;
          setTimeout(() => onSuccess(), 100);
        }
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
        {['Queue depth', 'Latency', 'SLO', 'Canary'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Notes
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-open-floating-note">
            Open floating note
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="cb-notes-drag-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="cb-notes-drag-title" sx={{ cursor: 'move', userSelect: 'none' }}>
          Notes
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Floating scratch note. Drag from the title bar only.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
