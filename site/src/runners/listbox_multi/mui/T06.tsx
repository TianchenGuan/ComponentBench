'use client';

/**
 * listbox_multi-mui-T06: Dialog: share calendar permissions
 *
 * Layout: modal_flow. The page shows a settings card with a button labeled "Sharing settings".
 * Clicking it opens a Material UI Dialog titled "Sharing settings".
 * Inside the dialog is the target checkbox listbox labeled "Who can see my calendar".
 * Options (6): Only me, Team members, Managers, Entire company, External guests, Public.
 * Initial state: "Only me" is selected.
 * Dialog actions: "Cancel" and primary "Save".
 *
 * Success: The target listbox has exactly: Team members, Managers. (require_confirm=true: only after Save)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = ['Only me', 'Team members', 'Managers', 'Entire company', 'External guests', 'Public'];
const targetSet = ['Team members', 'Managers'];
const initialSelected = ['Only me'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogSelected, setDialogSelected] = useState<string[]>(initialSelected);
  const [savedSelection, setSavedSelection] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(savedSelection, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [savedSelection, onSuccess]);

  const handleOpen = () => {
    setDialogSelected([...savedSelection]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    setSavedSelection([...dialogSelected]);
    setIsOpen(false);
  };

  const handleToggle = (value: string) => {
    const currentIndex = dialogSelected.indexOf(value);
    const newSelected = [...dialogSelected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setDialogSelected(newSelected);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Calendar sharing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Calendar sharing: open Sharing settings to choose visibility.
          </Typography>
          <Button variant="contained" onClick={handleOpen}>
            Sharing settings
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Current audience: {savedSelection.join(', ')}
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Sharing settings</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Who can see my calendar
          </Typography>
          <List
            data-testid="listbox-calendar-visibility"
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {options.map((opt) => (
              <ListItem key={opt} disablePadding>
                <ListItemButton onClick={() => handleToggle(opt)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={dialogSelected.includes(opt)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={opt} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
