'use client';

/**
 * toolbar-mui-T04: Open overflow menu and choose Settings
 *
 * The page is a settings_panel layout with a header area anchored near the top-right.
 * The header includes a MUI AppBar with a Toolbar labeled "Project".
 * The toolbar contains two IconButtons with tooltips ("Star" and "Share") and a 
 * three-dots overflow IconButton that opens a MUI Menu when clicked.
 * The overflow Menu contains: "Settings", "Rename", "Duplicate", and "Delete".
 */

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Box,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: string) => {
    setLastAction(action);
    handleMenuClose();
    if (action.toLowerCase() === 'settings') {
      onSuccess();
    }
  };

  return (
    <Paper elevation={2} sx={{ width: 450, overflow: 'hidden' }}>
      <AppBar position="static" color="default" data-testid="mui-toolbar-project">
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Project
          </Typography>
          <Tooltip title="Star">
            <IconButton
              onClick={() => handleAction('Star')}
              data-testid="mui-toolbar-project-star"
            >
              <StarBorderIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton
              onClick={() => handleAction('Share')}
              data-testid="mui-toolbar-project-share"
            >
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton
              aria-label="More"
              onClick={handleMenuOpen}
              data-testid="mui-toolbar-project-more"
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleAction('Settings')} data-testid="mui-menu-settings">
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('Rename')} data-testid="mui-menu-rename">
              <ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Rename</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('Duplicate')} data-testid="mui-menu-duplicate">
              <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Duplicate</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction('Delete')} data-testid="mui-menu-delete">
              <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Last action: {lastAction}
        </Typography>

        {/* Distractor */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button size="small" variant="text">
            Account
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
