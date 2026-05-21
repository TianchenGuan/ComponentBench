'use client';

/**
 * password_input-mui-T08: Scroll to the Integration section and set the password
 * 
 * A full-page settings panel contains a scrollable column of accordion sections: "Profile",
 * "Notifications", "Security", and "Integration". Only one password input exists in the entire
 * page: inside the "Integration" accordion.
 * The "Integration" section is initially out of view and requires scrolling to reach. When
 * expanded, it shows a MUI TextField labeled "Integration password" (type=password, initially empty).
 * There is no Save button; changes are considered applied immediately.
 * Other sections contain toggles and text inputs (non-password) as realistic clutter.
 * 
 * Success: The "Integration password" field equals exactly "Integrate%55".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Switch, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [password, setPassword] = useState('');
  const [expandedPanels, setExpandedPanels] = useState<string[]>(['profile']);

  useEffect(() => {
    if (password === 'Integrate%55') {
      onSuccess();
    }
  }, [password, onSuccess]);

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    if (isExpanded) {
      setExpandedPanels([...expandedPanels, panel]);
    } else {
      setExpandedPanels(expandedPanels.filter(p => p !== panel));
    }
  };

  return (
    <Card sx={{ width: 450, maxHeight: 450 }}>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
          Settings
        </Typography>
        <Box sx={{ height: 380, overflowY: 'auto' }} data-testid="settings-scroll-area">
          <Accordion 
            expanded={expandedPanels.includes('profile')} 
            onChange={handleAccordionChange('profile')}
            data-testid="section-profile"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Profile</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Switch defaultChecked />} label="Show online status" />
              <FormControlLabel control={<Switch />} label="Display full name" />
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedPanels.includes('notifications')} 
            onChange={handleAccordionChange('notifications')}
            data-testid="section-notifications"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Notifications</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
              <FormControlLabel control={<Switch />} label="Push notifications" />
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedPanels.includes('security')} 
            onChange={handleAccordionChange('security')}
            data-testid="section-security"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Security</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel control={<Switch defaultChecked />} label="Two-factor auth" />
              <FormControlLabel control={<Switch />} label="Login alerts" />
            </AccordionDetails>
          </Accordion>

          <Accordion 
            expanded={expandedPanels.includes('integration')} 
            onChange={handleAccordionChange('integration')}
            data-testid="section-integration"
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Integration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Integration password"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ 'data-testid': 'integration-password-input' }}
              />
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
}
