'use client';

/**
 * select_custom_single-mui-v2-T10: Reference-dot priority — set Priority to the amber option and save
 *
 * Compact card at top-right of a task board. Two MUI Select controls: "Priority" and
 * "Escalation channel". Priority uses MenuItems with colored dots:
 * Low (blue), Medium (amber), High (red). Escalation channel is text-only, must stay "Slack".
 * A small badge above the card shows only the amber dot.
 * Footer: "Save task settings". Committed only after Save.
 *
 * Success: Priority = "Medium", Escalation channel still "Slack", "Save task settings" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, CardActions, Typography, Button, Select,
  MenuItem, FormControl, InputLabel, Chip, ListItemIcon, ListItemText,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import type { TaskComponentProps } from '../../types';

const DOT_COLORS: Record<string, string> = { Low: '#1976d2', Medium: '#ed6c02', High: '#d32f2f' };
const priorityOptions = ['Low', 'Medium', 'High'];
const channelOptions = ['Slack', 'Email', 'SMS', 'Webhook'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [priority, setPriority] = useState('Low');
  const [channel, setChannel] = useState('Slack');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && priority === 'Medium' && channel === 'Slack') {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, priority, channel, onSuccess]);

  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', minHeight: '60vh' }}>
      <Box sx={{ width: 320 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" color="text.secondary">Match this reference:</Typography>
          <Chip
            size="small"
            icon={<CircleIcon sx={{ fontSize: 10, color: '#ed6c02 !important' }} />}
            label="Target"
            variant="outlined"
            sx={{ height: 22, '& .MuiChip-icon': { color: '#ed6c02' } }}
          />
        </Box>

        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Task Settings</Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => { setPriority(e.target.value); setSaved(false); }}
                renderValue={(val) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircleIcon sx={{ fontSize: 10, color: DOT_COLORS[val] }} />
                    {val}
                  </Box>
                )}
              >
                {priorityOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <CircleIcon sx={{ fontSize: 10, color: DOT_COLORS[p] }} />
                    </ListItemIcon>
                    <ListItemText>{p}</ListItemText>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Escalation channel</InputLabel>
              <Select
                value={channel}
                label="Escalation channel"
                onChange={(e) => { setChannel(e.target.value); setSaved(false); }}
              >
                {channelOptions.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip label="Sprint 14" size="small" variant="outlined" />
              <Chip label="Assigned" size="small" />
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button variant="contained" size="small" onClick={() => setSaved(true)}>Save task settings</Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
