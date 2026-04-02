'use client';

/**
 * split_button-mui-T02: Merge: select Squash and merge as the main action (MUI)
 *
 * Layout: isolated card titled "Pull request" centered in the viewport.
 * Target component: MUI split button (ButtonGroup + Popper MenuList).
 *
 * Options: "Merge commit", "Squash and merge", "Rebase and merge"
 * Initial state: Selected action: "Merge commit" (main button label).
 *
 * Success: selectedAction equals "squash_and_merge"
 */

import React, { useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Card,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Grow,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'merge_commit', label: 'Merge commit' },
  { key: 'squash_and_merge', label: 'Squash and merge' },
  { key: 'rebase_and_merge', label: 'Rebase and merge' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('merge_commit');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getLabel = (key: string) => options.find(o => o.key === key)?.label || key;

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleMenuItemClick = (key: string) => {
    setSelectedAction(key);
    setMenuOpen(false);
    if (key === 'squash_and_merge' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Pull request" />
      <CardContent>
        {/* Static labels (distractors) */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Checks: <span style={{ color: '#4caf50' }}>passing</span>
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ mb: 2, color: '#bbb', cursor: 'not-allowed' }}
        >
          Details (disabled)
        </Typography>

        <div
          data-testid="split-button-root"
          data-selected-action={selectedAction}
        >
          <ButtonGroup variant="contained" ref={anchorRef}>
            <Button>{getLabel(selectedAction)}</Button>
            <Button
              size="small"
              aria-controls={menuOpen ? 'split-button-menu' : undefined}
              aria-expanded={menuOpen ? 'true' : undefined}
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={menuOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            sx={{ zIndex: 1 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option) => (
                        <MenuItem
                          key={option.key}
                          selected={option.key === selectedAction}
                          onClick={() => handleMenuItemClick(option.key)}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </CardContent>
    </Card>
  );
}
