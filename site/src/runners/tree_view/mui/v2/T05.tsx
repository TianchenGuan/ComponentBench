'use client';

/**
 * tree_view-mui-v2-T05: Reference path dialog — exact expansions plus selected destination
 *
 * Modal flow. "Move…" opens dialog with RichTreeView (left) and destination preview (right)
 * showing "Documents / Personal / Travel". Tree: Documents→{Company, Personal→{Travel[target], Taxes}},
 * Pictures→{Vacation}. All collapsed. Dialog footer: Cancel, Move here.
 * Success: selected = documents/personal/travel, expanded = exactly {documents, documents/personal},
 *          "Move here" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Button, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, Chip, Paper,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const treeItems = [
  {
    id: 'documents', label: 'Documents',
    children: [
      { id: 'documents/company', label: 'Company' },
      {
        id: 'documents/personal', label: 'Personal',
        children: [
          { id: 'documents/personal/travel', label: 'Travel' },
          { id: 'documents/personal/taxes', label: 'Taxes' },
        ],
      },
    ],
  },
  {
    id: 'pictures', label: 'Pictures',
    children: [
      { id: 'pictures/vacation', label: 'Vacation' },
    ],
  },
];

const REQUIRED_EXPANDED = ['documents', 'documents/personal'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selectedItem === 'documents/personal/travel' &&
      setsEqual(expandedItems, REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedItem, expandedItems, onSuccess]);

  const handleMove = () => {
    setCommitted(true);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500 }}>
      <Typography variant="h5" gutterBottom>Files</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography color="text.secondary">report_draft.pdf — 2.4 MB</Typography>
      </Paper>
      <Button variant="contained" onClick={() => setDialogOpen(true)}>Move…</Button>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move to folder</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <RichTreeView
                items={treeItems}
                expandedItems={expandedItems}
                onExpandedItemsChange={(_e, ids) => { setExpandedItems(ids); setCommitted(false); }}
                selectedItems={selectedItem}
                onSelectedItemsChange={(_e, id) => { setSelectedItem(id); setCommitted(false); }}
                data-testid="tree-root"
              />
            </Box>
            <Card variant="outlined" sx={{ width: 180 }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Destination preview</Typography>
                <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
                  <Chip label="Documents" size="small" />
                  <Typography>/</Typography>
                  <Chip label="Personal" size="small" />
                  <Typography>/</Typography>
                  <Chip label="Travel" size="small" color="primary" />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleMove}>Move here</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
