'use client';

/**
 * inline_editable_text-mantine-T09: Enter team slug in dark theme
 * 
 * A centered card titled "Team" is displayed on a dark-themed page.
 * It contains one inline editable text labeled "Team slug" with initial value "team-ops-01".
 * 
 * Editing opens a one-line TextInput with helper text: "Lowercase letters, digits, and hyphens only".
 * If uppercase letters or spaces are used, the input shows an error and the Save ActionIcon is disabled.
 * 
 * Success: The committed (display) value equals 'team-ops-42' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const SLUG_PATTERN = /^[a-z0-9-]+$/;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('team-ops-01');
  const [editingValue, setEditingValue] = useState('team-ops-01');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => SLUG_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'team-ops-42' && !successCalledRef.current) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="team-card">
      <Text fw={600} size="lg" mb="md">Team</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Team slug</Text>
        <Box
          data-testid="editable-team-slug"
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
                  error={!isValid && editingValue ? 'Invalid format' : undefined}
                  description="Lowercase letters, digits, and hyphens only"
                  data-testid="editable-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isValid) handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                />
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={handleSave}
                  disabled={!isValid}
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
