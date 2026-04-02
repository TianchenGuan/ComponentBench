'use client';

/**
 * tree_view-mui-v2-T08: Exact cross-branch checked set in permission tree with local commit
 *
 * Modal flow. "Edit scope" opens dialog with RichTreeView checkboxSelection + multiSelect.
 * Tree: Pickers(expanded)→{Date Pickers[target], Time Pickers[checked by default]},
 *       Charts[target leaf], Settings(expanded)→{Notifications[target], Billing}.
 * Success: committed checked = exactly {pickers/date, charts, settings/notifications},
 *          Time Pickers NOT checked, "Apply scope" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Paper,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const items = [
  {
    id: 'pickers', label: 'Pickers',
    children: [
      { id: 'pickers/date', label: 'Date Pickers' },
      { id: 'pickers/time', label: 'Time Pickers' },
    ],
  },
  { id: 'charts', label: 'Charts' },
  {
    id: 'settings', label: 'Settings',
    children: [
      { id: 'settings/notifications', label: 'Notifications' },
      { id: 'settings/billing', label: 'Billing' },
    ],
  },
];

const TARGET_CHECKED = ['pickers/date', 'charts', 'settings/notifications'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(['pickers/time']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(selectedItems, TARGET_CHECKED)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedItems, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 480 }}>
      <Typography variant="h5" gutterBottom>Permissions</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography color="text.secondary" variant="body2">Current scope: 1 item selected</Typography>
      </Paper>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Edit scope</Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Permission scope</DialogTitle>
        <DialogContent>
          <RichTreeView
            items={items}
            defaultExpandedItems={['pickers', 'settings']}
            selectedItems={selectedItems}
            onSelectedItemsChange={(_e, ids) => { setSelectedItems(ids as string[]); setCommitted(false); }}
            multiSelect
            checkboxSelection
            data-testid="tree-root"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApply}>Apply scope</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
