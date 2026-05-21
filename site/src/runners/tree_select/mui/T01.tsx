'use client';

/**
 * tree_select-mui-T01: Pick Ultrabooks (basic composite)
 *
 * Layout: isolated_card centered titled "New item".
 * Implementation: composite TreeSelect built from:
 *   - a MUI TextField trigger labeled "Category",
 *   - a MUI Popover anchored to the TextField,
 *   - a MUI X SimpleTreeView inside the Popover.
 * Initial state: Category is empty and shows placeholder "Select a category".
 * Tree options (depth=4):
 *   - Catalog → Hardware → Laptops → (Ultrabooks, Gaming laptops), Monitors
 *   - Catalog → Software → (Productivity, Security)
 * Behavior: selecting a leaf TreeItem commits immediately and closes the popover.
 *
 * Success: The Category tree selector's committed value equals the leaf path
 * [Catalog, Hardware, Laptops, Ultrabooks] with value 'cat_catalog_hw_laptops_ultrabooks'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

// Map of value to display label
const valueLabels: Record<string, string> = {
  cat_catalog_hw_laptops_ultrabooks: 'Catalog / Hardware / Laptops / Ultrabooks',
  cat_catalog_hw_laptops_gaming: 'Catalog / Hardware / Laptops / Gaming laptops',
  cat_catalog_hw_monitors: 'Catalog / Hardware / Monitors',
  cat_catalog_sw_productivity: 'Catalog / Software / Productivity',
  cat_catalog_sw_security: 'Catalog / Software / Security',
};

const leafIds = new Set(Object.keys(valueLabels));

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && leafIds.has(itemId)) {
      setValue(itemId);
      handleClose();
    }
  };

  useEffect(() => {
    if (!successFired.current && value === 'cat_catalog_hw_laptops_ultrabooks') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const open = Boolean(anchorEl);

  return (
    <Card sx={{ width: 450 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>New item</Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Category</Typography>
        <TextField
          fullWidth
          placeholder="Select a category"
          value={value ? valueLabels[value] || value : ''}
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
          data-testid="tree-select-category"
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { width: 400, maxHeight: 350, overflow: 'auto' } } }}
        >
          <SimpleTreeView
            onSelectedItemsChange={handleSelect}
            sx={{ p: 1 }}
            data-testid="tree-view"
          >
            <TreeItem itemId="catalog" label="Catalog">
              <TreeItem itemId="catalog_hw" label="Hardware">
                <TreeItem itemId="catalog_hw_laptops" label="Laptops">
                  <TreeItem itemId="cat_catalog_hw_laptops_ultrabooks" label="Ultrabooks" />
                  <TreeItem itemId="cat_catalog_hw_laptops_gaming" label="Gaming laptops" />
                </TreeItem>
                <TreeItem itemId="cat_catalog_hw_monitors" label="Monitors" />
              </TreeItem>
              <TreeItem itemId="catalog_sw" label="Software">
                <TreeItem itemId="cat_catalog_sw_productivity" label="Productivity" />
                <TreeItem itemId="cat_catalog_sw_security" label="Security" />
              </TreeItem>
            </TreeItem>
          </SimpleTreeView>
        </Popover>
      </CardContent>
    </Card>
  );
}
