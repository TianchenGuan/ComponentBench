'use client';

/**
 * inline_editable_text-mantine-T01: Rename workspace name (Mantine composite)
 * 
 * A centered card titled "Workspace" contains one inline editable text row labeled "Workspace name".
 * In view mode, the value is displayed as Mantine Text with a small pencil ActionIcon on the right.
 * Initial value: "Northwind".
 * 
 * Clicking the pencil swaps the Text for a one-line Mantine TextInput styled to blend into the row,
 * with inline ActionIcons for Save and Cancel.
 * 
 * Success: The committed (display) value equals 'Northwind Lab' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Northwind');
  const [editingValue, setEditingValue] = useState('Northwind');
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
    if (!isEditing && value === 'Northwind Lab' && !successCalledRef.current) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="workspace-card">
      <Text fw={600} size="lg" mb="md">Workspace</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Workspace name</Text>
        <Box
          data-testid="editable-workspace-name"
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
