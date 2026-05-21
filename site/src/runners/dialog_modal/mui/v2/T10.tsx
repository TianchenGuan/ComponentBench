'use client';

/**
 * dialog_modal-mui-v2-T10: Nested child scroll — Return to settings
 */

import React, { useState, useRef } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const guideSections = Array.from({ length: 12 }, (_, i) => (
  <Typography key={i} variant="body2" paragraph>
    Update guide section {i + 1}. Breaking changes, migration steps, and rollback notes. Continue
    scrolling inside this dialog to reach the return action.
  </Typography>
));

export default function T10({ onSuccess }: TaskComponentProps) {
  const [parentOpen, setParentOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const successCalledRef = useRef(false);

  const finish = () => {
    setChildOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'return_to_settings_button',
      modal_instance: 'Update guide',
      last_opened_instance: 'Update guide',
      related_instances: { 'Project settings': { open: true } },
    };
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <>
      <Card sx={{ width: 360 }}>
        <CardContent>
          <Button variant="contained" onClick={() => setParentOpen(true)} data-testid="cb-open-project-settings">
            Open project settings
          </Button>
        </CardContent>
      </Card>

      <Dialog open={parentOpen} onClose={() => setParentOpen(false)} aria-labelledby="proj-title">
        <DialogTitle id="proj-title">Project settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Repository defaults and build hooks.
          </Typography>
          <Button variant="outlined" onClick={() => setChildOpen(true)} data-testid="cb-open-update-guide">
            Open update guide
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={childOpen}
        onClose={() => {}}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
        aria-labelledby="guide-title"
      >
        <DialogTitle id="guide-title">Update guide</DialogTitle>
        <DialogContent
          dividers
          sx={{ maxHeight: 300, overflowY: 'auto' }}
          data-testid="cb-update-guide-scroll"
        >
          {guideSections}
          <Button variant="contained" sx={{ mt: 2, mb: 1 }} onClick={finish} data-testid="cb-return-to-settings">
            Return to settings
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
