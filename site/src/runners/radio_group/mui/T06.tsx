'use client';

/**
 * radio_group-mui-T06: Logs: expand Advanced and set Log level to Verbose
 *
 * A form_section layout titled "Logging" is centered and contains a MUI Accordion with two panels: "Basics" (expanded) and "Advanced" (collapsed).
 * The target RadioGroup labeled "Log level" is located inside the "Advanced" panel and is not visible until the panel is expanded.
 * Log level options: Errors only, Warnings, Verbose.
 * Initial state (when revealed): Warnings is selected.
 * The Basics panel contains unrelated toggles (e.g., "Enable logs") as distractors.
 * Changing the radio selection triggers a brief inline progress indicator and then shows helper text "Saved". No separate Save button.
 *
 * Success: The "Log level" RadioGroup selected value equals "verbose" (label "Verbose").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Switch, Box,
  Accordion, AccordionSummary, AccordionDetails, CircularProgress, FormHelperText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [logLevel, setLogLevel] = useState<string>('warnings');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState<string | false>('basics');

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleLogLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLogLevel(value);
    setSaving(true);
    setSaved(false);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      if (value === 'verbose') {
        onSuccess();
      }
      setTimeout(() => setSaved(false), 2000);
    }, 300);
  };

  return (
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Logging</Typography>

        {/* Basics accordion (expanded by default) */}
        <Accordion 
          expanded={expanded === 'basics'} 
          onChange={handleAccordionChange('basics')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Basics</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography>Enable logs</Typography>
              <Switch defaultChecked />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Console output</Typography>
              <Switch defaultChecked />
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Advanced accordion (collapsed by default, contains target) */}
        <Accordion 
          expanded={expanded === 'advanced'} 
          onChange={handleAccordionChange('advanced')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={logLevel}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FormLabel component="legend" sx={{ mb: 0 }}>Log level</FormLabel>
                {saving && <CircularProgress size={16} />}
              </Box>
              <RadioGroup value={logLevel} onChange={handleLogLevelChange}>
                <FormControlLabel value="errors" control={<Radio />} label="Errors only" />
                <FormControlLabel value="warnings" control={<Radio />} label="Warnings" />
                <FormControlLabel value="verbose" control={<Radio />} label="Verbose" />
              </RadioGroup>
              {saved && <FormHelperText sx={{ color: 'success.main' }}>Saved</FormHelperText>}
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}
