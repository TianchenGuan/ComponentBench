'use client';

/**
 * inline_editable_text-mui-T07: Match badge label from a preview chip
 * 
 * A centered card titled "Badge" shows:
 *   • Left: one inline editable text labeled "Badge label", currently "OFF".
 *   • Right: a non-editable MUI Chip preview (blue) that displays the desired label text.
 * 
 * The goal requires reading the target string from the preview chip rather than from
 * the instruction text.
 * 
 * Success: The committed (display) value equals 'ON-CALL' exactly, and component is in display mode.
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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('OFF');
  const [editingValue, setEditingValue] = useState('OFF');
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
    if (!isEditing && value === 'ON-CALL' && !successCalledRef.current) {
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
    <Card sx={{ width: 450 }} data-testid="badge-card">
      <CardHeader title="Badge" />
      <CardContent>
        <Stack direction="row" spacing={4} alignItems="flex-start">
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Badge label
            </Typography>
            <Box
              data-testid="editable-badge-label"
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
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Preview
            </Typography>
            <Chip
              label="ON-CALL"
              color="primary"
              data-testid="preview-chip"
              sx={{ fontSize: 14, fontWeight: 600 }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
