'use client';

/**
 * virtual_list-mui-v2-T08
 * Four panes: pick the approval row only in Approvals
 *
 * Dark dashboard with 2×2 grid of cards. Agent must scroll Approvals to APR-440,
 * select it, and click "Apply approvals" without changing other cards.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, CardActions, Typography, Button, Box, Stack,
  ListItemButton, ListItemText } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { TaskComponentProps } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface RowItem { key: string; code: string; label: string; }

const alertLabels = ['Disk full', 'CPU spike', 'Memory leak', 'Token revoked'];
const taskLabels = ['Code review', 'Deploy staging', 'Write tests', 'Triage bugs'];
const msgLabels = ['Welcome', 'Standup notes', 'Release plan', 'Sprint retro'];
const aprLabels = ['Contract renewal', 'Budget increase', 'New hire', 'Policy change', 'Vendor onboard'];

function buildRows(prefix: string, labels: string[], count: number): RowItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix.toLowerCase()}-${i}`,
    code: `${prefix}-${i}`,
    label: labels[i % labels.length],
  }));
}

const alerts = buildRows('ALR', alertLabels, 500);
const tasks = buildRows('TSK', taskLabels, 500);
const messages = buildRows('MSG', msgLabels, 500);
const approvals = buildRows('APR', aprLabels, 500);

function PaneCard({ title, items, selected, onSelect, actionLabel, onAction, testId }: {
  title: string; items: RowItem[]; selected: string | null;
  onSelect: (k: string) => void; actionLabel: string; onAction: () => void; testId: string;
}) {
  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = items[index];
    return (
      <ListItemButton style={style} selected={selected === item.key}
        onClick={() => onSelect(item.key)} data-item-key={item.key}>
        <ListItemText primary={`${item.code} — ${item.label}`} primaryTypographyProps={{ fontSize: 11 }} />
      </ListItemButton>
    );
  };

  return (
    <Card sx={{ flex: 1 }} data-testid={testId}>
      <CardHeader title={title} titleTypographyProps={{ variant: 'caption', fontWeight: 600 }} sx={{ pb: 0, pt: 1 }} />
      <CardContent sx={{ py: 0.5, px: 1 }}>
        <FixedSizeList height={180} width="100%" itemSize={36} itemCount={items.length} overscanCount={5}>
          {Row}
        </FixedSizeList>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Selected: {selected ?? 'none'}
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button size="small" variant="contained" onClick={onAction} disabled={!selected}>{actionLabel}</Button>
      </CardActions>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [alertSel, setAlertSel] = useState<string | null>(null);
  const [taskSel, setTaskSel] = useState<string | null>(null);
  const [msgSel, setMsgSel] = useState<string | null>(null);
  const [aprSel, setAprSel] = useState<string | null>(null);
  const [aprSaved, setAprSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (aprSaved && aprSel === 'apr-440') { successRef.current = true; onSuccess(); }
  }, [aprSaved, aprSel, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <PaneCard title="Alerts" items={alerts} selected={alertSel} onSelect={setAlertSel}
            actionLabel="Save alerts" onAction={() => {}} testId="alerts-pane" />
          <PaneCard title="Tasks" items={tasks} selected={taskSel} onSelect={setTaskSel}
            actionLabel="Save tasks" onAction={() => {}} testId="tasks-pane" />
          <PaneCard title="Messages" items={messages} selected={msgSel} onSelect={setMsgSel}
            actionLabel="Save messages" onAction={() => {}} testId="messages-pane" />
          <PaneCard title="Approvals" items={approvals} selected={aprSel} onSelect={setAprSel}
            actionLabel="Apply approvals" onAction={() => setAprSaved(true)} testId="approvals-pane" />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
