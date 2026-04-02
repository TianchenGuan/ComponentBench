'use client';

/**
 * inline_editable_text-mantine-T03: Clear note to empty (Mantine composite)
 * 
 * A centered card titled "Note" includes one inline editable text labeled "Note".
 * The current value is "Call me after lunch". Clicking the edit ActionIcon opens a one-line TextInput.
 * 
 * While editing, a clear (×) affordance appears inside the input rightSection and Save/Cancel
 * ActionIcons appear beside it.
 * 
 * Success: The committed (display) value equals '' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box, CloseButton } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Call me after lunch');
  const [editingValue, setEditingValue] = useState('Call me after lunch');
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="note-card">
      <Text fw={600} size="lg" mb="md">Note</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Note</Text>
        <Box
          data-testid="editable-note"
          data-mode={isEditing ? 'editing' : 'display'}
          data-value={value}
        >
          {isEditing ? (
            <Group gap="xs" wrap="nowrap">
              <TextInput
                ref={inputRef}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                style={{ flex: 1 }}
                data-testid="editable-input"
                rightSection={
                  editingValue && (
                    <CloseButton
                      size="sm"
                      onClick={handleClear}
                      data-testid="clear-button"
                      aria-label="Clear"
                    />
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={handleSave}
                data-testid="save-button"
                aria-label="Save"
              >
                <IconCheck size={16} />
              </ActionIcon>
              <ActionIcon
                variant="default"
                onClick={handleCancel}
                data-testid="cancel-button"
                aria-label="Cancel"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          ) : (
            <Group
              gap="xs"
              style={{ cursor: 'pointer' }}
              onClick={handleEdit}
              data-testid="display-text"
            >
              <Text>{value || <span style={{ color: '#999' }}>(empty)</span>}</Text>
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
