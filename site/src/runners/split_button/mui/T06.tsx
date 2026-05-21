'use client';

/**
 * split_button-mui-T06: Git actions: search menu and select Cherry-pick (MUI)
 *
 * Layout: settings_panel titled "Repository" with compact spacing.
 * Target component: MUI split button labeled "Git actions" with search input in Popper.
 *
 * Menu items (~14, filterable): "Commit", "Amend commit", "Cherry-pick", "Revert", etc.
 * Initial state: Selected action: "Commit". Menu closed.
 *
 * Success: selectedAction equals "cherry_pick"
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
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import type { TaskComponentProps } from '../types';

const allActions = [
  { key: 'commit', label: 'Commit' },
  { key: 'amend_commit', label: 'Amend commit' },
  { key: 'cherry_pick', label: 'Cherry-pick' },
  { key: 'revert', label: 'Revert' },
  { key: 'create_branch', label: 'Create branch…' },
  { key: 'tag_release', label: 'Tag release…' },
  { key: 'stash', label: 'Stash' },
  { key: 'pop_stash', label: 'Pop stash' },
  { key: 'reset_soft', label: 'Reset (soft)' },
  { key: 'reset_hard', label: 'Reset (hard)' },
  { key: 'fetch', label: 'Fetch' },
  { key: 'pull', label: 'Pull' },
  { key: 'push', label: 'Push' },
  { key: 'merge', label: 'Merge' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('commit');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getLabel = (key: string) => allActions.find(a => a.key === key)?.label || key;

  const filteredActions = allActions.filter(a =>
    a.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setSearchTerm('');
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
    setSearchTerm('');
  };

  const handleMenuItemClick = (key: string) => {
    setSelectedAction(key);
    setMenuOpen(false);
    setSearchTerm('');
    if (key === 'cherry_pick' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 420 }}>
      <CardHeader title="Repository" />
      <CardContent sx={{ p: 1.5 }}>
        {/* Distractors: settings links */}
        <List dense sx={{ mb: 2 }}>
          <ListItem sx={{ py: 0.5, color: '#999' }}>
            <ListItemText primary="General" primaryTypographyProps={{ fontSize: 13 }} />
          </ListItem>
          <ListItem sx={{ py: 0.5, color: '#999' }}>
            <ListItemText primary="Branches" primaryTypographyProps={{ fontSize: 13 }} />
          </ListItem>
          <ListItem sx={{ py: 0.5, color: '#999' }}>
            <ListItemText primary="Webhooks" primaryTypographyProps={{ fontSize: 13 }} />
          </ListItem>
        </List>

        <div
          data-testid="split-button-root"
          data-selected-action={selectedAction}
        >
          <ButtonGroup variant="contained" ref={anchorRef} size="small">
            <Button>{getLabel(selectedAction)}</Button>
            <Button
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
                <Paper sx={{ width: 220 }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <div>
                      <TextField
                        size="small"
                        placeholder="Search actions"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ m: 1, width: 'calc(100% - 16px)' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                        autoFocus
                      />
                      <MenuList id="split-button-menu" sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {filteredActions.map((action) => (
                          <MenuItem
                            key={action.key}
                            selected={action.key === selectedAction}
                            onClick={() => handleMenuItemClick(action.key)}
                          >
                            {action.label}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Disabled Save button (distractor) */}
        <Button disabled sx={{ mt: 2 }} variant="outlined" size="small">
          Save
        </Button>
      </CardContent>
    </Card>
  );
}
