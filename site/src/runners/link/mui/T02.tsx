'use client';

/**
 * link-mui-T02: Expand Shipping Details with a button-style Link
 * 
 * setup_description:
 * A centered isolated card titled "Order Summary" contains a collapsed section labeled
 * "Shipping Details". The disclosure control is implemented using the Material UI Link
 * component rendered as a button-style link (Link with component="button").
 * 
 * Initial state: the Link label is "Show shipping details", aria-expanded="false",
 * aria-controls="shipping-details". On activation, the details panel becomes visible
 * and the Link toggles to "Hide shipping details" with aria-expanded="true".
 * 
 * success_trigger:
 * - The "Show shipping details" link (data-testid="link-shipping-details") was activated.
 * - The link's aria-expanded attribute equals "true".
 * - The Shipping Details panel (id="shipping-details") is visible.
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Collapse } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (!expanded) {
      setExpanded(true);
      onSuccess();
    } else {
      setExpanded(false);
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Order Summary" />
      <CardContent>
        <Typography sx={{ mb: 2 }}>
          Subtotal: $149.99
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Shipping Details: {expanded ? 'shown' : 'hidden'}
        </Typography>
        <Link
          component="button"
          onClick={handleClick}
          data-testid="link-shipping-details"
          aria-controls="shipping-details"
          aria-expanded={expanded}
          sx={{ cursor: 'pointer' }}
        >
          {expanded ? 'Hide shipping details' : 'Show shipping details'}
        </Link>
        
        <Collapse in={expanded}>
          <Box 
            id="shipping-details"
            sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'grey.100', 
              borderRadius: 1 
            }}
          >
            <Typography variant="body2">Shipping method: Standard</Typography>
            <Typography variant="body2">Estimated delivery: 5-7 business days</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
              Shipping cost: $9.99
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
