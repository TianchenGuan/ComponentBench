'use client';

/**
 * tree_select-mui-T03: Clear selected folder
 *
 * Layout: isolated_card centered titled "Create shortcut".
 * Target component: composite TreeSelect labeled "Folder".
 * Initial state: Folder is already set to "Projects / Alpha".
 * Configuration: when a value is present, a clear icon button (×) appears. Clicking it resets the selection.
 *
 * Success: The Folder tree selector has an empty committed selection (no selected value).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';

const valueLabels: Record<string, string> = {
  'projects_alpha': 'Projects / Alpha',
  'projects_beta': 'Projects / Beta',
  'inbox': 'Inbox',
  'archive': 'Archive',
};

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('projects_alpha');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setValue(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && value === null) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Create shortcut</Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Folder</Typography>
        <TextField
          fullWidth
          placeholder="Select a folder"
          value={value ? valueLabels[value] || value : ''}
          onClick={handleClick}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                {value && (
                  <IconButton size="small" onClick={handleClear} data-testid="clear-button">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton size="small" onClick={handleClick}>
                  <ArrowDropDownIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          data-testid="tree-select-folder"
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
            onSelectedItemsChange={(_e, itemId) => {
              if (itemId) {
                setValue(itemId);
                handleClose();
              }
            }}
            sx={{ p: 1 }}
            data-testid="tree-view"
          >
            <TreeItem itemId="inbox" label="Inbox" />
            <TreeItem itemId="archive" label="Archive" />
            <TreeItem itemId="projects" label="Projects">
              <TreeItem itemId="projects_alpha" label="Alpha" />
              <TreeItem itemId="projects_beta" label="Beta" />
            </TreeItem>
          </SimpleTreeView>
        </Popover>
      </CardContent>
    </Card>
  );
}
