'use client';

/**
 * menu_button-mui-T08: Share via nested Send > Email menu
 * 
 * Layout: isolated_card near the bottom-right of the viewport.
 * There is one menu button labeled "Share".
 * Clicking opens a first-level MUI Menu with items: "Copy link", "Send", "QR code".
 * Choosing or hovering "Send" opens a second menu (composed nested menu pattern).
 * The second menu contains: "Email", "Slack", "Messages".
 * 
 * Selecting a leaf closes both menus and updates the trigger.
 * Initial state: no method selected (trigger shows "Share").
 * 
 * Success: The selected menu path equals ["Send", "Email"].
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [mainAnchorEl, setMainAnchorEl] = useState<null | HTMLElement>(null);
  const [sendAnchorEl, setSendAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const sendItemRef = useRef<HTMLLIElement>(null);

  const mainOpen = Boolean(mainAnchorEl);
  const sendOpen = Boolean(sendAnchorEl);

  useEffect(() => {
    if (selectedPath === 'Email' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleMainClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMainAnchorEl(event.currentTarget);
  };

  const handleMainClose = () => {
    setMainAnchorEl(null);
    setSendAnchorEl(null);
  };

  const handleSendHover = (event: React.MouseEvent<HTMLLIElement>) => {
    setSendAnchorEl(event.currentTarget);
  };

  const handleSendLeave = () => {
    // Small delay to allow moving to submenu
    setTimeout(() => {
      if (!sendAnchorEl?.contains(document.activeElement)) {
        // Don't close immediately
      }
    }, 100);
  };

  const handleSendClose = () => {
    setSendAnchorEl(null);
  };

  const handleCopyLink = () => {
    // Not the target action
    handleMainClose();
  };

  const handleQRCode = () => {
    // Not the target action
    handleMainClose();
  };

  const handleSendSubSelect = (method: string) => {
    setSelectedPath(method);
    handleMainClose();
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Document</Typography>
        
        <Button
          variant="outlined"
          onClick={handleMainClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-share"
        >
          {selectedPath ? `Share via: ${selectedPath}` : 'Share'}
        </Button>

        {/* Main Menu */}
        <Menu
          anchorEl={mainAnchorEl}
          open={mainOpen}
          onClose={handleMainClose}
        >
          <MenuItem onClick={handleCopyLink}>Copy link</MenuItem>
          <MenuItem
            ref={sendItemRef}
            onMouseEnter={handleSendHover}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            Send
            <ChevronRightIcon fontSize="small" />
          </MenuItem>
          <MenuItem onClick={handleQRCode}>QR code</MenuItem>
        </Menu>

        {/* Send Submenu */}
        <Menu
          anchorEl={sendAnchorEl}
          open={sendOpen}
          onClose={handleSendClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={() => handleSendSubSelect('Email')}>Email</MenuItem>
          <MenuItem onClick={() => handleSendSubSelect('Slack')}>Slack</MenuItem>
          <MenuItem onClick={() => handleSendSubSelect('Messages')}>Messages</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
}
