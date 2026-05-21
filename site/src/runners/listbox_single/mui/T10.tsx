'use client';

/**
 * listbox_single-mui-T10: Orders table: set status for Order #A-17 to Refunded
 *
 * Scene: light theme, comfortable spacing, table_cell layout, placed at top_right of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is none.
 * A table_cell scene anchors a compact table near the top-right of the viewport. The table has two rows:
 * "Order #A-17" and "Order #A-18". In the "Status" column of each row is a compact single-select MUI List listbox
 * with four options: "Processing", "Shipped", "Delivered", "Refunded". Each row has its own selected highlight.
 * Initial selections: A-17 = "Delivered"; A-18 = "Shipped". There is no toolbar or pagination;
 * the core difficulty is selecting the correct row's listbox and choosing the correct status.
 *
 * Success: Selected option value equals: refunded (in row Order #A-17)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, List, ListItemButton, ListItemText, Typography
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const statusOptions = [
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'refunded', label: 'Refunded' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    'A-17': 'delivered',
    'A-18': 'shipped',
  });

  const handleStatusChange = (orderId: string, value: string) => {
    setStatuses(prev => ({ ...prev, [orderId]: value }));
    if (orderId === 'A-17' && value === 'refunded') {
      onSuccess();
    }
  };

  const orders = [
    { id: 'A-17', customer: 'John Doe', amount: '$125.00' },
    { id: 'A-18', customer: 'Jane Smith', amount: '$89.50' },
  ];

  return (
    <TableContainer component={Paper} sx={{ width: 550 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="subtitle2">Order</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Customer</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Amount</Typography></TableCell>
            <TableCell><Typography variant="subtitle2">Status</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>Order #{order.id}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{order.customer}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{order.amount}</Typography>
              </TableCell>
              <TableCell sx={{ p: 0 }}>
                <List
                  data-cb-listbox-root
                  data-cb-instance={`order-${order.id}`}
                  data-cb-selected-value={statuses[order.id]}
                  dense
                  sx={{ py: 0 }}
                >
                  {statusOptions.map(opt => (
                    <ListItemButton
                      key={opt.value}
                      selected={statuses[order.id] === opt.value}
                      onClick={() => handleStatusChange(order.id, opt.value)}
                      data-cb-option-value={opt.value}
                      sx={{ py: 0.25, px: 1 }}
                    >
                      <ListItemText 
                        primary={opt.label}
                        primaryTypographyProps={{ fontSize: 11 }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
