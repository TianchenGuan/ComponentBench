'use client';

/**
 * tree_view-mui-v2-T01: Feature access trees — check exact leaves in Product outline only
 *
 * Dashboard with KPI cards, chart, two adjacent RichTreeView panels.
 * Target: "Product outline" — Settings→{Notifications, Integrations, Billing}, Tasks→{Backlog, Done}.
 * Distractor: "Data sources" — Settings→{API Keys, Webhooks, Billing feed}, Storage→{S3, GCS}.
 * Both collapsed, nothing checked. Target panel has "Apply outline".
 * Success: target checked = exactly {outline/settings/notifications, outline/settings/integrations},
 *          Data sources unchanged, "Apply outline" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Stack, Paper } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const outlineItems = [
  {
    id: 'outline/settings', label: 'Settings',
    children: [
      { id: 'outline/settings/notifications', label: 'Notifications' },
      { id: 'outline/settings/integrations', label: 'Integrations' },
      { id: 'outline/settings/billing', label: 'Billing' },
    ],
  },
  {
    id: 'outline/tasks', label: 'Tasks',
    children: [
      { id: 'outline/tasks/backlog', label: 'Backlog' },
      { id: 'outline/tasks/done', label: 'Done' },
    ],
  },
];

const dataSourceItems = [
  {
    id: 'ds/settings', label: 'Settings',
    children: [
      { id: 'ds/settings/api_keys', label: 'API Keys' },
      { id: 'ds/settings/webhooks', label: 'Webhooks' },
      { id: 'ds/settings/billing_feed', label: 'Billing feed' },
    ],
  },
  {
    id: 'ds/storage', label: 'Storage',
    children: [
      { id: 'ds/storage/s3', label: 'S3' },
      { id: 'ds/storage/gcs', label: 'GCS' },
    ],
  },
];

const TARGET_CHECKED = ['outline/settings/notifications', 'outline/settings/integrations'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [outlineSelected, setOutlineSelected] = useState<string[]>([]);
  const [dsSelected, setDsSelected] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(outlineSelected, TARGET_CHECKED)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, outlineSelected, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 800 }}>
      <Typography variant="h5" gutterBottom>Dashboard</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {[['Users', '1,204'], ['Events', '9,312'], ['Uptime', '99.8%'], ['Alerts', '5']].map(([k, v]) => (
          <Paper key={k} sx={{ p: 1.5, flex: 1, textAlign: 'center' }} variant="outlined">
            <Typography variant="caption" color="text.secondary">{k}</Typography>
            <Typography variant="h6">{v}</Typography>
          </Paper>
        ))}
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">Chart placeholder — feature usage</Typography>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Data sources</Typography>
            <RichTreeView items={dataSourceItems}
              selectedItems={dsSelected}
              onSelectedItemsChange={(_e, ids) => setDsSelected(ids as string[])}
              multiSelect checkboxSelection
            />
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>Product outline</Typography>
            <RichTreeView items={outlineItems}
              selectedItems={outlineSelected}
              onSelectedItemsChange={(_e, ids) => { setOutlineSelected(ids as string[]); setCommitted(false); }}
              multiSelect checkboxSelection
              data-testid="tree-root"
            />
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button variant="contained" size="small" onClick={() => setCommitted(true)}>
                Apply outline
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
