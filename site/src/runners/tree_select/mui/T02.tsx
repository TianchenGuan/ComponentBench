'use client';

/**
 * tree_select-mui-T02: Open destination popover
 *
 * Layout: isolated_card centered titled "Move message".
 * Target component: composite TreeSelect labeled "Destination".
 *   - Trigger: MUI TextField with an end-adornment chevron icon.
 *   - Overlay: MUI Popover that contains a SimpleTreeView of folders.
 * Initial state: no destination selected; placeholder text is shown.
 * Tree data: Inbox, Archive, Projects → (Alpha, Beta)
 *
 * Success: The Destination tree selector popover is open (overlay visible).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && open) {
      successFired.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <Card sx={{ width: 400 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Move message</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Subject: Weekly team sync notes
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Destination</Typography>
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
          data-testid="tree-select-destination"
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
