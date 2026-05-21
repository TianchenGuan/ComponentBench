'use client';

/**
 * toggle_button_group_multi-mui-T18: Confirm saving notification channels
 *
 * Layout: modal_flow centered in the viewport, with the dialog styled in dark theme.
 *
 * The page immediately shows a MUI Dialog titled "Notification settings".
 * Inside the dialog:
 * - A ToggleButtonGroup (multiple selection) labeled "Notification channels" with options:
 *   Email, SMS, Push, In-app
 * - Initial state: Email and SMS are selected.
 *
 * Dialog actions:
 * - A primary button "Save".
 * - Clicking "Save" opens a secondary confirmation dialog (or alert-style dialog) 
 *   with text "Save changes?" and two actions: "Cancel" and "Confirm".
 * - The updated selection is only committed after clicking "Confirm".
 *
 * Clutter=low: there is also a short paragraph description and a disabled 
 * "Do not disturb" toggle, which do not affect success.
 *
 * Success: Selected options equal exactly: Email, Push, In-app (require_confirm: true, confirm_control: Confirm)
 * Theme: dark
 */

import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, FormControlLabel, Switch
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import type { TaskComponentProps } from '../types';

const TARGET_SET = new Set(['Email', 'Push', 'In-app']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email', 'SMS']);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const successFiredRef = useRef(false);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newFormats: string[]) => {
    setSelected(newFormats);
  };

  const handleSave = () => {
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (successFiredRef.current) return;
    
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      successFiredRef.current = true;
      setConfirmOpen(false);
      onSuccess();
    } else {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog 
        open 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#1f1f1f',
            color: '#fff',
          }
        }}
        data-testid="notification-settings-dialog"
      >
        <DialogTitle sx={{ color: '#fff' }}>Notification settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>
            Configure how you receive notifications from the system.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
              Notification channels
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 1.5, fontSize: 12 }}>
              Select Email, Push, and In-app.
            </Typography>

            <ToggleButtonGroup
              value={selected}
              onChange={handleChange}
              aria-label="notification channels"
              sx={{
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiToggleButton-root': {
                  color: '#ccc',
                  borderColor: '#444',
                  '&.Mui-selected': {
                    bgcolor: '#1976d2',
                    color: '#fff',
                  },
                },
              }}
              data-testid="notification-channels-group"
            >
              <ToggleButton value="Email" aria-label="Email" data-testid="channel-email">
                Email
              </ToggleButton>
              <ToggleButton value="SMS" aria-label="SMS" data-testid="channel-sms">
                SMS
              </ToggleButton>
              <ToggleButton value="Push" aria-label="Push" data-testid="channel-push">
                Push
              </ToggleButton>
              <ToggleButton value="In-app" aria-label="In-app" data-testid="channel-in-app">
                In-app
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControlLabel
            control={<Switch disabled sx={{ '& .MuiSwitch-track': { bgcolor: '#555' } }} />}
            label={<Typography sx={{ color: '#888' }}>Do not disturb</Typography>}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #333', px: 3, py: 2 }}>
          <Button variant="contained" onClick={handleSave} data-testid="save-button">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: '#fff',
          }
        }}
        data-testid="confirm-dialog"
      >
        <DialogTitle sx={{ color: '#fff' }}>Save changes?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: '#aaa' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleConfirm} data-testid="confirm-button">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
