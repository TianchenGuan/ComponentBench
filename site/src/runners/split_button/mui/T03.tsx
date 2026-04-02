'use client';

/**
 * split_button-mui-T03: Merge: run the selected action via main button (MUI)
 *
 * Layout: isolated card titled "Pull request" centered in the viewport.
 * Target component: MUI split button (ButtonGroup + Popper/MenuList).
 *
 * Initial state:
 * - Selected action is already set to "Squash and merge".
 * - Status line under the button reads "Last action: —".
 *
 * Success: lastInvokedAction equals "squash_and_merge"
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

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction] = useState('squash_and_merge');
  const [lastInvokedAction, setLastInvokedAction] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleMainClick = () => {
    if (lastInvokedAction) return; // Prevent double-click
    setLastInvokedAction(selectedAction);
    if (selectedAction === 'squash_and_merge' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
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

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Pull request" />
      <CardContent>
        <div
          data-testid="split-button-root"
          data-selected-action={selectedAction}
          data-last-invoked-action={lastInvokedAction}
        >
          <ButtonGroup variant="contained" ref={anchorRef}>
            <Button onClick={handleMainClick}>Squash and merge</Button>
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
                      <MenuItem selected>Squash and merge</MenuItem>
                      <MenuItem>Rebase and merge</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Status line */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Last action: {lastInvokedAction ? 'Squash and merge' : '—'}
        </Typography>
      </CardContent>
    </Card>
  );
}
