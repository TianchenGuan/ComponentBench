'use client';

/**
 * split_button-mui-T04: Export panel: set split-button to Export Excel (MUI)
 *
 * Layout: form_section titled "Data export".
 * Target component: MUI split button labeled "Export".
 *
 * Other UI (clutter=low):
 * - A read-only "Rows: 1,248" label.
 * - A disabled checkbox "Include archived".
 * - A helper tooltip icon (non-interactive).
 *
 * Menu items (10 total): "Export CSV", "Export CSV (UTF-8)", "Export Excel", "Export PDF", "Export JSON", "Export XML" (disabled), Divider, "Export settings…"
 * Initial state: Selected action: "Export CSV".
 *
 * Success: selectedAction equals "export_excel"
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
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'export_csv', label: 'Export CSV' },
  { key: 'export_csv_utf8', label: 'Export CSV (UTF-8)' },
  { key: 'export_excel', label: 'Export Excel' },
  { key: 'export_pdf', label: 'Export PDF' },
  { key: 'export_json', label: 'Export JSON' },
  { key: 'export_xml', label: 'Export XML', disabled: true },
  { key: 'divider', divider: true },
  { key: 'export_settings', label: 'Export settings…' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('export_csv');
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
    const option = options.find(o => o.key === key);
    if (option?.disabled || option?.divider) return;
    
    setSelectedAction(key);
    setMenuOpen(false);
    if (key === 'export_excel' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Data export" />
      <CardContent>
        {/* Clutter: read-only info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Typography variant="body2" color="text.secondary">
            Rows: 1,248
          </Typography>
          <HelpOutlineIcon sx={{ fontSize: 16, color: '#bbb' }} />
        </div>

        {/* Disabled checkbox */}
        <FormControlLabel
          control={<Checkbox disabled />}
          label="Include archived"
          sx={{ mb: 2, opacity: 0.5 }}
        />

        <div
          data-testid="split-button-root"
          data-selected-action={selectedAction}
        >
          <ButtonGroup variant="contained" ref={anchorRef}>
            <Button>{getLabel(selectedAction)}</Button>
            <Button
              size="small"
              aria-label="Open export options"
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
                            disabled={option.disabled}
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
      </CardContent>
    </Card>
  );
}
