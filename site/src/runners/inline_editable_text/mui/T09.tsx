'use client';

/**
 * inline_editable_text-mui-T09: Enter tracking ID in dark theme
 * 
 * The page is rendered in a dark theme. A centered card titled "Shipment" contains one
 * inline editable text labeled "Tracking ID".
 * 
 * The initial value is "ZX-0000-NA". Clicking edit opens a one-line TextField with helper
 * text: "Use uppercase letters and digits: XX-####-XX".
 * 
 * Invalid entries show an error and disable Save until the format is correct.
 * 
 * Success: The committed (display) value equals 'ZX-2049-NA' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
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

const TRACKING_PATTERN = /^[A-Z]{2}-\d{4}-[A-Z]{2}$/;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('ZX-0000-NA');
  const [editingValue, setEditingValue] = useState('ZX-0000-NA');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => TRACKING_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'ZX-2049-NA' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isValid) {
      setValue(editingValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  // Note: Dark theme is handled by ThemeWrapper at the task page level

  return (
    <Card sx={{ width: 400 }} data-testid="shipment-card">
      <CardHeader title="Shipment" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Tracking ID
          </Typography>
          <Box
            data-testid="editable-tracking-id"
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
                    error={!isValid && editingValue !== ''}
                    helperText="Use uppercase letters and digits: XX-####-XX"
                    data-testid="editable-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isValid) handleSave();
                      if (e.key === 'Escape') handleCancel();
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                    disabled={!isValid}
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
