'use client';

/**
 * virtual_list-mui-T10: Clear a preselected multi-selection with a confirmation dialog
 *
 * Layout: modal_flow. The main view is a centered card titled "Saved Searches".
 * Target component: a react-window virtualized list (height ~340px) with checkboxes (multi-select).
 * Initial state: 6 items are already checked, and at least 2 of them are offscreen below the fold.
 * Controls: a small toolbar above the list includes an icon button "Clear all".
 * Confirmation: clicking "Clear all" opens a MUI Dialog with "Cancel" and destructive "Clear".
 *
 * Success: All items cleared AND "Clear" is clicked in dialog
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, ListItem, ListItemButton, ListItemText, Checkbox, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Box, IconButton, Toolbar } from '@mui/material';
import { ClearAll, SelectAll } from '@mui/icons-material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

interface SearchItem {
  key: string;
  name: string;
  query: string;
}

// Generate 100 saved searches
const generateSearches = (): SearchItem[] => {
  const names = ['Recent orders', 'Active users', 'Pending reviews', 'High priority', 'This week', 'Last month', 'Archived', 'Favorites'];
  return Array.from({ length: 100 }, (_, i) => ({
    key: `search-${String(i + 1).padStart(3, '0')}`,
    name: `${names[i % names.length]} ${i + 1}`,
    query: `status:${names[i % names.length].toLowerCase().replace(' ', '_')}`,
  }));
};

const searches = generateSearches();
// Pre-checked items: some visible, some offscreen
const INITIAL_CHECKED = ['search-001', 'search-003', 'search-005', 'search-020', 'search-025', 'search-030'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set(INITIAL_CHECKED));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hasConfirmedClear, setHasConfirmedClear] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleClearAllClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmClear = () => {
    setCheckedKeys(new Set());
    setDialogOpen(false);
    setHasConfirmedClear(true);
    setShowToast(true);
  };

  const handleCancelClear = () => {
    setDialogOpen(false);
  };

  // Check success condition
  useEffect(() => {
    if (hasConfirmedClear && selectionSetEquals(checkedKeys, [])) {
      onSuccess();
    }
  }, [hasConfirmedClear, checkedKeys, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = searches[index];
    const isChecked = checkedKeys.has(item.key);
    return (
      <ListItem
        style={style}
        disablePadding
        data-item-key={item.key}
        aria-checked={isChecked}
      >
        <ListItemButton onClick={() => handleToggleCheck(item.key)}>
          <Checkbox
            edge="start"
            checked={isChecked}
            disableRipple
          />
          <ListItemText 
            primary={item.name}
            secondary={item.query}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <>
      <Paper elevation={2} sx={{ width: 420, p: 2 }} data-testid="vl-primary">
        <Typography variant="h6" gutterBottom>
          Saved Searches
        </Typography>
        
        <Toolbar variant="dense" sx={{ bgcolor: 'grey.100', borderRadius: 1, mb: 1, gap: 1 }}>
          <Typography variant="body2" sx={{ flex: 1 }}>
            Selected: {checkedKeys.size}
          </Typography>
          <IconButton size="small" title="Select all">
            <SelectAll fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={handleClearAllClick}
            title="Clear all"
            disabled={checkedKeys.size === 0}
          >
            <ClearAll fontSize="small" />
          </IconButton>
        </Toolbar>

        <Paper variant="outlined">
          <FixedSizeList
            height={340}
            width="100%"
            itemSize={56}
            itemCount={searches.length}
            overscanCount={5}
          >
            {Row}
          </FixedSizeList>
        </Paper>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleCancelClear}>
        <DialogTitle>Clear selection?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            This will uncheck all {checkedKeys.size} selected items.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClear}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="error">
            Clear
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        message="Selection cleared"
      />
    </>
  );
}
