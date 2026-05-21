'use client';

/**
 * collapsible_disclosure-mui-T01: Checkout: expand Order summary
 * 
 * A simple checkout page shows one centered card with a short accordion stack.
 * 
 * - Layout: isolated_card, centered.
 * - Component: MUI Accordion components stacked (3 accordions):
 *   - "Order summary"
 *   - "Shipping address"
 *   - "Payment method"
 * - Initial state: all accordions are collapsed (none expanded).
 * - Clicking an accordion summary expands it to reveal details underneath.
 * - No other interactive elements are required for success.
 * 
 * Success: "Order summary" is expanded
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string[]>([]);

  useEffect(() => {
    if (expanded.includes('order_summary')) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(prev => 
      isExpanded 
        ? [...prev, panel] 
        : prev.filter(p => p !== panel)
    );
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Checkout</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expanded.includes('order_summary')} 
          onChange={handleChange('order_summary')}
          data-testid="acc-order-summary"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Order summary</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              3 items in your cart. Subtotal: $149.99. Shipping: $5.99. Total: $155.98.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded.includes('shipping')} 
          onChange={handleChange('shipping')}
          data-testid="acc-shipping"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Shipping address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Enter your shipping address to calculate delivery options.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded.includes('payment')} 
          onChange={handleChange('payment')}
          data-testid="acc-payment"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Payment method</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Select your preferred payment method: Credit card, PayPal, or Apple Pay.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
