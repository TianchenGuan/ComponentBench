'use client';

/**
 * tree_view-mui-T07: Open Move dialog and select Personal folder
 *
 * Layout: modal_flow. The page shows a file row with a primary button "Move…". Clicking it opens
 * a centered MUI Dialog titled "Move to folder".
 *
 * Inside the dialog:
 * • Left side: a RichTreeView listing folders (Documents → Company, Personal; Pictures → Vacation).
 * • Right side: a "Destination preview" box showing a folder icon and the label "Personal" (visual reference + text).
 *
 * Initial state: the dialog is closed. When opened, the tree is collapsed at roots and nothing is selected.
 * The dialog also has buttons "Cancel" and "Move here", but they are not required for success.
 *
 * Success: Within the dialog's folder tree, the selected item id equals 'docs/personal'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { FolderOutlined } from '@mui/icons-material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import type { TaskComponentProps } from '../types';

const folderItems = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'docs/company', label: 'Company' },
      { id: 'docs/personal', label: 'Personal' },
    ],
  },
  {
    id: 'pics',
    label: 'Pictures',
    children: [
      { id: 'pics/vacation', label: 'Vacation' },
    ],
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && selectedItem === 'docs/personal') {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItem, onSuccess]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setExpandedItems([]);
    setSelectedItem(null);
  };

  return (
    <>
      <Card sx={{ width: 400 }} data-testid="tree-card">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FolderOutlined />
            <Typography sx={{ flex: 1 }}>report.pdf</Typography>
            <Button variant="contained" onClick={handleDialogOpen}>
              Move…
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move to folder</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
            {/* Left: Folder tree */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Select destination</Typography>
              <RichTreeView
                items={folderItems}
                expandedItems={expandedItems}
                onExpandedItemsChange={(event, itemIds) => setExpandedItems(itemIds)}
                selectedItems={selectedItem}
                onSelectedItemsChange={(event, itemId) => setSelectedItem(itemId)}
                data-testid="dialog-tree"
              />
            </Box>

            {/* Right: Preview */}
            <Box sx={{ flex: 1, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Destination preview</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <FolderOutlined color="primary" />
                <Typography fontWeight="bold">Personal</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!selectedItem}>Move here</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
