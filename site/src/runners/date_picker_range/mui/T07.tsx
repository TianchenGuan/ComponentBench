'use client';

/**
 * date_picker_range-mui-T07: Cancel a dialog-based range selection
 *
 * A drawer_flow layout: the page has a right-side drawer titled
 * 'Subscription settings' already open. Inside the drawer is a MUI X DateRangePicker
 * labeled 'Billing cycle'. It is configured to use a dialog/modal style (mobile
 * variant), so opening it shows the calendar in a modal with an action bar containing
 * 'Cancel' and 'OK'. The field starts empty. The task is specifically to use the
 * picker-level Cancel action to dismiss without setting any range.
 *
 * Note: Using two MobileDatePickers as MUI free tier doesn't include MobileDateRangePicker.
 *
 * Success: Range remains empty (null, null), Cancel was clicked to close the dialog.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Drawer, Typography, Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftStart, setDraftStart] = useState<Dayjs | null>(null);
  const [draftEnd, setDraftEnd] = useState<Dayjs | null>(null);
  const wasOpenedRef = useRef(false);
  const cancelClickedRef = useRef(false);

  useEffect(() => {
    // Success when: dialog was opened, then closed via cancel, and value is still empty
    if (
      wasOpenedRef.current &&
      !dialogOpen &&
      cancelClickedRef.current &&
      !startValue &&
      !endValue
    ) {
      onSuccess();
    }
  }, [dialogOpen, startValue, endValue, onSuccess]);

  const handleOpen = () => {
    setDialogOpen(true);
    wasOpenedRef.current = true;
    setDraftStart(startValue);
    setDraftEnd(endValue);
  };

  const handleCancel = () => {
    cancelClickedRef.current = true;
    setDialogOpen(false);
  };

  const handleOk = () => {
    setStartValue(draftStart);
    setEndValue(draftEnd);
    setDialogOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', minHeight: 500 }}>
        {/* Main content area */}
        <Box sx={{ flex: 1, p: 3, background: '#f5f5f5' }}>
          <Typography variant="h6">Main Content</Typography>
          <Typography color="text.secondary">
            The subscription settings drawer is open on the right.
          </Typography>
        </Box>

        {/* Drawer */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: 350,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 350,
              position: 'relative',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Subscription settings
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure your subscription billing cycle below.
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                Billing cycle
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={handleOpen}
                data-testid="billing-cycle-button"
              >
                {startValue && endValue 
                  ? `${startValue.format('MM/DD/YYYY')} – ${endValue.format('MM/DD/YYYY')}`
                  : 'Select date range'}
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Open the picker and click Cancel to dismiss.
              </Typography>
            </Box>
          </Box>
        </Drawer>

        {/* Date Range Dialog */}
        <Dialog open={dialogOpen} onClose={handleCancel}>
          <DialogTitle>Select Billing Cycle</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <MobileDatePicker
                label="Start Date"
                value={draftStart}
                onChange={(newValue) => setDraftStart(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'billing-start' },
                  },
                }}
              />
              <MobileDatePicker
                label="End Date"
                value={draftEnd}
                onChange={(newValue) => setDraftEnd(newValue)}
                minDate={draftStart || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'billing-end' },
                  },
                }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} data-testid="dialog-cancel">Cancel</Button>
            <Button onClick={handleOk} variant="contained" data-testid="dialog-ok">OK</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
