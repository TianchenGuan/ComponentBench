'use client';

/**
 * date_picker_single-mui-T10: Set meeting date from a drawer using visual reference
 *
 * Scene: Drawer flow (drawer_flow). The main page has a header "Scheduler" and a button "Open scheduler".
 * Clicking it opens a right-side drawer (placement=top_right for the target area). Theme is light with comfortable spacing.
 *
 * Reference: Inside the drawer, an "Agenda preview" card shows a non-interactive calendar pill with the target date (visual reference: month abbreviation + day number + year).
 *
 * Target components: Two MUI X DatePicker fields appear in the drawer:
 * - "Meeting date" (TARGET) - empty.
 * - "Reminder date" (distractor) - prefilled with a different date.
 *
 * Interaction: Opening "Meeting date" shows a popover calendar layered above the drawer. The agent must navigate to the month/year indicated by the Agenda preview and select the matching day.
 *
 * Distractors: The drawer also contains a participant autocomplete field and a Save button; neither affects success (clutter=medium).
 *
 * Feedback: The chosen date appears in the Meeting date field.
 *
 * Success: Target instance (Meeting date) must have selected date = 2026-09-09.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Drawer,
  TextField,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const participants = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [meetingDate, setMeetingDate] = useState<Dayjs | null>(null);
  const [reminderDate, setReminderDate] = useState<Dayjs | null>(dayjs('2026-09-07'));
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  useEffect(() => {
    if (meetingDate && meetingDate.isValid() && meetingDate.format('YYYY-MM-DD') === '2026-09-09') {
      onSuccess();
    }
  }, [meetingDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Scheduler</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage your meetings and schedules.
          </Typography>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>
            Open scheduler
          </Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Schedule Meeting</Typography>

          {/* Agenda Preview (Visual Reference) */}
          <Box
            data-testid="agenda-preview-date"
            sx={{
              background: '#fff3e0',
              border: '1px solid #ffcc80',
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Agenda preview
            </Typography>
            <Box
              sx={{
                background: '#ff9800',
                color: '#fff',
                borderRadius: 1,
                p: 1.5,
                display: 'inline-block',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ fontSize: 10, textTransform: 'uppercase' }}>Sep</Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>9</Typography>
              <Typography sx={{ fontSize: 10 }}>2026</Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Meeting date
            </Typography>
            <DatePicker
              value={meetingDate}
              onChange={(newValue) => setMeetingDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'meeting-date',
                  },
                },
                popper: {
                  placement: 'left-start',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Reminder date
            </Typography>
            <DatePicker
              value={reminderDate}
              onChange={(newValue) => setReminderDate(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'reminder-date',
                  },
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Participants
            </Typography>
            <Autocomplete
              multiple
              options={participants}
              value={selectedParticipants}
              onChange={(_, newValue) => setSelectedParticipants(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Add participants" data-testid="participants-autocomplete" />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" disabled={!meetingDate}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
}
