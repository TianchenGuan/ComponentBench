'use client';

/**
 * virtual_list-mui-v2-T03
 * Busy dashboard: select the alert row and save that card only
 *
 * Dark dashboard with three MUI Cards (Alerts/Tasks/Messages). Overlapping IDs.
 * Agent must select ALERT-0923 in the Alerts card and click "Save alerts card".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Paper, Card, CardHeader, CardContent, CardActions, Typography, Button, Box, Chip, Stack,
  ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface RowItem { key: string; code: string; label: string; }

const alertLabels = ['Disk full', 'CPU spike', 'Memory leak', 'Password expired', 'Token revoked', 'Cert expiring', 'Rate limit', 'DNS failure'];
const taskLabels = ['Code review', 'Deploy staging', 'Write tests', 'Update docs', 'Refactor DB', 'Fix pipeline', 'Triage bugs', 'Rotate secrets'];
const msgLabels = ['Welcome', 'Standup notes', 'Release plan', 'Incident report', 'Team lunch', 'OOO notice', 'PR feedback', 'Sprint retro'];

function buildRows(prefix: string, labels: string[], count: number): RowItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${String(i).padStart(4, '0')}`,
    code: `${prefix}-${String(i).padStart(4, '0')}`,
    label: labels[i % labels.length],
  }));
}

const alerts = buildRows('ALERT', alertLabels, 1200);
const tasks = buildRows('TASK', taskLabels, 1200);
const messages = buildRows('MSG', msgLabels, 1200);

function DashCard({ title, items, selected, onSelect, actionLabel, onAction, testId }: {
  title: string; items: RowItem[]; selected: string | null;
  onSelect: (k: string) => void; actionLabel: string; onAction: () => void; testId: string;
}) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    return (
      <ListItemButton style={style} selected={selected === item.key}
        onClick={() => onSelect(item.key)} data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.label}`} primaryTypographyProps={{ fontSize: 12 }} />
      </ListItemButton>
    );
  };

  return (
    <Card sx={{ flex: 1, minWidth: 260 }} data-testid={testId}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'subtitle2' }} sx={{ pb: 0 }} />
      <CardContent sx={{ py: 1 }}>
        <Paper variant="outlined">
          <FixedSizeList height={240} width="100%" itemSize={40} itemCount={items.length} overscanCount={5}>
            {Row}
          </FixedSizeList>
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Selected: {selected ?? 'none'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={onAction} disabled={!selected}>{actionLabel}</Button>
      </CardActions>
    </Card>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [alertSel, setAlertSel] = useState<string | null>(null);
  const [taskSel, setTaskSel] = useState<string | null>(null);
  const [msgSel, setMsgSel] = useState<string | null>(null);
  const [alertSaved, setAlertSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (alertSaved && alertSel === 'alert-0923') { successRef.current = true; onSuccess(); }
  }, [alertSaved, alertSel, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2, minWidth: 840 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip label="Uptime: 99.7%" size="small" color="success" />
          <Chip label="Open: 42" size="small" />
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <DashCard title="Alerts" items={alerts} selected={alertSel} onSelect={setAlertSel}
            actionLabel="Save alerts card" onAction={() => setAlertSaved(true)} testId="alerts-card" />
          <DashCard title="Tasks" items={tasks} selected={taskSel} onSelect={setTaskSel}
            actionLabel="Save tasks card" onAction={() => {}} testId="tasks-card" />
          <DashCard title="Messages" items={messages} selected={msgSel} onSelect={setMsgSel}
            actionLabel="Save messages card" onAction={() => {}} testId="messages-card" />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}
