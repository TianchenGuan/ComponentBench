'use client';

/**
 * tree_select-mui-T07: Expand Projects branch (disclosure only)
 *
 * Layout: isolated_card centered titled "Browse storage".
 * Target component: composite TreeSelect labeled "Browse" (starts empty).
 * Popover contents: a SimpleTreeView where expansion is limited to the icon container.
 *   - Clicking a node label would select it; the user must aim for expand icons.
 * Tree data:
 *   - Folders → Projects → (Alpha, Beta, Gamma), Archive
 *   - Shared
 * Initial state: all nodes collapsed; popover closed.
 *
 * Success: The Browse tree selector popover is open, and expanded nodes include Folders and Folders/Projects.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    // Success when popover is open AND both 'folders' and 'folders_projects' are expanded
    if (
      !successFired.current &&
      open &&
      expandedItems.includes('folders') &&
      expandedItems.includes('folders_projects')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, expandedItems, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Browse storage</Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Browse</Typography>
        <TextField
          fullWidth
          placeholder="Select a folder"
          value={value || ''}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClick}>
                  <ArrowDropDownIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          data-testid="tree-select-browse"
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { width: 350, maxHeight: 300, overflow: 'auto' } } }}
        >
          <SimpleTreeView
            expandedItems={expandedItems}
            onExpandedItemsChange={(_event, itemIds) => setExpandedItems(itemIds)}
            onSelectedItemsChange={(_e, itemId) => {
              // For this task, we don't want selection to close the popover
              // Keep popover open so user can expand nodes
              if (itemId) {
                setValue(itemId);
                // Don't close - task is about expansion, not selection
              }
            }}
            sx={{ p: 1 }}
            data-testid="tree-view"
          >
            <TreeItem itemId="folders" label="Folders">
              <TreeItem itemId="folders_projects" label="Projects">
                <TreeItem itemId="folders_projects_alpha" label="Alpha" />
                <TreeItem itemId="folders_projects_beta" label="Beta" />
                <TreeItem itemId="folders_projects_gamma" label="Gamma" />
              </TreeItem>
              <TreeItem itemId="folders_archive" label="Archive" />
            </TreeItem>
            <TreeItem itemId="shared" label="Shared" />
          </SimpleTreeView>
        </Popover>
      </CardContent>
    </Card>
  );
}
