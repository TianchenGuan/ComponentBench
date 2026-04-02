'use client';

/**
 * inline_editable_text-mui-T05: Update meeting title (simple text)
 * 
 * A centered card titled "Calendar" includes a single inline editable text labeled "Meeting title".
 * Initial Typography value: "Sync". Clicking the pencil icon opens a one-line TextField with
 * Save/Cancel buttons.
 * 
 * A small helper hint under the field says "Title is shown on the calendar".
 * 
 * Success: The committed (display) value equals 'Weekly Sync' exactly, and component is in display mode.
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

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Sync');
  const [editingValue, setEditingValue] = useState('Sync');
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
    if (!isEditing && value === 'Weekly Sync' && !successCalledRef.current) {
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

  return (
    <Card sx={{ width: 400 }} data-testid="calendar-card">
      <CardHeader title="Calendar" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Meeting title
          </Typography>
          <Box
            data-testid="editable-meeting-title"
            data-mode={isEditing ? 'editing' : 'display'}
            data-value={value}
          >
            {isEditing ? (
              <Box>
                <Stack direction="row" spacing={1} alignItems="flex-start">
                  <TextField
                    inputRef={inputRef}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    size="small"
                    fullWidth
                    helperText="Title is shown on the calendar"
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
                    sx={{ minWidth: 'auto', px: 1, mt: 0.5 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancel}
                    data-testid="cancel-button"
                    aria-label="Cancel"
                    sx={{ minWidth: 'auto', px: 1, mt: 0.5 }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
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
