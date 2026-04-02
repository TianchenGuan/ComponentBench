'use client';

/**
 * split_button-mui-T07: Merge: reset split-button to default Merge commit (MUI)
 *
 * Layout: isolated card titled "Pull request" centered in the viewport.
 * Target component: MUI split button (ButtonGroup + Popper MenuList).
 *
 * Initial state: Selected action is "Rebase and merge" (main label).
 * Menu items: "Merge commit", "Squash and merge", "Rebase and merge", Divider, "Reset to default"
 *
 * Success: selectedAction equals "merge_commit"
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
  Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'merge_commit', label: 'Merge commit' },
  { key: 'squash_and_merge', label: 'Squash and merge' },
  { key: 'rebase_and_merge', label: 'Rebase and merge' },
  { key: 'divider', divider: true },
  { key: 'reset_default', label: 'Reset to default' },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('rebase_and_merge');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      'merge_commit': 'Merge commit',
      'squash_and_merge': 'Squash and merge',
      'rebase_and_merge': 'Rebase and merge',
    };
    return labels[key] || key;
  };

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
    if (key === 'reset_default') {
      setSelectedAction('merge_commit');
      if (!hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    } else if (key !== 'divider') {
      setSelectedAction(key);
      if (key === 'merge_commit' && !hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    }
    setMenuOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Pull request" />
      <CardContent>
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
                      {options.map((option) => {
                        if (option.divider) {
                          return <Divider key={option.key} />;
                        }
                        return (
                          <MenuItem
                            key={option.key}
                            selected={option.key === selectedAction}
                            onClick={() => handleMenuItemClick(option.key)}
                          >
                            {option.label}
                          </MenuItem>
                        );
                      })}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Caption */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Default: Merge commit
        </Typography>
      </CardContent>
    </Card>
  );
}
