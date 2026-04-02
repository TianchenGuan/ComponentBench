'use client';

/**
 * tree_view-mui-v2-T04: Incident folder reorder — drag Escalations above Alerts and save
 *
 * Inline surface. MUI tree with drag reordering. "Incident playbooks" tree:
 * Response→{Runbook, Alerts, Escalations[move], Timeline}. Archive collapsed.
 * Response expanded. "Save order" commits.
 * Success: Response children order = [runbook, escalations, alerts, timeline], "Save order" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Stack, List, ListItem,
  ListItemText, ListItemIcon, Paper,
} from '@mui/material';
import { DragIndicator, Description, FolderOpen, Folder } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { arraysEqual } from '../../types';

interface PlaybookItem { id: string; label: string; }

const initialItems: PlaybookItem[] = [
  { id: 'response/runbook', label: 'Runbook' },
  { id: 'response/alerts', label: 'Alerts' },
  { id: 'response/escalations', label: 'Escalations' },
  { id: 'response/timeline', label: 'Timeline' },
];

const TARGET_ORDER = [
  'response/runbook',
  'response/escalations',
  'response/alerts',
  'response/timeline',
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<PlaybookItem[]>(initialItems);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && arraysEqual(items.map((i) => i.id), TARGET_ORDER)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, items, onSuccess]);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...items];
    const [dragged] = next.splice(dragIdx, 1);
    next.splice(idx, 0, dragged);
    setItems(next);
    setDragIdx(idx);
    setCommitted(false);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <Box sx={{ p: 2, maxWidth: 600, display: 'flex', gap: 2 }}>
      <Card variant="outlined" sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Incident playbooks</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <FolderOpen fontSize="small" />
            <Typography>Response</Typography>
          </Box>

          <List dense sx={{ pl: 3 }}>
            {items.map((item, idx) => (
              <ListItem key={item.id} draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                sx={{
                  cursor: 'grab',
                  bgcolor: dragIdx === idx ? 'action.selected' : 'transparent',
                  borderRadius: 1, '&:hover': { bgcolor: 'action.hover' },
                }}
                data-testid={`item-${item.id}`}
              >
                <ListItemIcon sx={{ minWidth: 28 }}><DragIndicator fontSize="small" /></ListItemIcon>
                <ListItemIcon sx={{ minWidth: 28 }}><Description fontSize="small" /></ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Folder fontSize="small" color="disabled" />
            <Typography color="text.secondary">Archive</Typography>
          </Box>

          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button variant="contained" size="small" onClick={() => setCommitted(true)}>Save order</Button>
          </Box>
        </CardContent>
      </Card>

      <Paper variant="outlined" sx={{ width: 180, p: 2 }}>
        <Typography variant="caption" color="text.secondary">Markdown preview</Typography>
        <Box sx={{ mt: 1, height: 80, bgcolor: 'action.hover', borderRadius: 1 }} />
      </Paper>
    </Box>
  );
}
