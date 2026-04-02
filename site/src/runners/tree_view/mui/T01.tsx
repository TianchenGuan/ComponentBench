'use client';

/**
 * tree_view-mui-T01: Expand Documents section
 *
 * Layout: isolated_card centered titled "Sidebar". Contains a single MUI X SimpleTreeView with
 * hardcoded TreeItem children.
 *
 * Tree roots: "Home", "Documents", "Pictures". Only "Documents" has children ("Company", "Personal").
 * Expansion uses the standard TreeItem expand/collapse icon at the left of the item.
 *
 * Initial state: all items are collapsed; no item is selected; focus is on the tree root.
 *
 * Success: The SimpleTreeView expanded state includes item id 'docs' (Documents).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && expandedItems.includes('docs')) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedItems, onSuccess]);

  return (
    <Card sx={{ width: 350 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Sidebar</Typography>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
          data-testid="tree-root"
        >
          <TreeItem itemId="home" label="Home" />
          <TreeItem itemId="docs" label="Documents">
            <TreeItem itemId="docs/company" label="Company" />
            <TreeItem itemId="docs/personal" label="Personal" />
          </TreeItem>
          <TreeItem itemId="pictures" label="Pictures" />
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
