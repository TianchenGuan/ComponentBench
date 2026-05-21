'use client';

/**
 * inline_editable_text-mantine-T02: Enter edit mode (Mantine composite)
 * 
 * A centered card titled "Branding" contains one inline editable text row labeled "Tagline".
 * The read-only value is Mantine Text showing "Fast & simple" with a pencil ActionIcon.
 * 
 * Clicking the pencil turns the row into a focused one-line TextInput and shows Save/Cancel ActionIcons.
 * 
 * Success: The component is in editing mode (mode='editing').
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Fast & simple');
  const [editingValue, setEditingValue] = useState('Fast & simple');
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="branding-card">
      <Text fw={600} size="lg" mb="md">Branding</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Tagline</Text>
        <Box
          data-testid="editable-tagline"
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
