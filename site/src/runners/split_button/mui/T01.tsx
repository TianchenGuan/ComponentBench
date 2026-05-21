'use client';

/**
 * split_button-mui-T01: Merge options: open split-button menu (MUI)
 *
 * Layout: isolated card titled "Pull request" centered in the viewport.
 * Target component: MUI split button built from ButtonGroup + Popper/MenuList.
 *
 * Menu items: "Merge commit", "Squash and merge", "Rebase and merge"
 * Initial state: Menu is closed (menuOpen=false).
 *
 * Success: Menu overlay is open (menuOpen=true)
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
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newOpen = !menuOpen;
    setMenuOpen(newOpen);
    if (newOpen && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Pull request" />
      <CardContent>
        {/* Non-interactive PR description (distractor) */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }} variant="outlined">
          <div style={{ fontSize: 14, color: '#666' }}>
            <strong>feat:</strong> Add new user authentication flow
          </div>
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
            3 commits · 2 files changed
          </div>
        </Paper>

        <div
          data-testid="split-button-root"
          data-menu-open={menuOpen}
        >
          <ButtonGroup variant="contained" ref={anchorRef}>
            <Button>Merge</Button>
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
                      <MenuItem>Merge commit</MenuItem>
                      <MenuItem>Squash and merge</MenuItem>
                      <MenuItem>Rebase and merge</MenuItem>
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
