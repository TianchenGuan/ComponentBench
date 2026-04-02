'use client';

/**
 * inline_editable_text-mantine-T10: Edit display name inside a drawer (two fields, small scale)
 * 
 * The main page shows a small "Edit profile" button. Clicking it opens a Mantine Drawer that slides
 * in from the left.
 * 
 * Inside the drawer is a compact profile form with two inline editable text rows:
 *   • "Display name" (initial: "Riley Q.")
 *   • "Username" (initial: "rileyq")
 * 
 * Success: The editable text instance labeled 'Display name' has committed value 'Riley Quinn'
 * exactly, and is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Text, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface InlineEditableProps {
  label: string;
  initialValue: string;
  testId: string;
  size?: 'sm' | 'md';
  onValueCommit?: (value: string, isEditing: boolean) => void;
}

function InlineEditable({ label, initialValue, testId, size = 'md', onValueCommit }: InlineEditableProps) {
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
      <Text size={size === 'sm' ? 'xs' : 'sm'} fw={500} mb={6}>{label}</Text>
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
              size={size}
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
              size={size}
              onClick={handleSave}
              data-testid={`${testId}-save`}
              aria-label="Save"
            >
              <IconCheck size={size === 'sm' ? 12 : 16} />
            </ActionIcon>
            <ActionIcon
              variant="default"
              size={size}
              onClick={handleCancel}
              data-testid={`${testId}-cancel`}
              aria-label="Cancel"
            >
              <IconX size={size === 'sm' ? 12 : 16} />
            </ActionIcon>
          </Group>
        ) : (
          <Group
            gap="xs"
            style={{ cursor: 'pointer' }}
            onClick={handleEdit}
            data-testid={`${testId}-display`}
          >
            <Text size={size}>{value}</Text>
            <ActionIcon variant="subtle" size={size === 'sm' ? 'xs' : 'sm'}>
              <IconPencil size={size === 'sm' ? 10 : 14} />
            </ActionIcon>
          </Group>
        )}
      </Box>
    </Box>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const successCalledRef = useRef(false);

  const handleDisplayNameChange = (value: string, isEditing: boolean) => {
    if (!isEditing && value === 'Riley Quinn' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  return (
    <Box data-testid="drawer-container">
      <Button onClick={open} size="sm" data-testid="edit-profile-button">
        Edit profile
      </Button>
      
      <Drawer
        opened={opened}
        onClose={close}
        title="Edit Profile"
        position="left"
        size="sm"
        data-testid="profile-drawer"
      >
        <InlineEditable
          label="Display name"
          initialValue="Riley Q."
          testId="editable-display-name"
          size="sm"
          onValueCommit={handleDisplayNameChange}
        />
        
        <InlineEditable
          label="Username"
          initialValue="rileyq"
          testId="editable-username"
          size="sm"
        />
        
        <Box mt="lg">
          <Text size="xs" c="dimmed">Account created: 2024</Text>
        </Box>
      </Drawer>
    </Box>
  );
}
