'use client';

/**
 * textarea-mui-T06: Reminder message from mixed reference
 *
 * A centered card titled "Announcement" contains:
 * - Light theme, comfortable spacing, default scale.
 * - One multiline MUI TextField labeled "Reminder message", initially empty.
 * - Above the textarea is a "Reference" section:
 *   - A small line of selectable text: "Starts with: Reminder: submit timesheet by Friday."
 *   - Next to it, an IMAGE preview of the full two-line message (not selectable).
 * - No other textareas are present; clutter is minimal.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   Reminder: submit timesheet by Friday.
 *   Thank you!
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `Reminder: submit timesheet by Friday.
Thank you!`;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalized = value.replace(/\r\n/g, '\n');
    if (normalized === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Announcement
        </Typography>

        {/* Reference section */}
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Text hint
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12 }}>
              Starts with: Reminder: submit timesheet by Friday.
            </Typography>
          </Box>
          <Box sx={{ width: 180 }}>
            <Typography variant="caption" color="text.secondary">
              Full reference (image)
            </Typography>
            {/* Simulated image - non-selectable */}
            <Box
              sx={{
                p: 1,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#666',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              data-testid="reference-image"
            >
              <div>Reminder: submit timesheet by Friday.</div>
              <div>Thank you!</div>
            </Box>
          </Box>
        </Box>

        <TextField
          label="Reminder message"
          multiline
          rows={3}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'textarea-reminder-message' }}
        />
      </CardContent>
    </Card>
  );
}
