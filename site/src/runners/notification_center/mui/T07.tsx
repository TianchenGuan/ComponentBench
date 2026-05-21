'use client';

/**
 * notification_center-mui-T07: Set Do Not Disturb duration
 *
 * setup_description:
 * The Notification Center appears inside a settings_panel layout titled "Alerts & Notifications".
 * The panel contains other settings (email alerts, mobile push toggles), but only the Notification Center subsection is relevant.
 * 
 * In the Notification Center header, there is a labeled Select control:
 *   - Label: "Do Not Disturb"
 *   - Options: Off, 15 minutes, 30 minutes, 1 hour, 2 hours
 *   - Initial value: Off
 * 
 * Selecting a duration updates a helper chip that reads "Pop-ups paused for: <duration>".
 * Distractors: an unrelated Select in the same settings panel labeled "Digest frequency" (Daily/Weekly) is nearby.
 * Feedback: Do Not Disturb value changes immediately; there is no Save or Apply button for this setting in this task.
 *
 * success_trigger: Notification Center Do Not Disturb duration is set to 30 minutes.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  List,
  ListItem,
  Alert,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'System alert', severity: 'warning' as const },
  { id: '2', title: 'New message', severity: 'info' as const },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [dndMinutes, setDndMinutes] = useState(0);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState('Daily');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (dndMinutes === 30 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [dndMinutes, onSuccess]);

  const getDndLabel = (minutes: number) => {
    if (minutes === 0) return 'Off';
    if (minutes === 15) return '15 minutes';
    if (minutes === 30) return '30 minutes';
    if (minutes === 60) return '1 hour';
    if (minutes === 120) return '2 hours';
    return `${minutes} minutes`;
  };

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Alerts & Notifications
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
            }
            label="Email alerts"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={mobilePush}
                onChange={(e) => setMobilePush(e.target.checked)}
              />
            }
            label="Mobile push notifications"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Digest frequency</InputLabel>
            <Select
              value={digestFrequency}
              onChange={(e) => setDigestFrequency(e.target.value)}
              label="Digest frequency"
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Notification Center
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Do Not Disturb</InputLabel>
            <Select
              value={dndMinutes}
              onChange={(e) => setDndMinutes(Number(e.target.value))}
              label="Do Not Disturb"
              data-testid="dnd-select"
            >
              <MenuItem value={0}>Off</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
            </Select>
          </FormControl>

          {dndMinutes > 0 && (
            <Chip
              label={`Pop-ups paused for: ${getDndLabel(dndMinutes)}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <List disablePadding>
          {notifications.map((notif) => (
            <ListItem key={notif.id} sx={{ px: 0 }}>
              <Alert severity={notif.severity} sx={{ width: '100%' }}>
                {notif.title}
              </Alert>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
