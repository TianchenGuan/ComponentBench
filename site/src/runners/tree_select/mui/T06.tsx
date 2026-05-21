'use client';

/**
 * tree_select-mui-T06: Move: choose To folder (2 instances)
 *
 * Layout: isolated_card centered titled "Move file".
 * Target components: TWO composite TreeSelects stacked vertically:
 *   1) "From folder" (pre-filled with "Folders / Inbox") — not the target
 *   2) "To folder" (empty) ← TARGET
 * Both instances use the same folder tree:
 *   - Folders → Inbox, Projects → (Alpha, Beta, Gamma), Archive
 *
 * Success: The TreeSelect labeled "To folder" is set to leaf path [Folders, Projects, Beta] with value 'folder_projects_beta'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton, Box } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const valueLabels: Record<string, string> = {
  folder_inbox: 'Folders / Inbox',
  folder_projects_alpha: 'Folders / Projects / Alpha',
  folder_projects_beta: 'Folders / Projects / Beta',
  folder_projects_gamma: 'Folders / Projects / Gamma',
  folder_archive: 'Folders / Archive',
};

const leafIds = new Set(Object.keys(valueLabels));

export default function T06({ onSuccess }: TaskComponentProps) {
  const [fromValue, setFromValue] = useState<string | null>('folder_inbox');
  const [toValue, setToValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);
  const successFired = useRef(false);

  const handleClick = (field: 'from' | 'to') => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setActiveField(field);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveField(null);
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && leafIds.has(itemId)) {
      if (activeField === 'from') {
        setFromValue(itemId);
      } else if (activeField === 'to') {
        setToValue(itemId);
      }
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && toValue === 'folder_projects_beta') {
      successFired.current = true;
      onSuccess();
    }
  }, [toValue, onSuccess]);

  const renderTreeView = () => (
    <SimpleTreeView
      onSelectedItemsChange={handleSelect}
      sx={{ p: 1 }}
      data-testid="tree-view"
    >
      <TreeItem itemId="folders" label="Folders">
        <TreeItem itemId="folder_inbox" label="Inbox" />
        <TreeItem itemId="folder_projects" label="Projects">
          <TreeItem itemId="folder_projects_alpha" label="Alpha" />
          <TreeItem itemId="folder_projects_beta" label="Beta" />
          <TreeItem itemId="folder_projects_gamma" label="Gamma" />
        </TreeItem>
        <TreeItem itemId="folder_archive" label="Archive" />
      </TreeItem>
    </SimpleTreeView>
  );

  return (
    <Card sx={{ width: 420 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Move file</Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>From folder</Typography>
          <TextField
            fullWidth
            placeholder="Select a folder"
            value={fromValue ? valueLabels[fromValue] || fromValue : ''}
            onClick={handleClick('from')}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClick('from')}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            data-testid="tree-select-from-folder"
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>To folder</Typography>
          <TextField
            fullWidth
            placeholder="Select a folder"
            value={toValue ? valueLabels[toValue] || toValue : ''}
            onClick={handleClick('to')}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClick('to')}>
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            data-testid="tree-select-to-folder"
          />
        </Box>
      </CardContent>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 350, maxHeight: 300, overflow: 'auto' } } }}
      >
        {renderTreeView()}
      </Popover>
    </Card>
  );
}
