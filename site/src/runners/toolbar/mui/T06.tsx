'use client';

/**
 * toolbar-mui-T06: Modal toolbar: reset formatting to defaults with confirmation
 *
 * The scene is a modal_flow: the main page shows a centered card with a single button 
 * labeled "Open format options". Clicking it opens a MUI Dialog titled "Format options".
 * Inside the dialog header area is a MUI Toolbar labeled "Format options" containing 
 * three formatting toggles (Bold, Italic, Underline) implemented with a ToggleButtonGroup, 
 * plus a text Button labeled "Reset" on the right.
 * Initial toolbar state inside the modal: Bold=On, Italic=On, Underline=Off.
 * When the user clicks "Reset", an inline confirmation popover appears with 
 * "Reset" (confirm) and "Cancel" options.
 */

import React, { useState } from 'react';
import {
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Popover,
  Box,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formats, setFormats] = useState<string[]>(['bold', 'italic']);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFormats(['bold', 'italic']); // Reset to initial state
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setPopoverAnchor(null);
  };

  const handleFormatChange = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  const handleResetClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const handleConfirmReset = () => {
    setFormats([]);
    setPopoverAnchor(null);
    onSuccess();
  };

  const popoverOpen = Boolean(popoverAnchor);

  return (
    <Paper elevation={2} sx={{ width: 350, p: 3, textAlign: 'center' }}>
      <Button
        variant="contained"
        onClick={handleOpenDialog}
        data-testid="mui-btn-open-format"
      >
        Open format options
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        data-dialog-id="mui-dialog-format"
      >
        <DialogTitle>Format options</DialogTitle>
        <DialogContent>
          <Toolbar
            variant="dense"
            sx={{
              bgcolor: 'grey.100',
              borderRadius: 1,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
            data-testid="mui-toolbar-format-options"
          >
            <ToggleButtonGroup
              value={formats}
              onChange={handleFormatChange}
              size="small"
            >
              <ToggleButton
                value="bold"
                aria-pressed={formats.includes('bold')}
                data-testid="mui-toolbar-format-bold"
              >
                <FormatBoldIcon />
              </ToggleButton>
              <ToggleButton
                value="italic"
                aria-pressed={formats.includes('italic')}
                data-testid="mui-toolbar-format-italic"
              >
                <FormatItalicIcon />
              </ToggleButton>
              <ToggleButton
                value="underline"
                aria-pressed={formats.includes('underline')}
                data-testid="mui-toolbar-format-underline"
              >
                <FormatUnderlinedIcon />
              </ToggleButton>
            </ToggleButtonGroup>

            <Button
              onClick={handleResetClick}
              size="small"
              data-testid="mui-toolbar-format-reset"
            >
              Reset
            </Button>
          </Toolbar>

          <Typography variant="body2" color="text.secondary">
            Defaults: all toggles Off
          </Typography>

          <Popover
            open={popoverOpen}
            anchorEl={popoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Reset to default layout?
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleConfirmReset}
                  data-testid="mui-popover-confirm-reset"
                >
                  Reset
                </Button>
                <Button
                  size="small"
                  onClick={handlePopoverClose}
                  data-testid="mui-popover-cancel"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Popover>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
