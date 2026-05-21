'use client';

/**
 * date_picker_single-mui-T04: Set Due date in settings panel with two pickers
 *
 * Scene: Settings panel layout (settings_panel) with medium clutter. Light theme, comfortable spacing, default scale.
 *
 * Target components: Two MUI X DatePicker fields are shown under a "Dates" subsection:
 * - "Start date" (distractor) - prefilled with "2026-11-20".
 * - "Due date" (TARGET) - empty.
 * The fields have similar styling and are vertically adjacent.
 *
 * Distractors: Other settings include a slider ("Effort"), a status dropdown, and a multiline description field.
 *
 * Feedback: Selecting a day commits immediately (desktop behavior) and the chosen date appears in the Due date field.
 *
 * Success: Target instance (Due date) must have selected date = 2026-12-01.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Slider,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs('2026-11-20'));
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [effort, setEffort] = useState(50);
  const [status, setStatus] = useState('pending');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (dueDate && dueDate.isValid() && dueDate.format('YYYY-MM-DD') === '2026-12-01') {
      onSuccess();
    }
  }, [dueDate, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Task settings</Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Dates</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                  Start date
                </Typography>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      inputProps: {
                        'data-testid': 'start-date',
                      },
                    },
                  }}
                />
              </Box>
              <Box>
                <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                  Due date
                </Typography>
                <DatePicker
                  value={dueDate}
                  onChange={(newValue) => setDueDate(newValue)}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      placeholder: 'YYYY-MM-DD',
                      inputProps: {
                        'data-testid': 'due-date',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
              Effort
            </Typography>
            <Slider
              value={effort}
              onChange={(_, val) => setEffort(val as number)}
              valueLabelDisplay="auto"
              data-testid="effort-slider"
            />
          </Box>

          <FormControl fullWidth size="small" sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => setStatus(e.target.value)}
              data-testid="status-select"
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            inputProps={{ 'data-testid': 'description-field' }}
          />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
