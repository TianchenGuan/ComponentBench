'use client';

/**
 * split_button-mui-T09: Actions: match icon reference to select Upload (MUI, small)
 *
 * Layout: isolated card placed near the bottom-left of the viewport (placement=bottom_left) with small scale.
 *
 * Guidance (visual): Reference icon-only chip showing a "cloud upload" glyph.
 * Menu items: Cloud upload-"Upload", Cloud download-"Download", Trash-"Delete", Link-"Copy link"
 *
 * Initial state: Selected action is "Download".
 * Success: selectedAction equals "upload"
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
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'upload', label: 'Upload', icon: <CloudUploadIcon fontSize="small" /> },
  { key: 'download', label: 'Download', icon: <CloudDownloadIcon fontSize="small" /> },
  { key: 'delete', label: 'Delete', icon: <DeleteIcon fontSize="small" /> },
  { key: 'copy_link', label: 'Copy link', icon: <LinkIcon fontSize="small" /> },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('download');
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
    if (key === 'upload' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardHeader title="Actions" titleTypographyProps={{ fontSize: 14 }} />
      <CardContent>
        {/* Visual guidance - reference icon chip */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 12, color: '#666' }}>Match this icon:</span>
          <Box
            data-reference-token="icon_cloud_upload"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              bgcolor: '#f0f0f0',
              borderRadius: 1,
            }}
          >
            <CloudUploadIcon fontSize="small" />
          </Box>
        </Box>

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
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option) => (
                        <MenuItem
                          key={option.key}
                          selected={option.key === selectedAction}
                          onClick={() => handleMenuItemClick(option.key)}
                        >
                          <ListItemIcon>{option.icon}</ListItemIcon>
                          <ListItemText>{option.label}</ListItemText>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Disabled ToggleButtonGroup (distractor) */}
        <ToggleButtonGroup size="small" sx={{ mt: 2, opacity: 0.4 }} disabled>
          <ToggleButton value="list">List</ToggleButton>
          <ToggleButton value="grid">Grid</ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
