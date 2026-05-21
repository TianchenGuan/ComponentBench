'use client';

/**
 * menu_button-mui-T07: Set Billing time zone and apply
 * 
 * Layout: form_section centered titled "Time zones".
 * There are two similar menu buttons (instances=2):
 * "Billing time zone: UTC" and "Display time zone: UTC".
 * 
 * Each opens a menu panel listing time zones: "UTC", "America/New_York", 
 * "America/Los_Angeles", "Europe/London".
 * The menu includes a footer with "Cancel" and "Apply".
 * Selecting a time zone only stages the choice until Apply is pressed.
 * 
 * Initial state: both are applied as UTC.
 * Clutter (low): informational paragraph and a disabled Save button.
 * 
 * Success: The applied value of "Billing time zone" equals "America/New_York".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem, Divider, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const timeZones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [billingAnchorEl, setBillingAnchorEl] = useState<null | HTMLElement>(null);
  const [displayAnchorEl, setDisplayAnchorEl] = useState<null | HTMLElement>(null);
  
  const [billingApplied, setBillingApplied] = useState('UTC');
  const [billingStaged, setBillingStaged] = useState('UTC');
  const [displayApplied, setDisplayApplied] = useState('UTC');
  const [displayStaged, setDisplayStaged] = useState('UTC');
  
  const [successTriggered, setSuccessTriggered] = useState(false);

  const billingOpen = Boolean(billingAnchorEl);
  const displayOpen = Boolean(displayAnchorEl);

  useEffect(() => {
    if (billingApplied === 'America/New_York' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [billingApplied, successTriggered, onSuccess]);

  const handleBillingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBillingAnchorEl(event.currentTarget);
    setBillingStaged(billingApplied);
  };

  const handleDisplayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDisplayAnchorEl(event.currentTarget);
    setDisplayStaged(displayApplied);
  };

  const handleBillingClose = () => {
    setBillingAnchorEl(null);
  };

  const handleDisplayClose = () => {
    setDisplayAnchorEl(null);
  };

  const handleBillingApply = () => {
    setBillingApplied(billingStaged);
    handleBillingClose();
  };

  const handleDisplayApply = () => {
    setDisplayApplied(displayStaged);
    handleDisplayClose();
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Time zones</Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Configure time zone settings for your account. Changes will affect how dates are displayed.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Billing time zone
            </Typography>
            <Button
              variant="outlined"
              onClick={handleBillingClick}
              endIcon={<KeyboardArrowDownIcon />}
              data-testid="menu-button-billing-time-zone"
              fullWidth
              sx={{ justifyContent: 'space-between' }}
            >
              Billing time zone: {billingApplied}
            </Button>
          </div>

          <div>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              Display time zone
            </Typography>
            <Button
              variant="outlined"
              onClick={handleDisplayClick}
              endIcon={<KeyboardArrowDownIcon />}
              data-testid="menu-button-display-time-zone"
              fullWidth
              sx={{ justifyContent: 'space-between' }}
            >
              Display time zone: {displayApplied}
            </Button>
          </div>

          <Button variant="contained" disabled sx={{ alignSelf: 'flex-start', mt: 1 }}>
            Save
          </Button>
        </Box>

        {/* Billing Menu */}
        <Menu
          anchorEl={billingAnchorEl}
          open={billingOpen}
          onClose={handleBillingClose}
        >
          {timeZones.map(tz => (
            <MenuItem
              key={tz}
              onClick={() => setBillingStaged(tz)}
              selected={tz === billingStaged}
            >
              {tz}
            </MenuItem>
          ))}
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
            <Button size="small" onClick={handleBillingClose} data-testid="billing-tz-cancel">
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleBillingApply} data-testid="billing-tz-apply">
              Apply
            </Button>
          </Box>
        </Menu>

        {/* Display Menu */}
        <Menu
          anchorEl={displayAnchorEl}
          open={displayOpen}
          onClose={handleDisplayClose}
        >
          {timeZones.map(tz => (
            <MenuItem
              key={tz}
              onClick={() => setDisplayStaged(tz)}
              selected={tz === displayStaged}
            >
              {tz}
            </MenuItem>
          ))}
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
            <Button size="small" onClick={handleDisplayClose}>
              Cancel
            </Button>
            <Button size="small" variant="contained" onClick={handleDisplayApply}>
              Apply
            </Button>
          </Box>
        </Menu>
      </CardContent>
    </Card>
  );
}
