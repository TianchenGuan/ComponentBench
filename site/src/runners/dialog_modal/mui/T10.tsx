'use client';

/**
 * dialog_modal-mui-T10: Open the dialog that matches a reference icon
 *
 * Layout: dashboard with multiple cards and controls. Realistic clutter.
 *
 * At the top there is a "Reference icon" indicator showing a TRIANGLE.
 *
 * There are three buttons, each with a distinct icon:
 * 1) "Open Status" (circle icon) → Dialog title "Status" with circle icon
 * 2) "Open Alerts" (triangle icon) → Dialog title "Alerts" with triangle icon
 * 3) "Open Logs" (square icon) → Dialog title "Logs" with square icon
 *
 * Initial state: no dialogs open.
 * Success: The dialog with TRIANGLE icon (title 'Alerts') is open/visible.
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import SquareIcon from '@mui/icons-material/Square';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenStatus = () => {
    setStatusOpen(true);
    setAlertsOpen(false);
    setLogsOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Status',
    };
  };

  const handleOpenAlerts = () => {
    setAlertsOpen(true);
    setStatusOpen(false);
    setLogsOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Alerts',
    };
    
    // Success when Alerts (triangle) dialog opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleOpenLogs = () => {
    setLogsOpen(true);
    setStatusOpen(false);
    setAlertsOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Logs',
    };
  };

  const handleClose = (modal: string) => {
    if (modal === 'status') setStatusOpen(false);
    if (modal === 'alerts') setAlertsOpen(false);
    if (modal === 'logs') setLogsOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: modal,
    };
  };

  return (
    <>
      {/* Reference icon indicator */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            Target dialog icon:
          </Typography>
          <ChangeHistoryIcon data-icon="triangle" color="warning" />
        </CardContent>
      </Card>

      {/* Dashboard with clutter */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search..."
          disabled
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="System" titleTypographyProps={{ variant: 'subtitle2' }} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Monitor system health.
              </Typography>
              <Button
                startIcon={<CircleIcon />}
                onClick={handleOpenStatus}
                variant="outlined"
                size="small"
                data-testid="cb-open-status"
              >
                Open Status
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={4}>
          <Card>
            <CardHeader title="Monitoring" titleTypographyProps={{ variant: 'subtitle2' }} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                View active alerts.
              </Typography>
              <Button
                startIcon={<ChangeHistoryIcon />}
                onClick={handleOpenAlerts}
                variant="outlined"
                size="small"
                data-testid="cb-open-alerts"
              >
                Open Alerts
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={4}>
          <Card>
            <CardHeader title="History" titleTypographyProps={{ variant: 'subtitle2' }} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Browse activity logs.
              </Typography>
              <Button
                startIcon={<SquareIcon />}
                onClick={handleOpenLogs}
                variant="outlined"
                size="small"
                data-testid="cb-open-logs"
              >
                Open Logs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Dialog - Circle icon */}
      <Dialog
        open={statusOpen}
        onClose={() => handleClose('status')}
        aria-labelledby="status-dialog-title"
        data-testid="dialog-status"
        data-icon="circle"
      >
        <DialogTitle id="status-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircleIcon color="success" />
          Status
        </DialogTitle>
        <DialogContent>
          <Typography>All systems are operational.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('status')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Alerts Dialog - Triangle icon */}
      <Dialog
        open={alertsOpen}
        onClose={() => handleClose('alerts')}
        aria-labelledby="alerts-dialog-title"
        data-testid="dialog-alerts"
        data-icon="triangle"
      >
        <DialogTitle id="alerts-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChangeHistoryIcon color="warning" />
          Alerts
        </DialogTitle>
        <DialogContent>
          <Typography>No active alerts at this time.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('alerts')}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Logs Dialog - Square icon */}
      <Dialog
        open={logsOpen}
        onClose={() => handleClose('logs')}
        aria-labelledby="logs-dialog-title"
        data-testid="dialog-logs"
        data-icon="square"
      >
        <DialogTitle id="logs-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SquareIcon color="info" />
          Logs
        </DialogTitle>
        <DialogContent>
          <Typography>Recent activity log entries.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose('logs')}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
