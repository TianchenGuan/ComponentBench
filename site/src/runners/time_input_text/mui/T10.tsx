'use client';

/**
 * time_input_text-mui-T10: Set time in a modal and press Save
 * 
 * Layout: modal_flow. The main page shows a button labeled "Edit notification window".
 * Clicking it opens a centered MUI Dialog titled "Notification window".
 * Inside the dialog:
 * - One MUI X TimeField labeled "Notification start time" with initial value 08:00.
 * - Action buttons at the bottom-right: "Cancel" and "Save".
 * - Behavior: after clicking Save, the dialog stays open and shows a small "Saved" status text so the field remains available for checking.
 * TimeField configuration: format='HH:mm'.
 * Clutter=low: one helper text paragraph; no other editable fields.
 * 
 * Success: In the open "Notification window" dialog, the TimeField labeled "Notification start time" equals 08:15.
 *          The dialog action button labeled "Save" must be clicked after setting the value.
 */

import React, { useState, useRef } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  Typography, Box 
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(dayjs('08:00', 'HH:mm'));
  const [saved, setSaved] = useState(false);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    setSaved(true);
    if (!hasSucceeded.current && value && value.isValid() && value.format('HH:mm') === '08:15') {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSaved(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        data-testid="edit-notification-btn"
      >
        Edit notification window
      </Button>

      <Dialog 
        open={open} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        data-testid="notification-dialog"
      >
        <DialogTitle>Notification window</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Configure when notifications are allowed to be sent.
          </Typography>
          
          <Box>
            <Typography component="label" htmlFor="notification-start-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Notification start time
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="HH:mm"
              slotProps={{
                textField: {
                  id: 'notification-start-time',
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'notification-start-time',
                  },
                },
              }}
            />
          </Box>
          
          {saved && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Saved
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="notif-save">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
