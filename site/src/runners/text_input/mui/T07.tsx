'use client';

/**
 * text_input-mui-T07: Reveal advanced slug field and set it
 * 
 * Scene is a settings_panel layout centered in the viewport. At the top is a collapsed MUI Accordion titled
 * "Advanced". When collapsed, the only visible controls are the accordion header and a couple of toggle
 * switches (non-text distractors). Expanding "Advanced" reveals a single MUI TextField labeled "Slug" (this
 * is the only text_input instance on the page). The Slug field is initially empty and has a small hint:
 * "lowercase letters and hyphens". No confirmation button is required.
 * 
 * Success: The Accordion titled "Advanced" is expanded (so the Slug field is present) and the TextField
 * labeled "Slug" has value "spring-sale" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, Switch, FormControlLabel, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [slug, setSlug] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (slug.trim() === 'spring-sale') {
      onSuccess();
    }
  }, [slug, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={<Switch />}
            label="Enable analytics"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Public visibility"
          />
        </Box>

        <Accordion 
          expanded={expanded} 
          onChange={(_, isExpanded) => setExpanded(isExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Slug"
              variant="outlined"
              fullWidth
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="lowercase letters and hyphens"
              inputProps={{ 'data-testid': 'slug-input' }}
            />
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
