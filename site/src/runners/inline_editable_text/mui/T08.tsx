'use client';

/**
 * inline_editable_text-mui-T08: Edit secondary label among two fields
 * 
 * A centered card titled "Labels" contains two inline editable text rows stacked vertically:
 *   • "Primary label" (initial: "Active")
 *   • "Secondary label" (initial: "Pending")
 * 
 * Both rows use the same composite pattern: Typography in read-only mode with a pencil
 * IconButton; TextField with Save/Cancel in edit mode.
 * 
 * Success: The editable text instance labeled 'Secondary label' has committed value
 * 'Archived' exactly, and is in display mode.
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

interface InlineEditableProps {
  label: string;
  initialValue: string;
  testId: string;
  onValueCommit?: (value: string, isEditing: boolean) => void;
}

function InlineEditable({ label, initialValue, testId, onValueCommit }: InlineEditableProps) {
  const [value, setValue] = useState(initialValue);
  const [editingValue, setEditingValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    onValueCommit?.(value, isEditing);
  }, [value, isEditing, onValueCommit]);

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
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Box
        data-testid={testId}
        data-mode={isEditing ? 'editing' : 'display'}
        data-value={value}
        aria-label={label}
      >
        {isEditing ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              inputRef={inputRef}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              size="small"
              fullWidth
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              data-testid={`${testId}-save`}
              aria-label="Save"
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancel}
              data-testid={`${testId}-cancel`}
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
            data-testid={`${testId}-display`}
          >
            <Typography>{value}</Typography>
            <IconButton size="small" sx={{ ml: 'auto' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleSecondaryLabelChange = (value: string, isEditing: boolean) => {
    if (!isEditing && value === 'Archived' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }} data-testid="labels-card">
      <CardHeader title="Labels" />
      <CardContent>
        <InlineEditable
          label="Primary label"
          initialValue="Active"
          testId="editable-primary-label"
        />
        <InlineEditable
          label="Secondary label"
          initialValue="Pending"
          testId="editable-secondary-label"
          onValueCommit={handleSecondaryLabelChange}
        />
      </CardContent>
    </Card>
  );
}
