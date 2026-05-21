'use client';

/**
 * inline_editable_text-mui-T02: Enter edit mode (MUI composite)
 * 
 * A centered card titled "Project" has one inline editable text row labeled "Project nickname".
 * The read-only value is Typography showing "Apollo" with a trailing pencil IconButton.
 * 
 * Clicking the pencil changes the row into a focused MUI TextField with Save and Cancel buttons.
 * 
 * Success: The component is in editing mode (mode='editing').
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Apollo');
  const [editingValue, setEditingValue] = useState('Apollo');
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
    // Success when entering edit mode
    if (isEditing && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [isEditing, onSuccess]);

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

  return (
    <Card sx={{ width: 400 }} data-testid="project-card">
      <CardHeader title="Project" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Project nickname
          </Typography>
          <Box
            data-testid="editable-project-nickname"
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
                <Typography>{value}</Typography>
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
