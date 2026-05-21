'use client';

/**
 * tree_select-mui-v2-T16: Exact two-item replacement set after wrong default selection
 *
 * Settings panel. Checkbox-style MUI tree-select with initial set {Metrics/API/p95, Metrics/API/p99}.
 * Must remove p99, keep p95, add Logs/App/Error. Final = {metrics-api-p95, logs-app-error}.
 * Click "Save signals".
 *
 * Success: Exact set = {metrics-api-p95, logs-app-error}, Save signals clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Divider,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const treeItems = [
  {
    id: 'metrics', label: 'Metrics', children: [
      {
        id: 'metrics-api', label: 'API', children: [
          { id: 'metrics-api-p50', label: 'p50' },
          { id: 'metrics-api-p95', label: 'p95' },
          { id: 'metrics-api-p99', label: 'p99' },
        ],
      },
      {
        id: 'metrics-web', label: 'Web', children: [
          { id: 'metrics-web-p95', label: 'p95' },
          { id: 'metrics-web-p99', label: 'p99' },
        ],
      },
    ],
  },
  {
    id: 'logs', label: 'Logs', children: [
      {
        id: 'logs-app', label: 'App', children: [
          { id: 'logs-app-error', label: 'Error' },
          { id: 'logs-app-warn', label: 'Warn' },
          { id: 'logs-app-info', label: 'Info' },
        ],
      },
    ],
  },
];

const LEAF_IDS = new Set([
  'metrics-api-p50', 'metrics-api-p95', 'metrics-api-p99',
  'metrics-web-p95', 'metrics-web-p99',
  'logs-app-error', 'logs-app-warn', 'logs-app-info',
]);

const TARGET_SET = ['metrics-api-p95', 'logs-app-error'];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['metrics-api-p95', 'metrics-api-p99']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed) {
      const leafOnly = selected.filter((id) => LEAF_IDS.has(id));
      if (setsEqual(leafOnly, TARGET_SET)) {
        successFired.current = true;
        onSuccess();
      }
    }
  }, [committed, selected, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 480, ml: 6 }}>
      <Typography variant="h6" gutterBottom>Observability Settings</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Chip label="Env: staging" size="small" />
        <Chip label="Retention: 30d" size="small" variant="outlined" />
      </Box>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Included signals</Typography>
          <Box sx={{ maxHeight: 350, overflow: 'auto', mb: 2 }}>
            <RichTreeView
              items={treeItems}
              multiSelect
              checkboxSelection
              selectedItems={selected}
              onSelectedItemsChange={(_e, ids) => { setSelected(ids); setCommitted(false); }}
            />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Button variant="contained" onClick={() => setCommitted(true)}>Save signals</Button>
        </CardContent>
      </Card>
    </Box>
  );
}
