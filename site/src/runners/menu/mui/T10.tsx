'use client';

/**
 * menu-mui-T10: Deep cascading menu path File → Share → Advanced → Copy link
 * 
 * Scene: theme=light, spacing=compact, layout=drawer_flow, placement=bottom_left, scale=small, instances=1.
 *
 * The scene is a drawer_flow mock anchored near the bottom-left of the viewport.
 * A cascading (multi-level) menu system implemented with MUI.
 *
 * Structure:
 * - File (top-level menu panel)
 *   - New
 *   - Open
 *   - Share ▶ (opens submenu)
 *   - Export ▶ (opens submenu; distractor)
 * - Share submenu
 *   - Email link
 *   - Advanced ▶ (opens submenu)
 *   - Permissions ▶ (opens submenu; distractor)
 * - Advanced submenu
 *   - Copy link ← target leaf
 *   - Embed code
 *   - QR code
 *
 * Initial state:
 * - Only the top-level File panel is visible; no submenus are open.
 * - No leaf is selected.
 *
 * Success: The selected path equals ["File", "Share", "Advanced", "Copy link"].
 */

import React, { useState, useEffect } from 'react';
import { Paper, MenuList, MenuItem, ListItemText, ListItemIcon, Typography, Box, Collapse } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

// Map of leaf keys to their full paths
const pathMap: Record<string, string[]> = {
  'New': ['File', 'New'],
  'Open': ['File', 'Open'],
  'Email link': ['File', 'Share', 'Email link'],
  'Copy link': ['File', 'Share', 'Advanced', 'Copy link'],
  'Embed code': ['File', 'Share', 'Advanced', 'Embed code'],
  'QR code': ['File', 'Share', 'Advanced', 'QR code'],
  'Permissions-item': ['File', 'Share', 'Permissions-item'],
  'PDF': ['File', 'Export', 'PDF'],
  'CSV': ['File', 'Export', 'CSV'],
};

export default function T10({ onSuccess }: TaskComponentProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const selectedPath = selectedKey ? pathMap[selectedKey] : null;

  useEffect(() => {
    if (
      selectedPath &&
      selectedPath.length === 4 &&
      selectedPath[0] === 'File' &&
      selectedPath[1] === 'Share' &&
      selectedPath[2] === 'Advanced' &&
      selectedPath[3] === 'Copy link' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleLeafClick = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 280 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Tools drawer
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Selected: <strong data-testid="selected-path">{selectedPath ? selectedPath.join(' / ') : 'None'}</strong>
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block', fontWeight: 500 }}>
        File
      </Typography>

      <Paper variant="outlined" sx={{ fontSize: '0.8rem' }}>
        <MenuList dense data-testid="menu-file">
          <MenuItem onClick={() => handleLeafClick('New')} selected={selectedKey === 'New'} sx={{ fontSize: '0.8rem' }}>
            New
          </MenuItem>
          <MenuItem onClick={() => handleLeafClick('Open')} selected={selectedKey === 'Open'} sx={{ fontSize: '0.8rem' }}>
            Open
          </MenuItem>

          {/* Share submenu */}
          <MenuItem onClick={() => setShareOpen(!shareOpen)} sx={{ fontSize: '0.8rem' }}>
            <ListItemText primaryTypographyProps={{ fontSize: '0.8rem' }}>Share</ListItemText>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {shareOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </ListItemIcon>
          </MenuItem>
          <Collapse in={shareOpen}>
            <MenuList dense sx={{ pl: 2 }} data-testid="submenu-share">
              <MenuItem onClick={() => handleLeafClick('Email link')} selected={selectedKey === 'Email link'} sx={{ fontSize: '0.75rem' }}>
                Email link
              </MenuItem>

              {/* Advanced submenu */}
              <MenuItem onClick={() => setAdvancedOpen(!advancedOpen)} sx={{ fontSize: '0.75rem' }}>
                <ListItemText primaryTypographyProps={{ fontSize: '0.75rem' }}>Advanced</ListItemText>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  {advancedOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </ListItemIcon>
              </MenuItem>
              <Collapse in={advancedOpen}>
                <MenuList dense sx={{ pl: 2 }} data-testid="submenu-advanced">
                  <MenuItem onClick={() => handleLeafClick('Copy link')} selected={selectedKey === 'Copy link'} sx={{ fontSize: '0.7rem' }}>
                    Copy link
                  </MenuItem>
                  <MenuItem onClick={() => handleLeafClick('Embed code')} selected={selectedKey === 'Embed code'} sx={{ fontSize: '0.7rem' }}>
                    Embed code
                  </MenuItem>
                  <MenuItem onClick={() => handleLeafClick('QR code')} selected={selectedKey === 'QR code'} sx={{ fontSize: '0.7rem' }}>
                    QR code
                  </MenuItem>
                </MenuList>
              </Collapse>

              {/* Permissions submenu (distractor) */}
              <MenuItem onClick={() => setPermissionsOpen(!permissionsOpen)} sx={{ fontSize: '0.75rem' }}>
                <ListItemText primaryTypographyProps={{ fontSize: '0.75rem' }}>Permissions</ListItemText>
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  {permissionsOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </ListItemIcon>
              </MenuItem>
              <Collapse in={permissionsOpen}>
                <MenuList dense sx={{ pl: 2 }}>
                  <MenuItem sx={{ fontSize: '0.7rem' }}>View only</MenuItem>
                  <MenuItem sx={{ fontSize: '0.7rem' }}>Edit</MenuItem>
                </MenuList>
              </Collapse>
            </MenuList>
          </Collapse>

          {/* Export submenu (distractor) */}
          <MenuItem onClick={() => setExportOpen(!exportOpen)} sx={{ fontSize: '0.8rem' }}>
            <ListItemText primaryTypographyProps={{ fontSize: '0.8rem' }}>Export</ListItemText>
            <ListItemIcon sx={{ minWidth: 'auto' }}>
              {exportOpen ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
            </ListItemIcon>
          </MenuItem>
          <Collapse in={exportOpen}>
            <MenuList dense sx={{ pl: 2 }}>
              <MenuItem onClick={() => handleLeafClick('PDF')} selected={selectedKey === 'PDF'} sx={{ fontSize: '0.75rem' }}>
                PDF
              </MenuItem>
              <MenuItem onClick={() => handleLeafClick('CSV')} selected={selectedKey === 'CSV'} sx={{ fontSize: '0.75rem' }}>
                CSV
              </MenuItem>
            </MenuList>
          </Collapse>
        </MenuList>
      </Paper>
    </Paper>
  );
}
