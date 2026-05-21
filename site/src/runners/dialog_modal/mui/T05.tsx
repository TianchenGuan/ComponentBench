'use client';

/**
 * dialog_modal-mui-T05: Open the correct dialog in a settings panel
 *
 * Layout: settings_panel centered. The page resembles an "Account" settings screen.
 *
 * In the "Addresses" section there are two rows, each with an "Edit" button:
 * - Row 1: "Shipping address" + "Edit" button
 * - Row 2: "Billing address" + "Edit" button
 *
 * Each "Edit" button opens a different Material UI Dialog.
 * Initial state: no dialogs are open.
 * Success: The dialog titled 'Billing address' is open/visible.
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [shippingOpen, setShippingOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenShipping = () => {
    setShippingOpen(true);
    setBillingOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Shipping address',
    };
  };

  const handleOpenBilling = () => {
    setBillingOpen(true);
    setShippingOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Billing address',
    };
    
    // Success when Billing address dialog opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseShipping = () => {
    setShippingOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Shipping address',
    };
  };

  const handleCloseBilling = () => {
    setBillingOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Billing address',
    };
  };

  return (
    <>
      <Box sx={{ display: 'flex', width: 600 }}>
        {/* Left nav (non-interactive) */}
        <Card sx={{ width: 150, mr: 2, flexShrink: 0 }}>
          <List dense>
            <ListItem>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem sx={{ bgcolor: 'action.selected' }}>
              <ListItemText primary="Addresses" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Language" />
            </ListItem>
          </List>
        </Card>

        {/* Main content */}
        <Card sx={{ flex: 1 }}>
          <CardHeader title="Account Settings" />
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              Addresses
            </Typography>
            
            <List>
              <ListItem
                secondaryAction={
                  <Button 
                    size="small" 
                    onClick={handleOpenShipping}
                    data-testid="cb-edit-shipping"
                  >
                    Edit
                  </Button>
                }
              >
                <ListItemText 
                  primary="Shipping address"
                  secondary="123 Main St, Apt 4B"
                />
              </ListItem>
              <Divider />
              <ListItem
                secondaryAction={
                  <Button 
                    size="small" 
                    onClick={handleOpenBilling}
                    data-testid="cb-edit-billing"
                  >
                    Edit
                  </Button>
                }
              >
                <ListItemText 
                  primary="Billing address"
                  secondary="456 Oak Ave, Suite 100"
                />
              </ListItem>
            </List>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Other settings are available in the navigation panel.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Shipping Dialog */}
      <Dialog
        open={shippingOpen}
        onClose={handleCloseShipping}
        aria-labelledby="shipping-dialog-title"
        data-testid="dialog-shipping-address"
      >
        <DialogTitle id="shipping-dialog-title">Shipping address</DialogTitle>
        <DialogContent>
          <Typography>
            Edit your shipping address for deliveries.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShipping}>Cancel</Button>
          <Button onClick={handleCloseShipping} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Billing Dialog */}
      <Dialog
        open={billingOpen}
        onClose={handleCloseBilling}
        aria-labelledby="billing-dialog-title"
        data-testid="dialog-billing-address"
      >
        <DialogTitle id="billing-dialog-title">Billing address</DialogTitle>
        <DialogContent>
          <Typography>
            Edit your billing address for invoices and payments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBilling}>Cancel</Button>
          <Button onClick={handleCloseBilling} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
