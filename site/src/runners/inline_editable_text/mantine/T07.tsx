'use client';

/**
 * inline_editable_text-mantine-T07: Match internal label from reference card (two instances)
 * 
 * A centered card titled "Labels" has two inline editable text rows:
 *   • "Public label" (initial: "Customer")
 *   • "Internal label" (initial: "Ops")
 * 
 * To the right, a reference card titled "Reference" shows the desired internal label in bold text.
 * The target string is not included in the instruction; it must be read from the reference card.
 * 
 * Success: The editable text instance labeled 'Internal label' has committed value
 * 'Back Office' exactly, and is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box, Stack } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
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
    <Box mb="md">
      <Text size="sm" fw={500} mb={8}>{label}</Text>
      <Box
        data-testid={testId}
        data-mode={isEditing ? 'editing' : 'display'}
        data-value={value}
        aria-label={label}
      >
        {isEditing ? (
          <Group gap="xs" wrap="nowrap">
            <TextInput
              ref={inputRef}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              style={{ flex: 1 }}
              data-testid={`${testId}-input`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <ActionIcon
              variant="filled"
              color="blue"
              onClick={handleSave}
              data-testid={`${testId}-save`}
              aria-label="Save"
            >
              <IconCheck size={16} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              onClick={handleCancel}
              data-testid={`${testId}-cancel`}
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
            data-testid={`${testId}-display`}
          >
            <Text>{value}</Text>
            <ActionIcon variant="subtle" size="sm">
              <IconPencil size={14} />
            </ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleInternalLabelChange = (value: string, isEditing: boolean) => {
    if (!isEditing && value === 'Back Office' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  return (
    <Group gap="lg" align="flex-start">
      <Card shadow="sm" padding="lg" radius="md" withBorder w={320} data-testid="labels-card">
        <Text fw={600} size="lg" mb="md">Labels</Text>
        
        <InlineEditable
          label="Public label"
          initialValue="Customer"
          testId="editable-public-label"
        />
        
        <InlineEditable
          label="Internal label"
          initialValue="Ops"
          testId="editable-internal-label"
          onValueCommit={handleInternalLabelChange}
        />
      </Card>
      
      <Card shadow="sm" padding="lg" radius="md" withBorder w={180} data-testid="reference-card">
        <Text fw={500} size="sm" c="dimmed" mb="sm">Reference</Text>
        <Text fw={700} size="lg" data-testid="reference-text">Back Office</Text>
      </Card>
    </Group>
  );
}
