'use client';

/**
 * menubar-mui-T10: File → Export → PDF (nested popovers)
 * 
 * Layout: isolated_card, centered.
 * The header is built from MUI AppBar/Toolbar. The menubar includes a "File" button that opens a Menu popover.
 * Inside the File menu:
 * - Items: New, Open…, Export ▶, Close
 * - "Export" is implemented as a nested submenu: hovering or focusing "Export" opens a second Menu popover to the right.
 * Export submenu items: PDF (target), CSV.
 * Interaction details:
 * - First-level popover opens on click of "File".
 * - Second-level submenu opens when the pointer moves over "Export" (or by clicking the "Export" row, depending on implementation).
 * - Selecting a leaf closes popovers and records the selected_path.
 * Initial state: no menus open.
 * 
 * Success: The selected menu path is File → Export → PDF.
 */

import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Paper, Box, Menu, MenuItem, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [fileAnchor, setFileAnchor] = useState<null | HTMLElement>(null);
  const [exportAnchor, setExportAnchor] = useState<null | HTMLElement>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const fileOpen = Boolean(fileAnchor);
  const exportOpen = Boolean(exportAnchor);

  useEffect(() => {
    if (
      selectedPath.length === 3 &&
      selectedPath[0] === 'File' &&
      selectedPath[1] === 'Export' &&
      selectedPath[2] === 'PDF' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleFileClick = (event: React.MouseEvent<HTMLElement>) => {
    setFileAnchor(event.currentTarget);
  };

  const handleFileClose = () => {
    setFileAnchor(null);
    setExportAnchor(null);
  };

  const handleExportHover = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchor(event.currentTarget);
  };

  const handleExportItemClick = (item: string) => {
    setSelectedPath(['File', 'Export', item]);
    handleFileClose();
  };

  const handleFileItemClick = (item: string) => {
    setSelectedPath(['File', item]);
    handleFileClose();
  };

  return (
    <Paper elevation={2} sx={{ width: 450, overflow: 'hidden' }}>
      <Box sx={{ fontSize: 12, color: 'text.secondary', p: 1.5, pb: 0, fontWeight: 500 }}>
        File menu contains an Export submenu with PDF/CSV options
      </Box>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar data-testid="menubar-main" sx={{ minHeight: 48 }}>
          <Button
            onClick={handleFileClick}
            endIcon={<KeyboardArrowDownIcon />}
            aria-expanded={fileOpen}
            aria-haspopup="true"
            sx={{ color: 'text.secondary', px: 2 }}
            data-testid="menubar-item-file"
          >
            File
          </Button>
          <Button sx={{ color: 'text.secondary', px: 2 }}>Edit</Button>
          <Button sx={{ color: 'text.secondary', px: 2 }}>View</Button>
          <Button sx={{ color: 'text.secondary', px: 2 }}>Help</Button>

          {/* File Menu */}
          <Menu
            anchorEl={fileAnchor}
            open={fileOpen}
            onClose={handleFileClose}
            data-testid="menu-file"
          >
            <MenuItem onClick={() => handleFileItemClick('New')}>New</MenuItem>
            <MenuItem onClick={() => handleFileItemClick('Open…')}>Open…</MenuItem>
            <MenuItem 
              onMouseEnter={handleExportHover}
              onClick={handleExportHover}
              data-testid="menu-item-export"
            >
              <ListItemText>Export</ListItemText>
              <ChevronRightIcon fontSize="small" sx={{ ml: 2 }} />
            </MenuItem>
            <MenuItem onClick={() => handleFileItemClick('Close')}>Close</MenuItem>
          </Menu>

          {/* Export Submenu */}
          <Menu
            anchorEl={exportAnchor}
            open={exportOpen}
            onClose={() => setExportAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            data-testid="menu-export"
          >
            <MenuItem onClick={() => handleExportItemClick('PDF')} data-testid="menu-item-pdf">
              PDF
            </MenuItem>
            <MenuItem onClick={() => handleExportItemClick('CSV')} data-testid="menu-item-csv">
              CSV
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Paper>
  );
}
