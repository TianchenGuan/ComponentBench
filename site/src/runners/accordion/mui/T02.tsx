'use client';

/**
 * accordion-mui-T02: Checkout: collapse Order summary
 * 
 * A centered isolated card titled "Checkout" contains 3 MUI Accordion items: 
 * "Order summary", "Shipping address", "Payment method". Initial state: "Order summary" 
 * is expanded and shows a list of line items; the other two are collapsed. The user can 
 * click the "Order summary" AccordionSummary to collapse it.
 * 
 * Success: expanded_item_ids equals exactly: []
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>('order_summary');

  useEffect(() => {
    if (expanded === false) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Checkout</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expanded === 'order_summary'} 
          onChange={handleChange('order_summary')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Order summary</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              <ListItem>
                <ListItemText primary="Widget Pro" secondary="$49.99" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Premium Case" secondary="$19.99" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Extended Warranty" secondary="$9.99" />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'shipping_address'} 
          onChange={handleChange('shipping_address')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Shipping address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Enter your shipping address for delivery.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'payment_method'} 
          onChange={handleChange('payment_method')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Payment method</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Select your preferred payment method.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
