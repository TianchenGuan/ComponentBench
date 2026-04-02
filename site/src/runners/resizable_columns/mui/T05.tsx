'use client';

/**
 * Task ID: resizable_columns-mui-T05
 * Task Name: Settings panel: scroll to Shipping Address and set to 300px
 *
 * Setup Description:
 * Layout: settings_panel with low clutter.
 * Left sidebar with settings links (distractors).
 * Main panel titled "Addresses" containing a wide MUI DataGrid.
 * Many columns - Shipping Address column starts off-screen (horizontal scroll).
 *
 * Initial state: Shipping Address starts at 220px.
 *
 * Success Trigger: Shipping Address column width is within ±8px of 300px.
 *
 * Theme: light, Spacing: comfortable, Layout: settings_panel, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '555-0100', city: 'New York', state: 'NY', zip: '10001', country: 'USA', shippingAddress: '123 Main St, Apt 4B', billingAddress: '123 Main St', notes: 'Preferred customer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '555-0200', city: 'Los Angeles', state: 'CA', zip: '90210', country: 'USA', shippingAddress: '456 Oak Ave, Suite 100', billingAddress: '456 Oak Ave', notes: '' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 120,
    email: 180,
    phone: 120,
    city: 100,
    state: 80,
    zip: 80,
    country: 80,
    shippingAddress: 220,
    billingAddress: 200,
    notes: 150,
  });
  const successFired = useRef(false);

  const shippingWidth = columnWidths.shippingAddress ?? 220;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(shippingWidth, 300, 8)) {
      successFired.current = true;
      onSuccess();
    }
  }, [shippingWidth, onSuccess]);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: columnWidths.name, resizable: true },
    { field: 'email', headerName: 'Email', width: columnWidths.email, resizable: true },
    { field: 'phone', headerName: 'Phone', width: columnWidths.phone, resizable: true },
    { field: 'city', headerName: 'City', width: columnWidths.city, resizable: true },
    { field: 'state', headerName: 'State', width: columnWidths.state, resizable: true },
    { field: 'zip', headerName: 'ZIP', width: columnWidths.zip, resizable: true },
    { field: 'country', headerName: 'Country', width: columnWidths.country, resizable: true },
    { field: 'shippingAddress', headerName: 'Shipping Address', width: columnWidths.shippingAddress, resizable: true },
    { field: 'billingAddress', headerName: 'Billing Address', width: columnWidths.billingAddress, resizable: true },
    { field: 'notes', headerName: 'Notes', width: columnWidths.notes, resizable: true },
  ];

  return (
    <Box sx={{ display: 'flex', width: 900 }} data-testid="rc-settings-panel">
      {/* Sidebar */}
      <Paper sx={{ width: 200, mr: 2 }}>
        <List dense>
          <ListItemButton>
            <ListItemText primary="Profile" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Notifications" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="Billing" />
          </ListItemButton>
          <ListItemButton selected>
            <ListItemText primary="Addresses" />
          </ListItemButton>
          <ListItemButton>
            <ListItemText primary="API Keys" />
          </ListItemButton>
        </List>
      </Paper>

      {/* Main content */}
      <Card sx={{ flex: 1 }} data-testid="rc-datagrid-address-book">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Address Book
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} data-testid="rc-width-shipping">
            Shipping Address width: {shippingWidth}px
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setColumnWidths(prev => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
