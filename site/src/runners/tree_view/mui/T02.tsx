'use client';

/**
 * tree_view-mui-T02: Select Pictures > Vacation > Mountains.jpg
 *
 * Layout: isolated_card centered titled "Media Library". Single SimpleTreeView with a small media hierarchy.
 *
 * Tree structure:
 * • Documents (collapsed)
 * • Pictures (collapsed, id=pics)
 *   – Vacation (id=pics/vacation)
 *      * Beach.png (id=pics/vacation/beach)
 *      * Mountains.jpg (id=pics/vacation/mountains) [TARGET]
 *   – Family (id=pics/family)
 *
 * Initial state: all roots are collapsed; selectedItems is empty.
 *
 * Success: The selected item id equals 'pics/vacation/mountains'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedItems === 'pics/vacation/mountains') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItems, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Media Library</Typography>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
          selectedItems={selectedItems}
          onSelectedItemsChange={(event, itemId) => setSelectedItems(itemId)}
          data-testid="tree-root"
        >
          <TreeItem itemId="docs" label="Documents">
            <TreeItem itemId="docs/work" label="Work" />
          </TreeItem>
          <TreeItem itemId="pics" label="Pictures">
            <TreeItem itemId="pics/vacation" label="Vacation">
              <TreeItem itemId="pics/vacation/beach" label="Beach.png" />
              <TreeItem itemId="pics/vacation/mountains" label="Mountains.jpg" />
            </TreeItem>
            <TreeItem itemId="pics/family" label="Family">
              <TreeItem itemId="pics/family/reunion" label="Reunion.jpg" />
            </TreeItem>
          </TreeItem>
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
