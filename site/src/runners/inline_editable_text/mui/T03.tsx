'use client';

/**
 * inline_editable_text-mui-T03: Clear status message to empty (MUI composite)
 * 
 * A centered card titled "Status" contains one inline editable text row labeled "Status message".
 * The read-only Typography value is "In a meeting". Clicking the pencil icon opens a one-line
 * MUI TextField.
 * 
 * While editing, a small clear (×) IconButton appears inside the TextField end-adornment;
 * Save/Cancel buttons are displayed to the right.
 * 
 * Success: The committed (display) value equals '' exactly, and component is in display mode.
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
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('In a meeting');
  const [editingValue, setEditingValue] = useState('In a meeting');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === '' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    setValue(editingValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  const handleClear = () => {
    setEditingValue('');
    inputRef.current?.focus();
  };

  return (
    <Card sx={{ width: 400 }} data-testid="status-card">
      <CardHeader title="Status" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Status message
          </Typography>
          <Box
            data-testid="editable-status-message"
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
                  data-testid="editable-input"
                  InputProps={{
                    endAdornment: editingValue && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          data-testid="clear-button"
                          aria-label="Clear"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSave}
                  data-testid="save-button"
                  aria-label="Save"
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancel}
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
                <Typography>{value || <span style={{ color: '#999' }}>(empty)</span>}</Typography>
                <IconButton size="small" sx={{ ml: 'auto' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
