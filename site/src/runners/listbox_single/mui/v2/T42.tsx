'use client';

/**
 * listbox_single-mui-v2-T42: Priority listbox: choose High and apply without resetting
 *
 * Compact off-center settings panel with two MUI listboxes: "Priority" (Low, Medium, High —
 * initial: Medium) and "Escalation channel" (Email, Slack, Pager — initial: Slack, must stay).
 * Footer: "Apply" and "Reset". Committed only on Apply.
 *
 * Success: Priority = "high", Escalation channel still "slack", "Apply" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, Typography, Button, List, ListItemButton,
  ListItemText, Divider, Box, Chip, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const channelOptions = [
  { value: 'email', label: 'Email' },
  { value: 'slack', label: 'Slack' },
  { value: 'pager', label: 'Pager' },
];

export default function T42({ onSuccess }: TaskComponentProps) {
  const [priority, setPriority] = useState<string>('medium');
  const [channel, setChannel] = useState<string>('slack');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && priority === 'high' && channel === 'slack') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, priority, channel, onSuccess]);

  const handleReset = () => {
    setPriority('medium');
    setChannel('slack');
    setApplied(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'flex-start' }}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Alert Settings</Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip label="Team: Infra" size="small" />
            <Chip label="Region: US-East" size="small" />
            <Chip label="SLA: 99.9%" size="small" color="info" />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Priority</Typography>
              <List
                data-cb-listbox-root
                data-cb-instance="priority"
                data-cb-selected-value={priority}
                sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                dense
              >
                {priorityOptions.map(opt => (
                  <ListItemButton
                    key={opt.value}
                    selected={priority === opt.value}
                    onClick={() => { setPriority(opt.value); setApplied(false); }}
                    data-cb-option-value={opt.value}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 13 }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Escalation channel</Typography>
              <List
                data-cb-listbox-root
                data-cb-instance="escalation"
                data-cb-selected-value={channel}
                sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
                dense
              >
                {channelOptions.map(opt => (
                  <ListItemButton
                    key={opt.value}
                    selected={channel === opt.value}
                    onClick={() => { setChannel(opt.value); setApplied(false); }}
                    data-cb-option-value={opt.value}
                  >
                    <ListItemText primary={opt.label} primaryTypographyProps={{ fontSize: 13 }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={handleReset}>Reset</Button>
            <Button variant="contained" onClick={() => setApplied(true)}>Apply</Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
