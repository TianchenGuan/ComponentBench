'use client';

/**
 * inline_editable_text-mui-T06: Commit release note with snackbar feedback
 * 
 * A centered card titled "Release" has one inline editable text labeled "Release note".
 * Initial value: "Deploy soon". Clicking edit opens a TextField with Save/Cancel buttons.
 * 
 * When Save is clicked, the Save button becomes disabled and a Snackbar appears saying
 * "Saving…", then updates to "Saved".
 * 
 * The TextField only returns to read-only mode after the save completes.
 * 
 * Success: The committed (display) value equals 'Deploy at 5 PM ET' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  Stack,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Deploy soon');
  const [editingValue, setEditingValue] = useState('Deploy soon');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'Deploy at 5 PM ET' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSnackbarMessage('Saving…');
    setSnackbarOpen(true);
    
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setValue(editingValue);
    setIsSaving(false);
    setIsEditing(false);
    setSnackbarMessage('Saved');
    
    // Auto-hide after showing "Saved"
    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  return (
    <Card sx={{ width: 400 }} data-testid="release-card">
      <CardHeader title="Release" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Release note
          </Typography>
          <Box
            data-testid="editable-release-note"
            data-mode={isEditing ? 'editing' : 'display'}
            data-value={value}
          >
            {isEditing ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  inputRef={inputRef}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  size="small"
                  fullWidth
                  disabled={isSaving}
                  data-testid="editable-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSaving) handleSave();
                    if (e.key === 'Escape' && !isSaving) handleCancel();
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving}
                  data-testid="save-button"
                  aria-label="Save"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  {isSaving ? <CircularProgress size={16} /> : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancel}
                  disabled={isSaving}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 1,
                  py: 0.5,
                  px: 1,
                  ml: -1,
                }}
                onClick={handleEdit}
                data-testid="display-text"
              >
                <Typography>{value}</Typography>
                <IconButton size="small" sx={{ ml: 'auto' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Card>
  );
}
