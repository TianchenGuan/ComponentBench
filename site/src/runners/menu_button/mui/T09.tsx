'use client';

/**
 * menu_button-mui-T09: Jump to Section 37 from long menu
 * 
 * Layout: isolated_card anchored near the top-left of the viewport.
 * Spacing is compact and the component scale is small.
 * There is one menu button labeled "Jump to section: Section 1".
 * 
 * Opening it shows a scrollable Menu list with 50 items labeled
 * "Section 1: Overview" ... "Section 50: Appendix".
 * The popup height is constrained, so reaching Section 37 requires scrolling.
 * 
 * Initial state: Section 1 is selected.
 * Success: The selected section equals "Section 37: Billing".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const sectionNames: Record<number, string> = {
  1: 'Overview',
  10: 'Introduction',
  20: 'Setup',
  30: 'Configuration',
  37: 'Billing',
  40: 'Advanced',
  50: 'Appendix',
};

const sections = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const name = sectionNames[num] || 'Details';
  return {
    key: `section-${num}`,
    label: `Section ${num}: ${name}`,
  };
});

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSection, setSelectedSection] = useState('Section 1: Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedSection === 'Section 37: Billing' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedSection, successTriggered, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (label: string) => {
    setSelectedSection(label);
    handleClose();
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Navigation</Typography>
        
        <Button
          size="small"
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-jump-to-section"
          sx={{ fontSize: '0.75rem' }}
        >
          Jump to section: {selectedSection.split(':')[0]}
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: { maxHeight: 250 },
          }}
        >
          {sections.map(section => (
            <MenuItem
              key={section.key}
              onClick={() => handleSelect(section.label)}
              selected={section.label === selectedSection}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              {section.label}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
}
