'use client';

/**
 * split_button-mui-T05: Sort control: toggle to Descending (MUI)
 *
 * Layout: isolated card titled "Files" centered in the viewport.
 * Target component: MUI split button used as a sort control.
 * - Main button toggles order between Ascending and Descending.
 * - Arrow button opens menu to change field (Name, Date, Size).
 *
 * Initial state: Field: Date, Order: Ascending
 * Success: sortOrder equals "desc"
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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const fields = [
  { key: 'name', label: 'Name' },
  { key: 'date', label: 'Date' },
  { key: 'size', label: 'Size' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getFieldLabel = (key: string) => fields.find(f => f.key === key)?.label || key;
  const getOrderLabel = (order: string) => order === 'asc' ? 'Ascending' : 'Descending';

  const handleMainClick = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    if (newOrder === 'desc' && !hasTriggeredSuccess) {
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

  const handleFieldClick = (key: string) => {
    setSortField(key);
    setMenuOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Files" />
      <CardContent>
        {/* Static file list preview (distractors) */}
        <List dense sx={{ mb: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
          <ListItem>
            <ListItemText primary="document.pdf" secondary="2.3 MB" />
          </ListItem>
          <ListItem>
            <ListItemText primary="image.png" secondary="1.1 MB" />
          </ListItem>
          <ListItem>
            <ListItemText primary="notes.txt" secondary="4 KB" />
          </ListItem>
        </List>

        <div
          data-testid="split-button-root"
          data-sort-field={sortField}
          data-sort-order={sortOrder}
        >
          <ButtonGroup variant="outlined" ref={anchorRef}>
            <Button onClick={handleMainClick}>
              Sort: {getFieldLabel(sortField)} · {getOrderLabel(sortOrder)}
            </Button>
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
                      {fields.map((field) => (
                        <MenuItem
                          key={field.key}
                          selected={field.key === sortField}
                          onClick={() => handleFieldClick(field.key)}
                        >
                          {field.label}
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
