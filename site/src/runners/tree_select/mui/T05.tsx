'use client';

/**
 * tree_select-mui-T05: Select three report sections (checkbox multi-select)
 *
 * Layout: isolated_card centered titled "Export report".
 * Target component: composite TreeSelect labeled "Included sections".
 * Popover contents: A SimpleTreeView configured with checkbox selection.
 * Tree data:
 *   - Reports → (Revenue, Costs, Forecast, Retention)
 *   - Logs → (Auth, Errors)
 * Initial state: nothing selected.
 * Feedback: each checkbox toggle immediately updates a chip list.
 *
 * Success: Included sections selection set equals {Reports/Revenue, Reports/Costs, Reports/Forecast}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton, Box, Chip } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const valueLabels: Record<string, string> = {
  rep_revenue: 'Revenue',
  rep_costs: 'Costs',
  rep_forecast: 'Forecast',
  rep_retention: 'Retention',
  log_auth: 'Auth',
  log_errors: 'Errors',
};

const leafIds = new Set(Object.keys(valueLabels));
const TARGET_VALUES = ['rep_revenue', 'rep_costs', 'rep_forecast'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemSelectionToggle = (
    _event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean
  ) => {
    if (leafIds.has(itemId)) {
      setSelectedItems((prev) =>
        isSelected ? [...prev, itemId] : prev.filter((id) => id !== itemId)
      );
    }
  };

  const handleRemoveChip = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && setsEqual(selectedItems, TARGET_VALUES)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedItems, onSuccess]);

  return (
    <Card sx={{ width: 450 }} data-testid="tree-select-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Export report</Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Included sections</Typography>
        <TextField
          fullWidth
          placeholder="Select sections"
          value=""
          onClick={handleClick}
          InputProps={{
            readOnly: true,
            startAdornment: selectedItems.length > 0 ? (
              <InputAdornment position="start">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedItems.map((id) => (
                    <Chip
                      key={id}
                      label={valueLabels[id]}
                      size="small"
                      onDelete={() => handleRemoveChip(id)}
                    />
                  ))}
                </Box>
              </InputAdornment>
            ) : undefined,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClick}>
                  <ArrowDropDownIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          data-testid="tree-select-sections"
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
            multiSelect
            checkboxSelection
            selectedItems={selectedItems}
            onItemSelectionToggle={handleItemSelectionToggle}
            sx={{ p: 1 }}
            data-testid="tree-view"
          >
            <TreeItem itemId="reports" label="Reports">
              <TreeItem itemId="rep_revenue" label="Revenue" />
              <TreeItem itemId="rep_costs" label="Costs" />
              <TreeItem itemId="rep_forecast" label="Forecast" />
              <TreeItem itemId="rep_retention" label="Retention" />
            </TreeItem>
            <TreeItem itemId="logs" label="Logs">
              <TreeItem itemId="log_auth" label="Auth" />
              <TreeItem itemId="log_errors" label="Errors" />
            </TreeItem>
          </SimpleTreeView>
        </Popover>
      </CardContent>
    </Card>
  );
}
