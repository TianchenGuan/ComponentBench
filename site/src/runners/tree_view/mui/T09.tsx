'use client';

/**
 * tree_view-mui-T09: Lazy-load Remote folder and select 2026 Plan
 *
 * Layout: isolated_card positioned near the top-left of the viewport titled "Remote Files".
 * Contains a RichTreeView configured for lazy loading of children (dataSource-backed).
 * Expandable items show a loading indicator/spinner briefly when first expanded.
 *
 * Tree roots:
 * • Remote (id=remote) [children are NOT in the initial items; they load on first expand]
 * • Local cache (id=local) [already populated]
 *
 * When "Remote" is expanded, it loads children after a short delay: "2025 Plan.docx" (remote/plan-2025)
 * and "2026 Plan.docx" (remote/plan-2026) [TARGET].
 *
 * Initial state: both roots are collapsed; no selection.
 *
 * Success: The selected item id equals 'remote/plan-2026' (2026 Plan.docx).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../types';

interface RemoteItem {
  id: string;
  label: string;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [remoteChildren, setRemoteChildren] = useState<RemoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedItem === 'remote/plan-2026') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItem, onSuccess]);

  // Handle lazy loading when Remote is expanded
  useEffect(() => {
    if (expandedItems.includes('remote') && remoteChildren.length === 0 && !isLoading) {
      setIsLoading(true);
      // Simulate async loading
      setTimeout(() => {
        setRemoteChildren([
          { id: 'remote/plan-2025', label: '2025 Plan.docx' },
          { id: 'remote/plan-2026', label: '2026 Plan.docx' },
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [expandedItems, remoteChildren.length, isLoading]);

  return (
    <Card sx={{ width: 350 }} data-testid="tree-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Remote Files</Typography>
        <SimpleTreeView
          expandedItems={expandedItems}
          onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
          selectedItems={selectedItem}
          onSelectedItemsChange={(event, itemId) => setSelectedItem(itemId)}
          data-testid="tree-root"
        >
          <TreeItem itemId="remote" label="Remote">
            {isLoading ? (
              <TreeItem
                itemId="remote-loading"
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={14} />
                    <span>Loading...</span>
                  </Box>
                }
                disabled
              />
            ) : remoteChildren.length > 0 ? (
              remoteChildren.map(child => (
                <TreeItem key={child.id} itemId={child.id} label={child.label} />
              ))
            ) : (
              // Show a placeholder to allow expansion
              <TreeItem itemId="remote-placeholder" label="..." disabled sx={{ display: 'none' }} />
            )}
          </TreeItem>
          <TreeItem itemId="local" label="Local cache">
            <TreeItem itemId="local/cache-2024" label="cache-2024.dat" />
            <TreeItem itemId="local/cache-2025" label="cache-2025.dat" />
          </TreeItem>
        </SimpleTreeView>
      </CardContent>
    </Card>
  );
}
