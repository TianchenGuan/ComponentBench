'use client';

/**
 * menu_button-mui-T02: Choose price sort low to high
 * 
 * Layout: isolated_card centered titled "Catalog".
 * A single MUI Button labeled "Sort: Relevance" opens a Menu with three items:
 * "Relevance", "Price: low to high", "Price: high to low".
 * 
 * Selecting an item closes the menu and updates the button label.
 * Initial state: Relevance selected.
 * Success: The selected value is "Price: low to high".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { TaskComponentProps } from '../types';

const sortOptions = ['Relevance', 'Price: low to high', 'Price: high to low'];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedSort, setSelectedSort] = useState('Relevance');
  const [successTriggered, setSuccessTriggered] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (selectedSort === 'Price: low to high' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedSort, successTriggered, onSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: string) => {
    setSelectedSort(option);
    handleClose();
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Catalog</Typography>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          data-testid="menu-button-sort"
        >
          Sort: {selectedSort}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {sortOptions.map(option => (
            <MenuItem
              key={option}
              onClick={() => handleSelect(option)}
              selected={option === selectedSort}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </CardContent>
    </Card>
  );
}
