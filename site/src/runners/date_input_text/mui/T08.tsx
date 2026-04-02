'use client';

/**
 * date_input_text-mui-T08: MUI DatePicker field inside dark themed modal with Save
 * 
 * Layout: modal_flow with dark theme.
 * Base page: a small toolbar with a primary button "New appointment".
 * Clicking it opens a MUI Dialog in the center containing a short form:
 *   - "Title" text field (prefilled; not required)
 *   - "Appointment date" using MUI X DatePicker input field (manual typing supported; calendar popover can be opened from the field but is optional)
 * Footer buttons: "Cancel" and "Save appointment".
 * Initial state: Appointment date is empty when the dialog opens.
 * Feedback: after clicking "Save appointment", the dialog closes and an inline confirmation text appears ("Appointment saved").
 * 
 * Success: The "Appointment date" value equals 2026-10-12 AND user clicked "Save appointment".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('Team Meeting');
  const [appointmentDate, setAppointmentDate] = useState<Dayjs | null>(null);
  const [saved, setSaved] = useState(false);
  const successTriggered = useRef(false);

  const handleSave = () => {
    if (appointmentDate && appointmentDate.isValid() && appointmentDate.format('YYYY-MM-DD') === '2026-10-12' && !successTriggered.current) {
      successTriggered.current = true;
      setSaved(true);
      setDialogOpen(false);
      onSuccess();
    } else {
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setAppointmentDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Appointments</Typography>
          
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            data-testid="new-appointment"
          >
            New appointment
          </Button>

          {saved && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              Appointment saved
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        data-testid="appointment-dialog"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Appointment</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            <Box>
              <Typography component="label" htmlFor="appointment-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Appointment date
              </Typography>
              <DatePicker
                value={appointmentDate}
                onChange={(newValue) => setAppointmentDate(newValue)}
                format="MM/DD/YYYY"
                slotProps={{
                  textField: {
                    id: 'appointment-date',
                    fullWidth: true,
                    placeholder: 'MM/DD/YYYY',
                    inputProps: {
                      'data-testid': 'appointment-date',
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            data-testid="save-appointment"
          >
            Save appointment
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
