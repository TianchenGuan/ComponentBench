'use client';

/**
 * Task ID: resizable_columns-mui-T10
 * Task Name: Modal layout editor: resize Description and Save
 *
 * Setup Description:
 * Layout: modal_flow (centered).
 * Page starts with a settings card containing:
 * - A button "Customize columns" (opens the modal).
 * - Other toggles (distractors).
 *
 * Modal content:
 * - Title: "Customize columns"
 * - A MUI DataGrid preview with resizable columns: Field, Description, Visible, Order.
 * - Draft readout in modal footer: "Description width (draft): ###px".
 * - Buttons: "Save" (primary), "Cancel" (secondary).
 *
 * Initial state: Description starts at 240px. Modal is closed on load.
 *
 * Success Trigger: Description within ±5px of 320px AND user clicked "Save".
 *
 * Theme: light, Spacing: comfortable, Layout: modal_flow, Placement: center
 */

import React, { useState, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Button, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Switch, FormControlLabel, Snackbar, Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { TaskComponentProps } from '../types';
import { isWithinTolerance } from '../types';

const rows = [
  { id: 1, field: 'name', description: 'User full name', visible: true, order: 1 },
  { id: 2, field: 'email', description: 'Primary email address', visible: true, order: 2 },
  { id: 3, field: 'role', description: 'User role in the system', visible: true, order: 3 },
  { id: 4, field: 'status', description: 'Account status (active/inactive)', visible: false, order: 4 },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftWidths, setDraftWidths] = useState<Record<string, number>>({
    field: 100,
    description: 240,
    visible: 80,
    order: 80,
  });
  const [savedWidths, setSavedWidths] = useState<Record<string, number>>({ ...draftWidths });
  const [showToast, setShowToast] = useState(false);
  const successFired = useRef(false);

  const descriptionWidth = draftWidths.description ?? 240;

  const handleOpen = () => setOpen(true);
  
  const handleCancel = () => {
    setDraftWidths({ ...savedWidths });
    setOpen(false);
  };

  const handleSave = () => {
    setSavedWidths({ ...draftWidths });
    setShowToast(true);
    setOpen(false);
    
    // Check success after save
    if (!successFired.current && isWithinTolerance(draftWidths.description, 320, 5)) {
      successFired.current = true;
      onSuccess();
    }
  };

  const columns: GridColDef[] = [
    { field: 'field', headerName: 'Field', width: draftWidths.field, resizable: true },
    { field: 'description', headerName: 'Description', width: draftWidths.description, resizable: true },
    { field: 'visible', headerName: 'Visible', width: draftWidths.visible, resizable: true },
    { field: 'order', headerName: 'Order', width: draftWidths.order, resizable: true },
  ];

  return (
    <>
      <Card sx={{ width: 400 }} data-testid="rc-settings-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Table Settings
          </Typography>
          
          <Stack spacing={2}>
            <Button
              variant="contained"
              onClick={handleOpen}
              data-testid="rc-customize-columns"
            >
              Customize columns
            </Button>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show totals"
            />
            <FormControlLabel
              control={<Switch />}
              label="Compact mode"
            />
          </Stack>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        data-testid="rc-customize-modal"
      >
        <DialogTitle>Customize columns</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 300, width: '100%', mt: 1 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter
              onColumnWidthChange={(params) => {
                setDraftWidths(prev => ({
                  ...prev,
                  [params.colDef.field]: params.width,
                }));
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" data-testid="rc-draft-width">
            Description width (draft): {descriptionWidth}px
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleSave} data-testid="rc-save">
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
      >
        <Alert severity="success" onClose={() => setShowToast(false)}>
          Saved column layout
        </Alert>
      </Snackbar>
    </>
  );
}
