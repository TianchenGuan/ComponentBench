'use client';

/**
 * Task ID: resizable_columns-mui-T04
 * Task Name: Two grids: resize Total in Orders grid
 *
 * Setup Description:
 * Layout: isolated_card, centered, containing two MUI DataGrids (instances=2).
 * Grid 1 label: "Orders" (target instance) - Headers: Order, Customer, Total, Status.
 * Grid 2 label: "Customers" (distractor) - Headers: Customer, Email, Segment, LTV.
 *
 * Initial state: Orders.Total starts at 110px.
 *
 * Success Trigger: In Orders grid, Total column width is within ±8px of 150px.
 *
 * Theme: light, Spacing: comfortable, Layout: isolated_card, Placement: center
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const ordersRows = [
  { id: 1, order: 'ORD-001', customer: 'John Doe', total: '$250.00', status: 'Shipped' },
  { id: 2, order: 'ORD-002', customer: 'Jane Smith', total: '$175.50', status: 'Processing' },
];

const customersRows = [
  { id: 1, customer: 'John Doe', email: 'john@example.com', segment: 'Premium', ltv: '$1,250' },
  { id: 2, customer: 'Jane Smith', email: 'jane@example.com', segment: 'Standard', ltv: '$450' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [ordersWidths, setOrdersWidths] = useState<Record<string, number>>({
    order: 100,
    customer: 150,
    total: 110,
    status: 120,
  });
  const [customersWidths, setCustomersWidths] = useState<Record<string, number>>({
    customer: 150,
    email: 200,
    segment: 120,
    ltv: 100,
  });
  const successFired = useRef(false);

  const totalWidth = ordersWidths.total ?? 110;

  useEffect(() => {
    if (!successFired.current && isWithinTolerance(totalWidth, 150, 8)) {
      successFired.current = true;
      onSuccess();
    }
  }, [totalWidth, onSuccess]);

  const ordersColumns: GridColDef[] = [
    { field: 'order', headerName: 'Order', width: ordersWidths.order, resizable: true },
    { field: 'customer', headerName: 'Customer', width: ordersWidths.customer, resizable: true },
    { field: 'total', headerName: 'Total', width: ordersWidths.total, resizable: true },
    { field: 'status', headerName: 'Status', width: ordersWidths.status, resizable: true },
  ];

  const customersColumns: GridColDef[] = [
    { field: 'customer', headerName: 'Customer', width: customersWidths.customer, resizable: true },
    { field: 'email', headerName: 'Email', width: customersWidths.email, resizable: true },
    { field: 'segment', headerName: 'Segment', width: customersWidths.segment, resizable: true },
    { field: 'ltv', headerName: 'LTV', width: customersWidths.ltv, resizable: true },
  ];

  return (
    <Card sx={{ width: 700 }} data-testid="rc-container">
      <CardContent>
        <Stack spacing={3}>
          <Box data-testid="rc-grid-orders">
            <Typography variant="h6" gutterBottom>
              Orders
            </Typography>
            <Box sx={{ height: 180, width: '100%' }}>
              <DataGrid
                rows={ordersRows}
                columns={ordersColumns}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setOrdersWidths(prev => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} data-testid="rc-width-total">
              Total width: {totalWidth}px
            </Typography>
          </Box>

          <Box data-testid="rc-grid-customers">
            <Typography variant="h6" gutterBottom>
              Customers
            </Typography>
            <Box sx={{ height: 180, width: '100%' }}>
              <DataGrid
                rows={customersRows}
                columns={customersColumns}
                disableRowSelectionOnClick
                hideFooter
                onColumnWidthChange={(params) => {
                  setCustomersWidths(prev => ({
                    ...prev,
                    [params.colDef.field]: params.width,
                  }));
                }}
              />
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
