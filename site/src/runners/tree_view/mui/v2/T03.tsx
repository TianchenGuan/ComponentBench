'use client';

/**
 * tree_view-mui-v2-T03: Lazy-load archive tree in drawer and choose the 2027 plan
 *
 * Drawer flow. Archive summary page with counts/badges. "Restore from archive" opens right drawer
 * with RichTreeView labeled "Archive tree". Customers visible; expanding Customers reveals Enterprise/SMB.
 * Expanding Enterprise triggers loading then shows Plan 2026, Plan 2027[target], Notes.
 * Success: selected = customers/enterprise/plan_2027, expanded superset includes {customers, customers/enterprise},
 *          "Restore selection" clicked.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card, CardContent, Typography, Button, Box, Stack, Drawer, Chip, CircularProgress,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import type { TaskComponentProps } from '../../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [enterpriseLoaded, setEnterpriseLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      selectedItem === 'customers/enterprise/plan_2027' &&
      expandedItems.includes('customers') &&
      expandedItems.includes('customers/enterprise')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedItem, expandedItems, onSuccess]);

  const handleExpand = useCallback((_event: React.SyntheticEvent, itemIds: string[]) => {
    setExpandedItems(itemIds);
    setCommitted(false);
    if (itemIds.includes('customers/enterprise') && !enterpriseLoaded) {
      setLoading(true);
      setTimeout(() => {
        setEnterpriseLoaded(true);
        setLoading(false);
      }, 700);
    }
  }, [enterpriseLoaded]);

  const handleRestore = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 640 }}>
      <Typography variant="h5" gutterBottom>Archive</Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Total archived</Typography>
            <Typography variant="h6">142</Typography>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="caption" color="text.secondary">Categories</Typography>
            <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
              <Chip label="Customers" size="small" /><Chip label="Projects" size="small" />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Button variant="contained" onClick={() => setDrawerOpen(true)}>Restore from archive</Button>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 360, display: 'flex', flexDirection: 'column' } }}>
        <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
          <Typography variant="subtitle1" gutterBottom>Archive tree</Typography>
          <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={handleExpand}
            selectedItems={selectedItem}
            onSelectedItemsChange={(_e, id) => { setSelectedItem(id); setCommitted(false); }}
            data-testid="tree-root"
          >
            <TreeItem itemId="customers" label="Customers">
              <TreeItem itemId="customers/enterprise" label="Enterprise">
                {!enterpriseLoaded && !loading && (
                  <TreeItem itemId="__placeholder" label="..." disabled />
                )}
                {loading && <TreeItem itemId="__loading" label={<CircularProgress size={14} />} disabled />}
                {enterpriseLoaded && (
                  <>
                    <TreeItem itemId="customers/enterprise/plan_2026" label="Plan 2026" />
                    <TreeItem itemId="customers/enterprise/plan_2027" label="Plan 2027" />
                    <TreeItem itemId="customers/enterprise/notes" label="Notes" />
                  </>
                )}
              </TreeItem>
              <TreeItem itemId="customers/smb" label="SMB" />
            </TreeItem>
          </SimpleTreeView>
        </Box>
        <Stack direction="row" spacing={1} sx={{ p: 2, justifyContent: 'flex-end', borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRestore}>Restore selection</Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
