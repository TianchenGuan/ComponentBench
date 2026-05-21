'use client';

/**
 * inline_editable_text-mantine-T04: Enter formatted team code
 * 
 * A centered card titled "Team" contains one inline editable text row labeled "Team code".
 * The initial value is "TEAM-0001". Clicking the pencil ActionIcon opens a one-line TextInput
 * with helper text under it: "Format: TEAM-####".
 * 
 * If the prefix/casing or digit count is wrong, the input shows an error message and the
 * Save ActionIcon is disabled until valid.
 * 
 * Success: The committed (display) value equals 'TEAM-0042' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const TEAM_PATTERN = /^TEAM-\d{4}$/;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('TEAM-0001');
  const [editingValue, setEditingValue] = useState('TEAM-0001');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  const isValid = useMemo(() => TEAM_PATTERN.test(editingValue), [editingValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'TEAM-0042' && !successCalledRef.current) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="team-card">
      <Text fw={600} size="lg" mb="md">Team</Text>
      
      <Box mb="sm">
        <Text size="sm" fw={500} mb={8}>Team code</Text>
        <Box
          data-testid="editable-team-code"
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
                  description="Format: TEAM-####"
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
