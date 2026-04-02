'use client';

/**
 * Task ID: resizable_columns-mui-v2-T03
 * Task Name: Shipping vs Billing: off-screen shipping column only
 *
 * Setup Description:
 * Layout uses settings_panel with compact spacing and medium clutter. A sidebar of address settings and a compact help card frame a wide MUI DataGrid. The grid is narrower than the combined width of its columns and has a visible horizontal scrollbar.
 * The address-related columns appear far to the right in this order: Country, Shipping Address, Billing Address, Notes. Shipping Address starts at 240px and Billing Address at 260px. A persistent monitor reads `Shipping Address width: ###px`. Both address columns become visible together once the grid is scrolled.
 *
 * Success Trigger: Shipping Address width is within ±4px of 304px.
 * require_confirm: false
 *
 * Theme: light, Spacing: compact, Layout: settings_panel, Placement: bottom_right
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const rows = [
  {
    id: 1,
    label: 'HQ',
    region: 'US-East',
    country: 'United States',
    shippingAddress: '400 Market St, Floor 12',
    billingAddress: '400 Market St, AP',
    notes: 'Net 30',
  },
  {
    id: 2,
    label: 'Warehouse',
    region: 'US-West',
    country: 'United States',
    shippingAddress: '88 Industrial Rd, Bay 4',
    billingAddress: 'PO Box 1201',
    notes: 'Dock hours 6–2',
  },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    label: 100,
    region: 110,
    country: 130,
    shippingAddress: 240,
    billingAddress: 260,
    notes: 140,
  });
  const successFired = useRef(false);

  const shippingWidth = columnWidths.shippingAddress ?? 240;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(shippingWidth, 304, 4)) {
      successFired.current = true;
      onSuccess();
    }
  }, [shippingWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'label', headerName: 'Label', width: columnWidths.label, resizable: true },
    { field: 'region', headerName: 'Region', width: columnWidths.region, resizable: true },
    { field: 'country', headerName: 'Country', width: columnWidths.country, resizable: true },
    { field: 'shippingAddress', headerName: 'Shipping Address', width: columnWidths.shippingAddress, resizable: true },
    { field: 'billingAddress', headerName: 'Billing Address', width: columnWidths.billingAddress, resizable: true },
    { field: 'notes', headerName: 'Notes', width: columnWidths.notes, resizable: true },
  ];

  return (
    <Box sx={{ display: 'flex', width: 900, maxWidth: '100%' }} data-testid="rc-address-settings-panel">
      <Paper sx={{ width: 176, mr: 1.5, flexShrink: 0 }} variant="outlined">
        <Typography variant="caption" sx={{ px: 1.5, pt: 1.5, display: 'block' }} color="text.secondary">
          Address book
        </Typography>
        <List dense disablePadding>
          {['Profiles', 'Defaults', 'Tax IDs', 'Import'].map((label) => (
            <ListItemButton key={label} dense>
              <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItemButton>
          ))}
        </List>
      </Paper>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', gap: 1.5 }}>
        <Card sx={{ flex: 1, minWidth: 0 }} variant="outlined" data-testid="rc-datagrid-address-book">
          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Address Book
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }} data-testid="rc-width-shipping_address">
              Shipping Address width: {shippingWidth}px
            </Typography>
            <Box sx={{ height: 260, width: 480, maxWidth: '100%' }}>
              <DataGrid
                density="compact"
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setColumnWidths((prev) => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ width: 200, flexShrink: 0 }} variant="outlined">
          <CardContent sx={{ py: 1.5 }}>
            <Typography variant="subtitle2" gutterBottom>
              Help
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Scroll the grid horizontally to review distant columns. Resize using the header separator only.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
