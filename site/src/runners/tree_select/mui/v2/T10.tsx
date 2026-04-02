'use client';

/**
 * tree_select-mui-v2-T10: Drawer resources selector — exact checked leaf set only
 *
 * Drawer with RichTreeView checkboxSelection. Select exactly three leaves:
 * Resources/Dashboards/SRE, Resources/Runbooks/API, Resources/Alerts/P1.
 * Parents are not valid targets. Click "Save access".
 *
 * Success: Exact set = {resources-dashboards-sre, resources-runbooks-api, resources-alerts-p1}, Save clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Typography, Button, Drawer, Divider, Switch, FormControlLabel, Chip,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { setsEqual } from '../../types';
import type { TaskComponentProps } from '../../types';

const treeItems = [
  {
    id: 'resources', label: 'Resources', children: [
      {
        id: 'resources-dashboards', label: 'Dashboards', children: [
          { id: 'resources-dashboards-sre', label: 'SRE' },
          { id: 'resources-dashboards-product', label: 'Product' },
          { id: 'resources-dashboards-exec', label: 'Executive' },
        ],
      },
      {
        id: 'resources-runbooks', label: 'Runbooks', children: [
          { id: 'resources-runbooks-api', label: 'API' },
          { id: 'resources-runbooks-infra', label: 'Infra' },
          { id: 'resources-runbooks-deploy', label: 'Deploy' },
        ],
      },
      {
        id: 'resources-alerts', label: 'Alerts', children: [
          { id: 'resources-alerts-p1', label: 'P1' },
          { id: 'resources-alerts-p2', label: 'P2' },
          { id: 'resources-alerts-p3', label: 'P3' },
        ],
      },
    ],
  },
];

const LEAF_IDS = new Set([
  'resources-dashboards-sre', 'resources-dashboards-product', 'resources-dashboards-exec',
  'resources-runbooks-api', 'resources-runbooks-infra', 'resources-runbooks-deploy',
  'resources-alerts-p1', 'resources-alerts-p2', 'resources-alerts-p3',
]);

const TARGET_SET = ['resources-dashboards-sre', 'resources-runbooks-api', 'resources-alerts-p1'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
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

  const handleSave = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Access Management</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Chip label="Team: SRE" size="small" />
        <Chip label="Role: Admin" size="small" variant="outlined" />
      </Box>
      <Button variant="contained" onClick={() => setDrawerOpen(true)}>Resource access</Button>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 380, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography variant="h6" gutterBottom>Resource Access</Typography>
          <FormControlLabel control={<Switch defaultChecked size="small" />} label="Inherit parent" />
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>Allowed resources</Typography>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <RichTreeView
              items={treeItems}
              multiSelect
              checkboxSelection
              selectedItems={selected}
              onSelectedItemsChange={(_e, ids) => { setSelected(ids); setCommitted(false); }}
            />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Chip label="Hint: select leaf items only" size="small" variant="outlined" sx={{ mb: 1, alignSelf: 'flex-start' }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save access</Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
