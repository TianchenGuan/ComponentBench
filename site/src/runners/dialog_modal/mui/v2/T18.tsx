'use client';

/**
 * dialog_modal-mui-v2-T18: Toast preview → left-center band
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
import { boundsFromRect, withinLeftCenterBand } from './dragBounds';

export default function T18({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  openRef.current = open;

  const pushOpen = (extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Toast preview',
      last_opened_instance: 'Toast preview',
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-toast-preview-drag-title"
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
        if (withinLeftCenterBand(r, 45, 45) && !successCalledRef.current) {
          successCalledRef.current = true;
          setTimeout(() => onSuccess(), 100);
        }
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  return (
    <Box sx={{ maxWidth: 560 }}>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
        {['Inbox', 'Mentions', 'Digest'].map((l) => (
          <Chip key={l} size="small" label={l} variant="outlined" />
        ))}
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Notifications
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)} data-testid="cb-open-toast-preview">
            Open toast preview
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="cb-toast-preview-drag-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="cb-toast-preview-drag-title" sx={{ cursor: 'move', userSelect: 'none' }}>
          Toast preview
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Sample toast layout. Drag using the title bar.</Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
