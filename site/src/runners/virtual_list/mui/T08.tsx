'use client';

/**
 * virtual_list-mui-T08: Pick the correct item in a busy dashboard with three lists
 *
 * Layout: dashboard. The page shows a 3-column dashboard with three MUI Cards:
 *   1) "Alerts" (TARGET)
 *   2) "Tasks"
 *   3) "Messages"
 * Each card contains its own react-window virtualized list with independent scrollbars.
 * Initial state: all lists are scrolled to top; "Tasks" has a preselected row as a distractor.
 *
 * Success: In Alerts list, select 'alert-0921' (Password expired)
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItemButton, ListItemText, Chip, Box, TextField, Button, Card, CardContent, CardHeader } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface AlertItem {
  key: string;
  id: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface TaskItem {
  key: string;
  id: string;
  title: string;
}

interface MessageItem {
  key: string;
  id: string;
  sender: string;
}

// Generate data for all three lists
const generateAlerts = (): AlertItem[] => {
  const messages = ['Password expired', 'Disk space low', 'Login attempt failed', 'Rate limit exceeded', 'SSL certificate expiring'];
  const severities: AlertItem['severity'][] = ['error', 'warning', 'info'];
  return Array.from({ length: 1000 }, (_, i) => ({
    key: `alert-${String(i + 900).padStart(4, '0')}`,
    id: `ALERT-${String(i + 900).padStart(4, '0')}`,
    message: messages[i % messages.length],
    severity: severities[i % severities.length],
  }));
};

const generateTasks = (): TaskItem[] => {
  const titles = ['Review code', 'Update docs', 'Fix bug', 'Deploy release', 'Write tests'];
  return Array.from({ length: 500 }, (_, i) => ({
    key: `task-${String(i + 900).padStart(4, '0')}`,
    id: `TASK-${String(i + 900).padStart(4, '0')}`,
    title: titles[i % titles.length],
  }));
};

const generateMessages = (): MessageItem[] => {
  const senders = ['Alex Kim', 'Jordan Chen', 'Taylor Smith', 'Morgan Lee', 'Casey Patel'];
  return Array.from({ length: 500 }, (_, i) => ({
    key: `msg-${String(i + 900).padStart(4, '0')}`,
    id: `MSG-${String(i + 900).padStart(4, '0')}`,
    sender: senders[i % senders.length],
  }));
};

const alerts = generateAlerts();
const tasks = generateTasks();
const messages = generateMessages();

const severityColors = {
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [alertSelectedKey, setAlertSelectedKey] = useState<string | null>(null);
  const [taskSelectedKey, setTaskSelectedKey] = useState<string | null>('task-0915'); // Preselected distractor
  const [messageSelectedKey, setMessageSelectedKey] = useState<string | null>(null);

  // Check success condition
  useEffect(() => {
    if (alertSelectedKey === 'alert-0921') {
      onSuccess();
    }
  }, [alertSelectedKey, onSuccess]);

  const AlertRow = ({ index, style }: ListChildComponentProps) => {
    const item = alerts[index];
    return (
      <ListItemButton
        style={style}
        selected={alertSelectedKey === item.key}
        onClick={() => setAlertSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={alertSelectedKey === item.key}
      >
        <ListItemText 
          primary={`${item.id} — ${item.message}`}
          secondary={<Chip size="small" label={item.severity} color={severityColors[item.severity]} />}
        />
      </ListItemButton>
    );
  };

  const TaskRow = ({ index, style }: ListChildComponentProps) => {
    const item = tasks[index];
    return (
      <ListItemButton
        style={style}
        selected={taskSelectedKey === item.key}
        onClick={() => setTaskSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={taskSelectedKey === item.key}
      >
        <ListItemText primary={`${item.id} — ${item.title}`} />
      </ListItemButton>
    );
  };

  const MessageRow = ({ index, style }: ListChildComponentProps) => {
    const item = messages[index];
    return (
      <ListItemButton
        style={style}
        selected={messageSelectedKey === item.key}
        onClick={() => setMessageSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={messageSelectedKey === item.key}
      >
        <ListItemText primary={`${item.id} — ${item.sender}`} />
      </ListItemButton>
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      {/* Dashboard header (clutter) */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField size="small" type="date" defaultValue="2024-02-15" />
          <Button startIcon={<Refresh />} variant="outlined" size="small">Refresh</Button>
        </Box>
      </Box>

      {/* KPI tiles (clutter) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {['Users: 1,234', 'Revenue: $45K', 'Issues: 12'].map((text, i) => (
          <Paper key={i} sx={{ p: 1.5, flex: 1, textAlign: 'center' }}>
            <Typography variant="body2">{text}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Three list cards */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Alerts (TARGET) */}
        <Card sx={{ flex: 1 }} data-testid="vl-alerts">
          <CardHeader title="Alerts" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent sx={{ p: 1 }}>
            <Paper variant="outlined">
              <FixedSizeList height={260} width="100%" itemSize={56} itemCount={alerts.length} overscanCount={5}>
                {AlertRow}
              </FixedSizeList>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Selected: {alertSelectedKey ? alerts.find(a => a.key === alertSelectedKey)?.id : 'none'}
            </Typography>
          </CardContent>
        </Card>

        {/* Tasks (distractor with preselection) */}
        <Card sx={{ flex: 1 }} data-testid="vl-tasks">
          <CardHeader title="Tasks" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent sx={{ p: 1 }}>
            <Paper variant="outlined">
              <FixedSizeList height={260} width="100%" itemSize={48} itemCount={tasks.length} overscanCount={5}>
                {TaskRow}
              </FixedSizeList>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Selected: {taskSelectedKey ? tasks.find(t => t.key === taskSelectedKey)?.id : 'none'}
            </Typography>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card sx={{ flex: 1 }} data-testid="vl-messages">
          <CardHeader title="Messages" titleTypographyProps={{ variant: 'subtitle1' }} />
          <CardContent sx={{ p: 1 }}>
            <Paper variant="outlined">
              <FixedSizeList height={260} width="100%" itemSize={48} itemCount={messages.length} overscanCount={5}>
                {MessageRow}
              </FixedSizeList>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Selected: {messageSelectedKey ? messages.find(m => m.key === messageSelectedKey)?.id : 'none'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
