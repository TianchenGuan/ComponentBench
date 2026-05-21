'use client';

/**
 * tree_view-mui-T04: Select exactly Date Pickers and Charts
 *
 * Layout: isolated_card centered titled "Feature List". One RichTreeView configured with
 * checkboxSelection=true and multiSelect=true.
 *
 * Tree structure:
 * • Data Grid (id=grid) → Row grouping (grid/grouping), Row editing (grid/editing)
 * • Pickers (id=pickers) → Date Pickers (pickers/date), Time Pickers (pickers/time)
 * • Charts (id=charts) [leaf]
 *
 * Initial state: Pickers is expanded by default so Date Pickers is visible; Data Grid is collapsed.
 * No items are selected.
 *
 * Success: Selected/checked item ids equal exactly {pickers/date, charts}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const items = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid/grouping', label: 'Row grouping' },
      { id: 'grid/editing', label: 'Row editing' },
    ],
  },
  {
    id: 'pickers',
    label: 'Pickers',
    children: [
      { id: 'pickers/date', label: 'Date Pickers' },
      { id: 'pickers/time', label: 'Time Pickers' },
    ],
  },
  { id: 'charts', label: 'Charts' },
];

const targetSet = ['pickers/date', 'charts'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['pickers']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selectedItems, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItems, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Feature List</Typography>
        <RichTreeView
          items={items}
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
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
