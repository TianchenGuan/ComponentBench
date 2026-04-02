'use client';

/**
 * tree_view-mui-T05: Select Notifications in Project outline (2 trees, dashboard)
 *
 * Layout: dashboard with multiple widgets. Bottom-left quadrant contains a panel titled "Project outline"
 * with a RichTreeView (TARGET). Bottom-right quadrant contains a similar panel titled "Data sources"
 * with another RichTreeView (distractor). Top area includes summary cards and a chart (non-interactive clutter).
 *
 * Tree instances (E6=2):
 * • Project outline (TARGET): Settings → Notifications, Settings → Integrations, Tasks → Backlog, Tasks → Done.
 * • Data sources (distractor): Settings → API Keys, Settings → Webhooks, Storage → S3, Storage → GCS.
 *
 * Initial state: both trees are collapsed at the root. No selections are active.
 *
 * Success: In the Tree instance labeled 'Project outline', the selected item id equals 'outline/settings/notifications'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../types';

const projectOutlineItems = [
  {
    id: 'outline/settings',
    label: 'Settings',
    children: [
      { id: 'outline/settings/notifications', label: 'Notifications' },
      { id: 'outline/settings/integrations', label: 'Integrations' },
    ],
  },
  {
    id: 'outline/tasks',
    label: 'Tasks',
    children: [
      { id: 'outline/tasks/backlog', label: 'Backlog' },
      { id: 'outline/tasks/done', label: 'Done' },
    ],
  },
];

const dataSourcesItems = [
  {
    id: 'sources/settings',
    label: 'Settings',
    children: [
      { id: 'sources/settings/api-keys', label: 'API Keys' },
      { id: 'sources/settings/webhooks', label: 'Webhooks' },
    ],
  },
  {
    id: 'sources/storage',
    label: 'Storage',
    children: [
      { id: 'sources/storage/s3', label: 'S3' },
      { id: 'sources/storage/gcs', label: 'GCS' },
    ],
  },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [outlineExpanded, setOutlineExpanded] = useState<string[]>([]);
  const [outlineSelected, setOutlineSelected] = useState<string | null>(null);
  
  const [sourcesExpanded, setSourcesExpanded] = useState<string[]>([]);
  const [sourcesSelected, setSourcesSelected] = useState<string | null>(null);
  
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && outlineSelected === 'outline/settings/notifications') {
      successFired.current = true;
      onSuccess();
    }
  }, [outlineSelected, onSuccess]);

  return (
    <Box sx={{ width: 800 }}>
      {/* Top: Summary cards (clutter) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Total Projects</Typography>
          <Typography variant="h4">24</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Active Tasks</Typography>
          <Typography variant="h4">156</Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Team Members</Typography>
          <Typography variant="h4">12</Typography>
        </Paper>
      </Box>

      {/* Bottom: Two tree panels */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left: Project outline (TARGET) */}
        <Card sx={{ flex: 1 }} data-testid="project-outline-tree">
          <CardContent>
            <Typography variant="h6" gutterBottom>Project outline</Typography>
            <RichTreeView
              items={projectOutlineItems}
              expandedItems={outlineExpanded}
              onExpandedItemsChange={(event, itemIds) => setOutlineExpanded(itemIds)}
              selectedItems={outlineSelected}
              onSelectedItemsChange={(event, itemId) => setOutlineSelected(itemId)}
            />
          </CardContent>
        </Card>

        {/* Right: Data sources (distractor) */}
        <Card sx={{ flex: 1 }} data-testid="data-sources-tree">
          <CardContent>
            <Typography variant="h6" gutterBottom>Data sources</Typography>
            <RichTreeView
              items={dataSourcesItems}
              expandedItems={sourcesExpanded}
              onExpandedItemsChange={(event, itemIds) => setSourcesExpanded(itemIds)}
              selectedItems={sourcesSelected}
              onSelectedItemsChange={(event, itemId) => setSourcesSelected(itemId)}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
