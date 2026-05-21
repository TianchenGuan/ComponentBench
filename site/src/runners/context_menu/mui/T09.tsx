'use client';

/**
 * context_menu-mui-T09: Reset layout with confirmation
 *
 * Scene: theme=light, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1, clutter=high.
 *
 * Layout: settings_panel centered in the viewport. The page looks like a dashboard customization panel.
 *
 * Target element: a rectangle labeled "Dashboard grid" (a preview of widgets).
 * Right-clicking inside it opens a custom context menu.
 *
 * Context menu implementation: onContextMenu opens a MUI Menu at cursor position.
 *
 * Menu items:
 * - Add widget
 * - Arrange automatically
 * - Reset layout… (requires confirmation)
 *
 * Confirmation behavior: clicking "Reset layout…" reveals an inline confirmation footer inside
 * the same menu overlay with two buttons: "Cancel" and "Reset".
 *
 * Success: The pending action ['Reset layout'] is confirmed via the 'Reset' control inside the menu overlay.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Menu, MenuItem, Box, Button, Divider, Slider, Switch, FormControlLabel } from '@mui/material';
import { Dashboard as DashboardIcon, Warning as WarningIcon } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
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

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setConfirmationResult('confirmed');
    handleClose();
  };

  const handleCancel = () => {
    setConfirmationResult('cancelled');
    handleClose();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Settings
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left side - Settings controls (clutter) */}
        <Paper elevation={1} sx={{ p: 2, width: 200 }}>
          <Typography variant="subtitle2" gutterBottom>Layout Options</Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked size="small" />}
            label={<Typography variant="body2">Auto-save</Typography>}
            sx={{ mb: 1 }}
          />
          <FormControlLabel
            control={<Switch size="small" />}
            label={<Typography variant="body2">Compact mode</Typography>}
            sx={{ mb: 1 }}
          />
          
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Grid columns</Typography>
          <Slider
            defaultValue={3}
            min={1}
            max={6}
            marks
            size="small"
          />
          
          <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>Spacing</Typography>
          <Slider
            defaultValue={16}
            min={8}
            max={32}
            size="small"
          />
        </Paper>

        {/* Right side - Dashboard grid preview */}
        <Paper elevation={1} sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dashboard grid
          </Typography>
          
          <Box
            onContextMenu={handleContextMenu}
            sx={{
              width: '100%',
              minHeight: 250,
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '2px dashed',
              borderColor: 'grey.300',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              p: 1,
              cursor: 'context-menu',
            }}
            data-testid="dashboard-grid"
            data-confirmation-result={confirmationResult}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 60,
                }}
              >
                <DashboardIcon color="disabled" />
              </Box>
            ))}
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Right-click to access layout options
          </Typography>
        </Paper>
      </Box>

      {/* Context menu with inline confirmation */}
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition ?? undefined}
        data-testid="context-menu-overlay"
      >
        <MenuItem onClick={handleClose} disabled={showConfirm}>Add widget</MenuItem>
        <MenuItem onClick={handleClose} disabled={showConfirm}>Arrange automatically</MenuItem>
        <Divider />
        <MenuItem 
          onClick={handleResetClick} 
          disabled={showConfirm}
          data-testid="reset-layout-item"
        >
          Reset layout…
        </MenuItem>
        
        {showConfirm && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }} data-testid="confirm-footer">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <WarningIcon color="warning" fontSize="small" />
                <Typography variant="body2">Reset to default layout?</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={handleCancel} data-testid="cancel-button">
                  Cancel
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  color="error" 
                  onClick={handleConfirm}
                  data-testid="confirm-reset-button"
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Menu>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Confirmation result: <strong data-testid="confirmation-result">{confirmationResult || 'None'}</strong>
      </Typography>
    </Box>
  );
}
