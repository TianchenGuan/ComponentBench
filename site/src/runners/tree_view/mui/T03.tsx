'use client';

/**
 * tree_view-mui-T03: Check Charts item (checkbox selection)
 *
 * Layout: isolated_card centered titled "Product Modules". Single RichTreeView configured with
 * checkboxSelection=true so each item has a checkbox. Items are grouped: "Data Grid" (with children),
 * "Charts" (leaf), and "Pickers" (with children).
 *
 * Initial state: no items are selected/checked; the tree is lightly pre-expanded so "Charts" is
 * visible at the root level.
 * Behavior: checking a box selects the corresponding item.
 *
 * Success: The selected/checked item ids include 'charts'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../types';

const items = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid/grouping', label: 'Row grouping' },
      { id: 'grid/editing', label: 'Row editing' },
    ],
  },
  { id: 'charts', label: 'Charts' },
  {
    id: 'pickers',
    label: 'Pickers',
    children: [
      { id: 'pickers/date', label: 'Date Pickers' },
      { id: 'pickers/time', label: 'Time Pickers' },
    ],
  },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedItems.includes('charts')) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItems, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Product Modules</Typography>
        <RichTreeView
          items={items}
          selectedItems={selectedItems}
          onSelectedItemsChange={(event, itemIds) => setSelectedItems(itemIds as string[])}
          multiSelect
          checkboxSelection
          data-testid="tree-root"
        />
      </CardContent>
    </Card>
  );
}
