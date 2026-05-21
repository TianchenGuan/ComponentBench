'use client';

/**
 * alert_dialog_confirm-mui-T09: Choose the correct danger card by mixed guidance and confirm
 *
 * Dashboard layout with high clutter: a grid of cards shows system status, charts, and recent activity (all non-interactive or irrelevant).
 *
 * In a "Danger actions" row, there are THREE small cards (three instances) with similar styling and icon-only primary buttons:
 * - "Purge cache"
 * - "Disable sync"
 * - "Delete logs"
 *
 * Each card's icon button opens a Material UI Dialog with title matching the card (e.g., "Delete logs?") and actions "Cancel" and "Confirm".
 *
 * A "Hint" panel on the right provides mixed guidance:
 * - A short text instruction like "Target action: Delete logs"
 * - A small icon preview that matches the card's icon style
 *
 * The agent must select the correct card using the hint panel, open its dialog, and click "Confirm".
 *
 * Note: The hint target is "delete_logs"
 */

import React, { useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CachedIcon from '@mui/icons-material/Cached';
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const successCalledRef = useRef(false);
  const hintTarget = 'delete_logs';

  // Store hint target for checker
  if (typeof window !== 'undefined') {
    (window as any).__cbHintTarget = hintTarget;
  }

  const actions = [
    { id: 'purge_cache', label: 'Purge cache', icon: <CachedIcon /> },
    { id: 'disable_sync', label: 'Disable sync', icon: <SyncDisabledIcon /> },
    { id: 'delete_logs', label: 'Delete logs', icon: <DeleteIcon /> },
  ];

  const handleOpen = (actionId: string) => {
    setCurrentAction(actionId);
    setDialogOpen(true);
    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: actionId,
    };
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    if (currentAction === 'delete_logs' && !successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: currentAction,
      };
      onSuccess();
    } else if (currentAction) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: currentAction,
      };
    }
    setCurrentAction(null);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    if (currentAction) {
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'cancel',
        dialog_instance: currentAction,
      };
    }
    setCurrentAction(null);
  };

  const getDialogTitle = () => {
    const action = actions.find(a => a.id === currentAction);
    return action ? `${action.label}?` : '';
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Dashboard content with clutter */}
        <Box sx={{ flex: 1 }}>
          {/* Status cards (clutter) */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Card sx={{ height: 80, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="caption">CPU Usage</Typography>
                  <Typography variant="h6">45%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: 80, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="caption">Memory</Typography>
                  <Typography variant="h6">2.4 GB</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: 80, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="caption">Uptime</Typography>
                  <Typography variant="h6">14d</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Danger actions row */}
          <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
            Danger actions
          </Typography>
          <Grid container spacing={2}>
            {actions.map((action) => (
              <Grid item xs={4} key={action.id}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      {action.label}
                    </Typography>
                    <IconButton
                      color="error"
                      onClick={() => handleOpen(action.id)}
                      data-testid={`cb-open-${action.id.replace('_', '-')}`}
                      data-cb-instance={action.id}
                    >
                      {action.icon}
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Hint panel */}
        <Card sx={{ width: 200 }} data-cb-hint-target="delete_logs">
          <CardHeader title="Hint" titleTypographyProps={{ variant: 'subtitle2' }} />
          <CardContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Target action: <strong>Delete logs</strong>
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <DeleteIcon color="error" fontSize="large" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        aria-labelledby="danger-action-dialog-title"
        data-testid="dialog-danger-action"
      >
        <DialogTitle id="danger-action-dialog-title">{getDialogTitle()}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Are you sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} data-testid="cb-cancel">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="error" variant="contained" data-testid="cb-confirm">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
