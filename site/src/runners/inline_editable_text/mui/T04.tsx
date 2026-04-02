'use client';

/**
 * inline_editable_text-mui-T04: Enter formatted customer ID
 * 
 * A centered card titled "Customer" contains one inline editable text labeled "Customer ID".
 * The current value is "CUS-00001" in Typography. Clicking edit opens a one-line TextField
 * with helper text: "Format: CUS-#####".
 * 
 * The component validates the prefix and digit count; if invalid, the TextField shows an
 * error and the Save button is disabled.
 * 
 * Success: The committed (display) value equals 'CUS-00942' exactly, and component is in display mode.
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

const CUS_PATTERN = /^CUS-\d{5}$/;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('CUS-00001');
  const [editingValue, setEditingValue] = useState('CUS-00001');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => CUS_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'CUS-00942' && !successCalledRef.current) {
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

  return (
    <Card sx={{ width: 400 }} data-testid="customer-card">
      <CardHeader title="Customer" />
      <CardContent>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Customer ID
          </Typography>
          <Box
            data-testid="editable-customer-id"
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
                    helperText="Format: CUS-#####"
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
