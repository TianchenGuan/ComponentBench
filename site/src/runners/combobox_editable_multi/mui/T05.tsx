'use client';

/**
 * combobox_editable_multi-mui-T05: Add CC recipients (two fields)
 *
 * Layout is an email-compose form section with multiple inputs (cluttered but realistic).
 * There are TWO Material UI Autocomplete fields stacked near the top:
 * - "To" (distractor): already contains one chip "Primary Team"
 * - "CC" (target): starts empty
 * Both are multiple-selection Autocomplete components backed by the same contacts list (~20 names).
 * Other clutter:
 * - Subject text field, message textarea, and a small "Send" button (not required).
 * You must add exactly two chips to the CC field: Alice Johnson and Bob Smith, without changing the To field.
 *
 * Success: CC field selected values equal {Alice Johnson, Bob Smith} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip, Button, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const contacts = [
  'Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Emma Davis',
  'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Ivy Taylor', 'Jack Anderson',
  'Kate Thomas', 'Leo Martinez', 'Mia Garcia', 'Noah Robinson', 'Olivia Lee',
  'Paul Harris', 'Quinn Clark', 'Rachel Lewis', 'Sam Walker', 'Tina Hall',
];

const TARGET_SET = ['Alice Johnson', 'Bob Smith'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [toValue, setToValue] = useState<string[]>(['Primary Team']);
  const [ccValue, setCcValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(ccValue, TARGET_SET)) {
      onSuccess();
    }
  }, [ccValue, onSuccess]);

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Compose Email</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>To</Typography>
          <Autocomplete
            data-testid="to-recipients"
            multiple
            freeSolo
            options={contacts}
            value={toValue}
            onChange={(_event, newValue) => setToValue(newValue as string[])}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Add recipients" size="small" />
            )}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>CC</Typography>
          <Autocomplete
            data-testid="cc-recipients"
            multiple
            freeSolo
            options={contacts}
            value={ccValue}
            onChange={(_event, newValue) => setCcValue(newValue as string[])}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Add CC recipients" size="small" />
            )}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Subject</Typography>
          <TextField fullWidth size="small" placeholder="Enter subject" />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Message</Typography>
          <TextField fullWidth multiline rows={3} placeholder="Write your message" />
        </Box>
        
        <Button variant="contained" size="small">Send</Button>
      </CardContent>
    </Card>
  );
}
