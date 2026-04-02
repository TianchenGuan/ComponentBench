'use client';

/**
 * number_input_spinbutton-mui-T10: Modal: set daily limit and save
 * 
 * The page shows a centered card with a single button labeled "Edit limits".
 * Clicking it opens a modal dialog titled "Edit limits" (modal_flow).
 * Inside the dialog there is one MUI Number Field labeled "Daily limit".
 * - Constraints: min=0, max=200, step=10.
 * - Initial state: value is 30.
 * The dialog footer has two buttons: "Cancel" and "Save".
 * The value change is considered committed only after clicking "Save"; clicking outside the dialog closes it without saving (distractor).
 * 
 * Success: The numeric value of the target number input is 50, and the Save button has been clicked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Button, Typography, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, IconButton, InputAdornment 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [savedValue, setSavedValue] = useState<number>(30);
  const [tempValue, setTempValue] = useState<number>(30);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (savedValue === 50 && hasSaved) {
      onSuccess();
    }
  }, [savedValue, hasSaved, onSuccess]);

  const handleOpen = () => {
    setTempValue(savedValue);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setSavedValue(tempValue);
    setHasSaved(true);
    setOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Rate Limits
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Current daily limit: <strong>{savedValue}</strong>
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleOpen}
            data-testid="edit-limits-btn"
          >
            Edit limits
          </Button>
        </CardContent>
      </Card>

      <Dialog 
        open={open} 
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit limits</DialogTitle>
        <DialogContent>
          <TextField
            label="Daily limit"
            type="number"
            variant="outlined"
            fullWidth
            value={tempValue}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 0 && v <= 200) {
                setTempValue(v);
              }
            }}
            inputProps={{ 
              min: 0, 
              max: 200, 
              step: 10,
              'data-testid': 'daily-limit-input'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton 
                    size="small" 
                    onClick={() => setTempValue(prev => Math.max(prev - 10, 0))}
                    disabled={tempValue <= 0}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => setTempValue(prev => Math.min(prev + 10, 200))}
                    disabled={tempValue >= 200}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            data-testid="save-btn"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
