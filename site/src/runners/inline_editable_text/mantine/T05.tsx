'use client';

/**
 * inline_editable_text-mantine-T05: Update event title (simple text)
 * 
 * A centered card titled "Event" shows one inline editable text row labeled "Event title".
 * The current value is "Launch". Clicking the edit ActionIcon opens a one-line TextInput
 * with Save/Cancel.
 * 
 * A small description below the row says "Shown on the public event page".
 * 
 * Success: The committed (display) value equals 'Open House' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('Launch');
  const [editingValue, setEditingValue] = useState('Launch');
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
    if (!isEditing && value === 'Open House' && !successCalledRef.current) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="event-card">
      <Text fw={600} size="lg" mb="md">Event</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Event title</Text>
        <Box
          data-testid="editable-event-title"
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
                  description="Shown on the public event page"
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
                  mt={1}
                >
                  <IconCheck size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="default"
                  onClick={handleCancel}
                  data-testid="cancel-button"
                  aria-label="Cancel"
                  mt={1}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            </Box>
          ) : (
            <Box>
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
              <Text size="xs" c="dimmed" mt={4}>Shown on the public event page</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
}
