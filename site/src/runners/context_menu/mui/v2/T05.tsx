'use client';

/**
 * context_menu-mui-v2-T05: Dashboard preview — Reset layout… → Reset confirm
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Menu,
  MenuItem,
  Box,
  Button,
  Divider,
  Slider,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Dashboard as DashboardIcon, Warning as WarningIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<'confirmed' | 'cancelled' | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (confirmationResult === 'confirmed' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [confirmationResult, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setAnchorPosition({ top: event.clientY, left: event.clientX });
    setMenuOpen(true);
    setShowConfirm(false);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setShowConfirm(false);
    setAnchorPosition(null);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 640, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: 16 }}>
        Dashboard settings
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
        {['Widgets', 'Theme', 'Density', 'Beta'].map((c) => (
          <Chip key={c} label={c} size="small" variant="outlined" />
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 1.5, width: 200 }}>
          <Typography variant="caption" fontWeight={600}>
            Visibility
          </Typography>
          <FormControlLabel
            control={<Switch defaultChecked size="small" />}
            label={<Typography variant="caption">Show titles</Typography>}
            sx={{ display: 'flex', my: 0.5 }}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
            Column gap
          </Typography>
          <Slider size="small" defaultValue={40} min={8} max={64} />
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Dashboard preview
          </Typography>
          <Box
            onContextMenu={handleContextMenu}
            sx={{
              mt: 0.5,
              minHeight: 200,
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '2px dashed',
              borderColor: 'grey.300',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0.5,
              p: 0.5,
              cursor: 'context-menu',
            }}
            data-testid="dashboard-preview"
            data-confirmation-result={confirmationResult}
            data-confirmed-action-path={confirmationResult === 'confirmed' ? 'Reset layout' : undefined}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 0.5,
                  minHeight: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DashboardIcon color="disabled" fontSize="small" />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem dense onClick={handleClose} disabled={showConfirm}>
          Add widget
        </MenuItem>
        <MenuItem dense onClick={handleClose} disabled={showConfirm}>
          Arrange automatically
        </MenuItem>
        <Divider />
        <MenuItem dense onClick={() => setShowConfirm(true)} disabled={showConfirm} data-testid="reset-layout-item">
          Reset layout…
        </MenuItem>
        {showConfirm && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }} data-testid="confirm-footer">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WarningIcon color="warning" fontSize="small" />
                <Typography variant="caption">Reset layout to default?</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => { setConfirmationResult('cancelled'); handleClose(); }}>
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setConfirmationResult('confirmed');
                    handleClose();
                  }}
                  data-testid="confirm-reset-button"
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Menu>
    </Box>
  );
}
