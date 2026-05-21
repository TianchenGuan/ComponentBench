'use client';

/**
 * dialog_modal-mui-v2-T16: Nested draggable Palette → top-right gutter
 */

import React, { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { boundsFromRect, withinTopRightViewport } from './dragBounds';

export default function T16({ onSuccess }: TaskComponentProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const childOpenRef = useRef(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  childOpenRef.current = childOpen;

  const syncPalette = (extra: Partial<NonNullable<typeof window.__cbModalState>>) => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Palette',
      last_opened_instance: 'Palette',
      related_instances: { 'Layout settings': { open: true } },
      ...extra,
    };
  };

  const PaperComponent = (props: PaperProps) => (
    <Draggable
      nodeRef={paperRef}
      handle="#cb-nested-palette-drag-title"
      cancel=".MuiDialogContent-root,.MuiDialogActions-root,button,a,input,textarea"
      onStart={() => {
        if (!childOpenRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        syncPalette({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
      }}
      onStop={() => {
        if (!childOpenRef.current) return;
        const el = paperRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        syncPalette({ last_drag_source: 'title_bar', modal_bounds: boundsFromRect(r) });
        if (withinTopRightViewport(r, 45, 45) && !successCalledRef.current) {
          successCalledRef.current = true;
          setTimeout(() => onSuccess(), 100);
        }
      }}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-open-layout-settings-nested">
            Open layout settings
          </Button>
        </CardContent>
      </Card>

      <Dialog open={parentOpen} onClose={() => setParentOpen(false)} aria-labelledby="layout-nested-title">
        <DialogTitle id="layout-nested-title">Layout settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Color tokens for this workspace.
          </Typography>
          <Button variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-open-palette-child">
            Open palette
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childOpen}
        onClose={() => setChildOpen(false)}
        PaperComponent={PaperComponent}
        aria-labelledby="cb-nested-palette-drag-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="cb-nested-palette-drag-title" sx={{ cursor: 'move', userSelect: 'none' }}>
          Palette
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Drag this child dialog by the title bar.</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
