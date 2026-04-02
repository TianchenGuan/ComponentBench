'use client';

/**
 * select_custom_single-mui-v2-T12: Grouped category drawer — choose Refund and apply
 *
 * Rule dashboard. "Notification rules" opens a left-side drawer with two MUI Select controls:
 * "Category" and "Delivery channel". Category opens a long grouped menu with ListSubheader
 * sections: Billing (Invoice, Refund, Chargeback), Shipping (Dispatch, Delivery, Return),
 * Support (Ticket, Escalation, Feedback). "Refund" sits in the Billing group below initial viewport.
 * Delivery channel = "Email" (must stay). Footer: "Apply rule" / "Close without saving".
 *
 * Success: Category = "Refund", Delivery channel still "Email", "Apply rule" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Select, MenuItem,
  FormControl, InputLabel, Drawer, Divider, Chip, ListSubheader,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import type { TaskComponentProps } from '../../types';

const categoryGroups = [
  { header: 'Billing', items: ['Invoice', 'Refund', 'Chargeback', 'Credit note', 'Payment received'] },
  { header: 'Shipping', items: ['Dispatch', 'Delivery', 'Return', 'Lost package', 'Address update'] },
  { header: 'Support', items: ['Ticket', 'Escalation', 'Feedback', 'Bug report', 'Feature request'] },
  { header: 'Account', items: ['Signup', 'Suspension', 'Password reset', 'Profile update', 'Deletion'] },
];

const deliveryOptions = ['Email', 'Slack', 'SMS', 'Push', 'Webhook'];

function buildCategoryMenuItems() {
  const items: React.ReactNode[] = [];
  categoryGroups.forEach((group) => {
    items.push(<ListSubheader key={group.header}>{group.header}</ListSubheader>);
    group.items.forEach((item) => {
      items.push(<MenuItem key={item} value={item}>{item}</MenuItem>);
    });
  });
  return items;
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState('Dispatch');
  const [deliveryChannel, setDeliveryChannel] = useState('Email');
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && category === 'Refund' && deliveryChannel === 'Email') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, category, deliveryChannel, onSuccess]);

  const handleApply = () => {
    setApplied(true);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        <NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Rule Dashboard
      </Typography>

      <Card sx={{ maxWidth: 500, mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure notification rules for your organization.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Active rules: 12" size="small" />
            <Chip label="Paused: 3" size="small" variant="outlined" />
          </Box>
          <Button variant="contained" onClick={() => setDrawerOpen(true)}>Notification rules</Button>
        </CardContent>
      </Card>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 360, p: 2 } }}
      >
        <Typography variant="h6" gutterBottom>Notification Rule</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => { setCategory(e.target.value); setApplied(false); }}
              MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
            >
              {buildCategoryMenuItems()}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Delivery channel</InputLabel>
            <Select
              value={deliveryChannel}
              label="Delivery channel"
              onChange={(e) => { setDeliveryChannel(e.target.value); setApplied(false); }}
            >
              {deliveryOptions.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </Select>
          </FormControl>

          <Divider />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="Trigger: Instant" size="small" variant="outlined" />
            <Chip label="Retry: 3x" size="small" variant="outlined" />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
          <Button onClick={() => setDrawerOpen(false)}>Close without saving</Button>
          <Button variant="contained" onClick={handleApply}>Apply rule</Button>
        </Box>
      </Drawer>
    </Box>
  );
}
