'use client';

/**
 * toast_snackbar-mui-T09: Match reference: trigger the Error snackbar (Alert variant)
 *
 * setup_description:
 * Scene is an isolated card titled "Severity snackbars" rendered in **dark theme** with **compact spacing** and **small scale**.
 * A non-interactive "Target sample" at the top shows the Error style (red/error icon) with the label "Error".
 * Below are four icon-only buttons (no text): success, info, warning, error. Each button opens a MUI **Snackbar** whose content is an **Alert** component with corresponding severity and a short message:
 * - Success → "Saved successfully"
 * - Info → "New update available"
 * - Warning → "Storage almost full"
 * - Error → "Sync failed"
 * The task is to open the snackbar that matches the Error sample.
 *
 * success_trigger: A snackbar is visible whose content indicates Error severity with message text exactly "Sync failed".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import type { TaskComponentProps } from '../types';

type Severity = 'success' | 'info' | 'warning' | 'error';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<Severity>('info');
  const [message, setMessage] = useState('');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && severity === 'error' && message === 'Sync failed' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, severity, message, onSuccess]);

  const handleShow = (s: Severity, msg: string) => {
    setSeverity(s);
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Severity snackbars</Typography>

        {/* Target sample */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            Target sample
          </Typography>
          <Box
            data-testid="target-sample"
            id="target_sample_error"
            sx={{
              mt: 1,
              p: 1,
              bgcolor: '#fdeded',
              border: '1px solid #f5c6cb',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <ErrorIcon sx={{ color: '#d32f2f', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#c62828' }}>Error</Typography>
          </Box>
        </Box>

        {/* Icon-only triggers */}
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={() => handleShow('success', 'Saved successfully')}
            data-testid="trigger-success"
            aria-label="Success"
          >
            <CheckCircleIcon sx={{ color: '#2e7d32' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleShow('info', 'New update available')}
            data-testid="trigger-info"
            aria-label="Info"
          >
            <InfoIcon sx={{ color: '#0288d1' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleShow('warning', 'Storage almost full')}
            data-testid="trigger-warning"
            aria-label="Warning"
          >
            <WarningIcon sx={{ color: '#ed6c02' }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleShow('error', 'Sync failed')}
            data-testid="trigger-error"
            aria-label="Error"
          >
            <ErrorIcon sx={{ color: '#d32f2f' }} />
          </IconButton>
        </Stack>
      </CardContent>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
          data-testid="snackbar-alert"
          data-severity={severity}
        >
          <span data-testid="snackbar-message">{message}</span>
        </Alert>
      </Snackbar>
    </Card>
  );
}
