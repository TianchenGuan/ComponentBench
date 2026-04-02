'use client';

/**
 * inline_editable_text-mantine-T06: Commit short description with toast feedback
 * 
 * A centered card titled "Description" contains one inline editable text row labeled "Short description".
 * The initial value is "Ships soon". Clicking the pencil ActionIcon opens a one-line TextInput
 * with Save/Cancel.
 * 
 * On Save, the component shows a brief loading indicator on the Save icon and then displays
 * a toast notification "Saved".
 * 
 * If the description exceeds 24 characters, an inline error appears and the value is not committed.
 * 
 * Success: The committed (display) value equals 'New orders ship Monday.' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Ships soon');
  const [editingValue, setEditingValue] = useState('Ships soon');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => editingValue.length <= 24, [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'New orders ship Monday.' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [value, isEditing, onSuccess]);

  const handleEdit = () => {
    setEditingValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!isValid) return;
    
    setIsSaving(true);
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 500));
    setValue(editingValue);
    setIsSaving(false);
    setIsEditing(false);
    
    notifications.show({
      message: 'Saved',
      color: 'green',
      autoClose: 2000,
    });
  };

  const handleCancel = () => {
    setEditingValue(value);
    setIsEditing(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="description-card">
      <Text fw={600} size="lg" mb="md">Description</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Short description</Text>
        <Box
          data-testid="editable-short-description"
          data-mode={isEditing ? 'editing' : 'display'}
          data-value={value}
        >
          {isEditing ? (
            <Box>
              <Group gap="xs" wrap="nowrap" align="flex-start">
                <TextInput
                  ref={inputRef}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  style={{ flex: 1 }}
                  error={!isValid ? 'Maximum 24 characters allowed' : undefined}
                  disabled={isSaving}
                  data-testid="editable-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid && !isSaving) handleSave();
                    if (e.key === 'Escape' && !isSaving) handleCancel();
                  }}
                />
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={handleSave}
                  disabled={!isValid || isSaving}
                  data-testid="save-button"
                  aria-label="Save"
                  mt={1}
                >
                  {isSaving ? <Loader size={14} color="white" /> : <IconCheck size={16} />}
                </ActionIcon>
                <ActionIcon
                  variant="default"
                  onClick={handleCancel}
                  disabled={isSaving}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                  mt={1}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ) : (
            <Group
              gap="xs"
              style={{ cursor: 'pointer' }}
              onClick={handleEdit}
              data-testid="display-text"
            >
              <Text>{value}</Text>
              <ActionIcon variant="subtle" size="sm">
                <IconPencil size={14} />
              </ActionIcon>
            </Group>
          )}
        </Box>
      </Box>
    </Card>
  );
}
