'use client';

/**
 * tree_view-mui-v2-T07: Controlled-expansion review tree — exact open branches plus target selection
 *
 * Settings panel. RichTreeView with controlled expansion. Initial expanded: Security→Keys→{Rotate keys, Revoke keys},
 * Security→Sessions, Billing→Plans. Legacy collapsed. Target visible but extra branches open.
 * Success: selected = security/keys/rotate, expanded = exactly {security, security/keys},
 *          "Apply review" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Typography, Button, Box, Card, CardContent, Paper,
} from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const items = [
  {
    id: 'security', label: 'Security',
    children: [
      {
        id: 'security/keys', label: 'Keys',
        children: [
          { id: 'security/keys/rotate', label: 'Rotate keys' },
          { id: 'security/keys/revoke', label: 'Revoke keys' },
        ],
      },
      { id: 'security/sessions', label: 'Sessions' },
    ],
  },
  {
    id: 'billing', label: 'Billing',
    children: [
      { id: 'billing/plans', label: 'Plans' },
    ],
  },
  { id: 'legacy', label: 'Legacy' },
];

const REQUIRED_EXPANDED = ['security', 'security/keys'];
const BRANCH_IDS = new Set(['security', 'security/keys', 'billing']);

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([
    'security', 'security/keys', 'billing',
  ]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const branchExpanded = expandedItems.filter(id => BRANCH_IDS.has(id));
    if (
      committed &&
      selectedItem === 'security/keys/rotate' &&
      setsEqual(branchExpanded, REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedItem, expandedItems, onSuccess]);

  return (
    <Box sx={{ p: 2, maxWidth: 480 }}>
      <Typography variant="h5" gutterBottom>Review</Typography>

      <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Collapse irrelevant branches and confirm the target scope.
        </Typography>
      </Paper>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Review tree</Typography>
          <RichTreeView
            items={items}
            expandedItems={expandedItems}
            onExpandedItemsChange={(_e, ids) => { setExpandedItems(ids); setCommitted(false); }}
            selectedItems={selectedItem}
            onSelectedItemsChange={(_e, id) => { setSelectedItem(id); setCommitted(false); }}
            data-testid="tree-root"
          />
          <Box sx={{ mt: 2, textAlign: 'right', borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
            <Button variant="contained" size="small" onClick={() => setCommitted(true)}>
              Apply review
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
