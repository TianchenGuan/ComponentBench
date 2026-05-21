'use client';

/**
 * accordion-mui-T01: Product info: open Warranty (MUI Accordion)
 * 
 * A centered isolated card titled "Product info" contains a MUI Accordion group with 
 * 3 items: "Description", "Warranty", and "Care instructions". Each item uses 
 * AccordionSummary (header row) and AccordionDetails (content). Initial state: all 
 * accordions are collapsed. Clicking the summary row expands the details.
 * 
 * Success: expanded_item_ids equals exactly: [warranty]
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
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'warranty') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Product info</Typography>
      
      <div data-testid="accordion-root">
        <Accordion 
          expanded={expanded === 'description'} 
          onChange={handleChange('description')}
          data-testid="acc-description"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Description</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              High-quality product with premium materials and exceptional craftsmanship.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'warranty'} 
          onChange={handleChange('warranty')}
          data-testid="acc-warranty"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Warranty</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This product comes with a 2-year manufacturer warranty covering defects.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion 
          expanded={expanded === 'care_instructions'} 
          onChange={handleChange('care_instructions')}
          data-testid="acc-care-instructions"
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Care instructions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Clean with a damp cloth. Avoid exposure to direct sunlight.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </Paper>
  );
}
