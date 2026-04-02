'use client';

/**
 * collapsible_disclosure-mui-T02: Single accordion: collapse Details
 * 
 * A product page shows a single accordion component labeled "Details".
 * 
 * - Layout: isolated_card, centered.
 * - Component: one MUI Accordion titled "Details".
 * - Initial state: expanded by default (defaultExpanded=true); the details text is visible.
 * - Interaction: clicking the "Details" summary toggles it closed.
 * - No other accordions are present.
 * 
 * Success: expanded_panels equals [] (Details collapsed)
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

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!expanded) {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Product</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expanded} 
          onChange={(_, isExpanded) => setExpanded(isExpanded)}
          data-testid="acc-details"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This premium product features high-quality materials, exceptional 
              craftsmanship, and a modern design. Dimensions: 10" x 8" x 4". 
              Weight: 2.5 lbs. Available in multiple colors.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
