'use client';

/**
 * dialog_modal-mui-T04: Close a dialog by clicking the backdrop
 *
 * Layout: isolated_card, but the Dialog paper is positioned toward the TOP-LEFT of the viewport.
 * A Material UI Dialog is open on load.
 *
 * Dialog configuration:
 * - Title: "Image preview"
 * - Content: short placeholder text
 * - Actions: none
 * - Escape is disabled for this task, so backdrop click is the intended close path.
 *
 * Initial state: dialog open.
 * Success: The 'Image preview' dialog is closed via backdrop click (close_reason='backdrop_click').
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true); // Dialog starts open
  const [closedBy, setClosedBy] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Image preview',
    };
  }, []);

  const handleClose = (event: object, reason: string) => {
    if (reason === 'backdropClick') {
      setOpen(false);
      setClosedBy('backdrop');
      window.__cbModalState = {
        open: false,
        close_reason: 'mask_click',
        modal_instance: 'Image preview',
      };
      
      // Success when closed via backdrop click
      if (!successCalledRef.current) {
        successCalledRef.current = true;
        setTimeout(() => onSuccess(), 100);
      }
    }
    // Escape is disabled, ignore it
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Gallery" />
        <CardContent>
          <Typography variant="body2">
            Click on an image to preview it.
          </Typography>
        </CardContent>
      </Card>

      {closedBy && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Closed by: {closedBy}
        </Typography>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown={true}
        aria-labelledby="preview-dialog-title"
        PaperProps={{
          sx: {
            position: 'fixed',
            top: 40,
            left: 40,
            m: 0,
          },
        }}
        data-testid="dialog-image-preview"
      >
        <DialogTitle id="preview-dialog-title">Image preview</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This is a preview of your selected image. The actual image would
            be displayed here with full resolution support.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
