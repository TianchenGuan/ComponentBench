'use client';

/**
 * accordion-mui-T07: Orders list: open Payment in Order #105 (two accordions)
 * 
 * Scene is a form_section layout titled "Recent orders" with low clutter (a small filter 
 * dropdown and a disabled search box above the list). There are TWO separate accordion 
 * instances, each in its own small card with a clear heading:
 * • "Order #104"
 * • "Order #105"
 * Each card contains a MUI Accordion list with 3 items: "Items", "Shipping", "Payment".
 * Initial state: all collapsed. The task targets only the accordion inside "Order #105".
 * 
 * Success: Order #105 accordion has expanded_item_ids exactly: [payment]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [order104Expanded, setOrder104Expanded] = useState<string | false>(false);
  const [order105Expanded, setOrder105Expanded] = useState<string | false>(false);

  useEffect(() => {
    if (order105Expanded === 'payment') {
      onSuccess();
    }
  }, [order105Expanded, onSuccess]);

  const handleOrder104Change = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setOrder104Expanded(isExpanded ? panel : false);
  };

  const handleOrder105Change = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setOrder105Expanded(isExpanded ? panel : false);
  };

  const OrderAccordion = ({ 
    orderId, 
    expanded, 
    onChange 
  }: { 
    orderId: string; 
    expanded: string | false; 
    onChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }} data-testid={`order-${orderId}`}>
      <Typography variant="h6" sx={{ mb: 2 }}>Order #{orderId}</Typography>
      
      <Accordion expanded={expanded === 'items'} onChange={onChange('items')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Items</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Order items and quantities.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'shipping'} onChange={onChange('shipping')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Shipping</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Shipping address and tracking information.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'payment'} onChange={onChange('payment')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Payment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>Payment method and transaction details.</Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Recent orders</Typography>

      {/* Filters (clutter) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <TextField 
            fullWidth 
            size="small" 
            placeholder="Search orders..." 
            disabled 
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth size="small" disabled>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value="all">
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Order #104 */}
      <OrderAccordion 
        orderId="104" 
        expanded={order104Expanded} 
        onChange={handleOrder104Change} 
      />

      {/* Order #105 - the target */}
      <OrderAccordion 
        orderId="105" 
        expanded={order105Expanded} 
        onChange={handleOrder105Change} 
      />
    </Box>
  );
}
