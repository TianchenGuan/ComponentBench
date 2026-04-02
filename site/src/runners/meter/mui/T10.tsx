'use client';

/**
 * meter-mui-T10: Match Primary Storage meter to reference in dark dashboard and Save (MUI)
 *
 * Setup Description:
 * A dark-themed dashboard shows multiple cards; one card titled "Storage" contains several meters.
 * - Theme: dark.
 * - Layout: dashboard; placement center.
 * - Clutter: high (navigation rail, card menus, and other cards with buttons and charts).
 * - Component: within the Storage card there are three MUI LinearProgress meters labeled:
 *   * "Storage Used (Primary)" (interactive target)
 *   * "Storage Used (Secondary)" (interactive distractor)
 *   * "Storage Used (Archive)" (interactive distractor)
 * - Guidance: mixed. A reference bar swatch labeled "Reference level" is shown above the meters, and 
 *   the Primary row has a subtle outline highlight.
 * - Observability: numeric labels are hidden; only bar fill is visible unless you hover for a tooltip.
 * - Confirmation: a "Save" button in the card header commits the Primary value.
 * - Initial state: Primary=20%, Secondary=55%, Archive=80%; reference corresponds to ~72%.
 * - Feedback: after Save, a toast "Saved" appears and the highlight outline disappears.
 *
 * Success: Storage Used (Primary) matches the reference bar (±1 percentage point). Save has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Grid, Tooltip, Snackbar, Alert, Badge } from '@mui/material';
import type { TaskComponentProps } from '../types';

const REFERENCE_VALUE = 72;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState(20);
  const [secondary, setSecondary] = useState(55);
  const [archive, setArchive] = useState(80);
  const [committed, setCommitted] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (committed && Math.abs(primary - REFERENCE_VALUE) <= 1 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primary, committed, onSuccess]);

  const handlePrimaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPrimary(Math.max(0, Math.min(100, percent)));
    setHasUnsavedChanges(true);
    setCommitted(false);
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setSecondary(Math.max(0, Math.min(100, percent)));
  };

  const handleArchiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setArchive(Math.max(0, Math.min(100, percent)));
  };

  const handleSave = () => {
    setCommitted(true);
    setHasUnsavedChanges(false);
    setShowSaved(true);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ width: 800 }}>
        {/* Distractor card */}
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ p: 2, height: 200 }}>
            <Typography variant="subtitle2" gutterBottom>CPU Usage</Typography>
            <Box sx={{ height: 120, bgcolor: 'action.hover', borderRadius: 1 }} />
            <Button size="small" sx={{ mt: 1 }}>Refresh</Button>
          </Paper>
        </Grid>

        {/* Storage card - target */}
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2">
                Storage
                {hasUnsavedChanges && (
                  <Badge color="warning" variant="dot" sx={{ ml: 1 }} />
                )}
              </Typography>
              <Button size="small" variant="contained" onClick={handleSave} data-testid="storage-save">
                Save
              </Button>
            </Box>

            {/* Reference bar */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Reference level</Typography>
              <Box sx={{ height: 8, bgcolor: 'action.hover', borderRadius: 1, overflow: 'hidden', mt: 0.5 }}>
                <Box sx={{ width: `${REFERENCE_VALUE}%`, height: '100%', bgcolor: 'success.main', borderRadius: 1 }} />
              </Box>
            </Box>

            {/* Primary meter */}
            <Box sx={{ mb: 1.5, p: 1, border: hasUnsavedChanges ? '1px solid' : 'none', borderColor: 'primary.main', borderRadius: 1 }}>
              <Typography variant="caption">Storage Used (Primary)</Typography>
              <Tooltip title={`${primary}%`}>
                <Box
                  onClick={handlePrimaryClick}
                  sx={{ cursor: 'pointer', mt: 0.5 }}
                  data-testid="mui-meter-storage-primary"
                  data-instance-label="Storage Used (Primary)"
                  data-meter-value={primary}
                  data-meter-committed={committed}
                  role="meter"
                  aria-valuenow={primary}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Primary"
                >
                  <LinearProgress variant="determinate" value={primary} sx={{ height: 8 }} />
                </Box>
              </Tooltip>
            </Box>

            {/* Secondary meter */}
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="caption">Storage Used (Secondary)</Typography>
              <Tooltip title={`${secondary}%`}>
                <Box
                  onClick={handleSecondaryClick}
                  sx={{ cursor: 'pointer', mt: 0.5 }}
                  data-testid="mui-meter-storage-secondary"
                  data-instance-label="Storage Used (Secondary)"
                  data-meter-value={secondary}
                  role="meter"
                  aria-valuenow={secondary}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Secondary"
                >
                  <LinearProgress variant="determinate" value={secondary} sx={{ height: 8 }} />
                </Box>
              </Tooltip>
            </Box>

            {/* Archive meter */}
            <Box>
              <Typography variant="caption">Storage Used (Archive)</Typography>
              <Tooltip title={`${archive}%`}>
                <Box
                  onClick={handleArchiveClick}
                  sx={{ cursor: 'pointer', mt: 0.5 }}
                  data-testid="mui-meter-storage-archive"
                  data-instance-label="Storage Used (Archive)"
                  data-meter-value={archive}
                  role="meter"
                  aria-valuenow={archive}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Storage Used Archive"
                >
                  <LinearProgress variant="determinate" value={archive} sx={{ height: 8 }} />
                </Box>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>

        {/* Distractor card */}
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ p: 2, height: 200 }}>
            <Typography variant="subtitle2" gutterBottom>Network</Typography>
            <Box sx={{ height: 120, bgcolor: 'action.hover', borderRadius: 1 }} />
            <Button size="small" disabled sx={{ mt: 1 }}>Configure</Button>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar open={showSaved} autoHideDuration={2000} onClose={() => setShowSaved(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Saved
        </Alert>
      </Snackbar>
    </>
  );
}
