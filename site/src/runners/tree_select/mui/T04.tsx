'use client';

/**
 * tree_select-mui-T04: Search permissions tree for Invoices
 *
 * Layout: settings_panel (left navigation + main panel). The TreeSelect appears in the main panel under "Access defaults".
 * Target component: composite TreeSelect labeled "Default permission".
 *   - Trigger: MUI TextField.
 *   - Overlay: MUI Popover containing:
 *     1) a small search TextField labeled "Filter permissions",
 *     2) a RichTreeView rendering a larger permissions tree.
 * Tree data (≈40 nodes):
 *   - Permissions → Finance → (Invoices, Billing, Spend), Engineering → (Deploy, Logs, Incidents), HR → (Recruiting, Reviews)
 * Initial state: empty selection.
 * Clutter (medium): settings panel has toggles and buttons.
 *
 * Success: Default permission committed selection equals leaf path [Permissions, Finance, Invoices] with value 'perm_finance_invoices'.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Card, CardContent, Typography, TextField, Popover, InputAdornment, IconButton, Switch, Button, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const valueLabels: Record<string, string> = {
  perm_finance_invoices: 'Permissions / Finance / Invoices',
  perm_finance_billing: 'Permissions / Finance / Billing',
  perm_finance_spend: 'Permissions / Finance / Spend',
  perm_engineering_deploy: 'Permissions / Engineering / Deploy',
  perm_engineering_logs: 'Permissions / Engineering / Logs',
  perm_engineering_incidents: 'Permissions / Engineering / Incidents',
  perm_hr_recruiting: 'Permissions / HR / Recruiting',
  perm_hr_reviews: 'Permissions / HR / Reviews',
};

const allItems = [
  { id: 'permissions', label: 'Permissions', parent: null },
  { id: 'perm_finance', label: 'Finance', parent: 'permissions' },
  { id: 'perm_finance_invoices', label: 'Invoices', parent: 'perm_finance' },
  { id: 'perm_finance_billing', label: 'Billing', parent: 'perm_finance' },
  { id: 'perm_finance_spend', label: 'Spend', parent: 'perm_finance' },
  { id: 'perm_engineering', label: 'Engineering', parent: 'permissions' },
  { id: 'perm_engineering_deploy', label: 'Deploy', parent: 'perm_engineering' },
  { id: 'perm_engineering_logs', label: 'Logs', parent: 'perm_engineering' },
  { id: 'perm_engineering_incidents', label: 'Incidents', parent: 'perm_engineering' },
  { id: 'perm_hr', label: 'HR', parent: 'permissions' },
  { id: 'perm_hr_recruiting', label: 'Recruiting', parent: 'perm_hr' },
  { id: 'perm_hr_reviews', label: 'Reviews', parent: 'perm_hr' },
];

const leafIds = new Set(Object.keys(valueLabels));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const successFired = useRef(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
  };

  const handleSelect = (_event: React.SyntheticEvent, itemId: string | null) => {
    if (itemId && leafIds.has(itemId)) {
      setValue(itemId);
      handleClose();
    }
  };

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!successFired.current && value === 'perm_finance_invoices') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  // Filter tree items based on search
  const filteredVisible = useMemo(() => {
    if (!searchTerm) return new Set(allItems.map((i) => i.id));
    const lower = searchTerm.toLowerCase();
    const matching = allItems.filter((i) => i.label.toLowerCase().includes(lower));
    const visible = new Set<string>();
    matching.forEach((item) => {
      visible.add(item.id);
      // Add parents
      let current = item;
      while (current.parent) {
        visible.add(current.parent);
        const parent = allItems.find((i) => i.id === current.parent);
        if (parent) current = parent as typeof item;
        else break;
      }
    });
    return visible;
  }, [searchTerm]);

  return (
    <Box sx={{ display: 'flex', gap: 2, maxWidth: 800 }}>
      {/* Left navigation (clutter) */}
      <Card sx={{ width: 200 }}>
        <List dense>
          <ListItem disablePadding>
            <ListItemButton selected>
              <ListItemText primary="Access defaults" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Security" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </ListItem>
        </List>
      </Card>

      {/* Main panel */}
      <Card sx={{ flex: 1 }} data-testid="tree-select-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>Access defaults</Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Default permission</Typography>
            <TextField
              fullWidth
              placeholder="Select a permission"
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
              data-testid="tree-select-permission"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Clutter: other settings */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Enable SSO</Typography>
            <Switch />
          </Box>
          <Button variant="outlined" size="small" disabled>Reset defaults</Button>
        </CardContent>
      </Card>

      {/* Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 350, maxHeight: 400, overflow: 'auto' } } }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Filter permissions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 1 }}
            autoFocus
          />
          <SimpleTreeView
            onSelectedItemsChange={handleSelect}
            data-testid="tree-view"
          >
            {filteredVisible.has('permissions') && (
              <TreeItem itemId="permissions" label="Permissions">
                {filteredVisible.has('perm_finance') && (
                  <TreeItem itemId="perm_finance" label="Finance">
                    {filteredVisible.has('perm_finance_invoices') && <TreeItem itemId="perm_finance_invoices" label="Invoices" />}
                    {filteredVisible.has('perm_finance_billing') && <TreeItem itemId="perm_finance_billing" label="Billing" />}
                    {filteredVisible.has('perm_finance_spend') && <TreeItem itemId="perm_finance_spend" label="Spend" />}
                  </TreeItem>
                )}
                {filteredVisible.has('perm_engineering') && (
                  <TreeItem itemId="perm_engineering" label="Engineering">
                    {filteredVisible.has('perm_engineering_deploy') && <TreeItem itemId="perm_engineering_deploy" label="Deploy" />}
                    {filteredVisible.has('perm_engineering_logs') && <TreeItem itemId="perm_engineering_logs" label="Logs" />}
                    {filteredVisible.has('perm_engineering_incidents') && <TreeItem itemId="perm_engineering_incidents" label="Incidents" />}
                  </TreeItem>
                )}
                {filteredVisible.has('perm_hr') && (
                  <TreeItem itemId="perm_hr" label="HR">
                    {filteredVisible.has('perm_hr_recruiting') && <TreeItem itemId="perm_hr_recruiting" label="Recruiting" />}
                    {filteredVisible.has('perm_hr_reviews') && <TreeItem itemId="perm_hr_reviews" label="Reviews" />}
                  </TreeItem>
                )}
              </TreeItem>
            )}
          </SimpleTreeView>
        </Box>
      </Popover>
    </Box>
  );
}
