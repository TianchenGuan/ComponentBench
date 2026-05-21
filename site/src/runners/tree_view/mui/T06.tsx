'use client';

/**
 * tree_view-mui-T06: Keyboard focus to Settings > Security
 *
 * Layout: isolated_card centered titled "Keyboard Navigation". Single SimpleTreeView configured so
 * items are focusable but not selectable (selection is disabled; clicking does not create a selected state).
 * A visible focus outline appears on the currently focused tree item.
 *
 * Tree structure:
 * • General (id=kb/general)
 * • Settings (id=kb/settings)
 *   – Profile (kb/settings/profile)
 *   – Security (kb/settings/security) [TARGET]
 *   – Billing (kb/settings/billing)
 *
 * Initial state: the tree has keyboard focus, and the focused item is "General". Settings is collapsed.
 *
 * Success: The focused tree item id equals 'kb/settings/security'. No item is selected.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [focusedItem, setFocusedItem] = useState<string>('kb/general');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && focusedItem === 'kb/settings/security') {
      successFired.current = true;
      onSuccess();
    }
  }, [focusedItem, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Keyboard Navigation</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use arrow keys to navigate. Focus indicator shows current item.
        </Typography>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
          onItemFocus={(event, itemId) => setFocusedItem(itemId)}
          disableSelection
          data-testid="tree-root"
          sx={{
            '& .Mui-focused > .MuiTreeItem-content': {
              outline: '2px solid #1976d2',
              outlineOffset: '2px',
            },
          }}
        >
          <TreeItem itemId="kb/general" label="General" />
          <TreeItem itemId="kb/settings" label="Settings">
            <TreeItem itemId="kb/settings/profile" label="Profile" />
            <TreeItem itemId="kb/settings/security" label="Security" />
            <TreeItem itemId="kb/settings/billing" label="Billing" />
          </TreeItem>
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
