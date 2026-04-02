'use client';

/**
 * tags_input-mui-T08: Add recipient tags in a dialog and Save
 *
 * The page uses a **dark theme** and shows a settings card titled "Alerts".
 *
 * Modal flow:
 * - The card contains a button labeled "Edit recipients".
 * - Clicking it opens a MUI Dialog with the title "Edit recipients".
 *
 * Inside the dialog:
 * - There is one MUI Autocomplete (multiple chips, freeSolo) labeled "Recipients".
 * - The field starts with one chip: "test".
 * - A small helper text under the field says "Press Enter to add each recipient".
 * - Dialog actions include "Cancel" and a primary "Save".
 *
 * Commit requirement:
 * - Changes to chips are visible immediately, but they are only committed when **Save** is clicked.
 * - Closing the dialog with Cancel or the close icon should not count as success.
 *
 * Additional clutter:
 * - The dialog also shows a read-only checkbox "Notify by SMS" (disabled) as a benign distractor.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): alice, bob, carol.
 * The change is committed by clicking **Save**.
 */

import React, { useRef, useState } from 'react';
import { 
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Autocomplete, TextField, Chip, FormControlLabel, Checkbox 
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['test']);
  const [pendingTags, setPendingTags] = useState<string[]>(['test']);
  const hasSucceeded = useRef(false);

  const handleOpenDialog = () => {
    setPendingTags([...tags]);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    setTags(pendingTags);
    setIsDialogOpen(false);
    
    const normalizedTags = pendingTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['alice', 'bob', 'carol'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setPendingTags([...tags]);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Alerts</Typography>
          <Button 
            variant="outlined" 
            onClick={handleOpenDialog}
            data-testid="edit-recipients-button"
          >
            Edit recipients
          </Button>
        </CardContent>
      </Card>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        data-testid="recipients-dialog"
      >
        <DialogTitle>Edit recipients</DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={pendingTags}
            onChange={(_, newValue) => setPendingTags(newValue as string[])}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  size="small"
                  {...getTagProps({ index })}
                  key={index}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Recipients"
                helperText="Press Enter to add each recipient"
                sx={{ mt: 1 }}
                inputProps={{
                  ...params.inputProps,
                  'data-testid': 'dialog-recipients-input',
                }}
              />
            )}
          />
          <FormControlLabel 
            control={<Checkbox disabled />} 
            label="Notify by SMS" 
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            data-testid="save-button"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
