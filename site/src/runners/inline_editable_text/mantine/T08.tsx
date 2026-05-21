'use client';

/**
 * inline_editable_text-mantine-T08: Scroll to find footer line and edit it
 * 
 * The page shows a settings panel with a scrollable list of settings groups (inside a Mantine ScrollArea).
 * Near the top are several distractor rows (toggles, selects, and read-only text).
 * 
 * The target inline editable text row labeled "Footer line" is further down and is not visible
 * at initial load without scrolling.
 * 
 * "Footer line" displays a Text value (initial: "© 2026") with a pencil ActionIcon.
 * 
 * Success: The committed (display) value equals 'Powered by Mantine' exactly, and component is in display mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, ActionIcon, Group, Box, ScrollArea, Switch, Select, Divider } from '@mantine/core';
import { IconPencil, IconCheck, IconX } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('© 2026');
  const [editingValue, setEditingValue] = useState('© 2026');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successCalledRef = useRef(false);

  // Distractor states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [theme, setTheme] = useState<string | null>('light');
  const [timezone, setTimezone] = useState<string | null>('UTC');

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && value === 'Powered by Mantine' && !successCalledRef.current) {
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
    <Card shadow="sm" padding="lg" radius="md" withBorder w={400} data-testid="settings-card">
      <Text fw={600} size="lg" mb="md">Settings</Text>
      
      <ScrollArea h={300} data-testid="settings-scroll-area">
        {/* Distractor settings */}
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Email alerts</Text>
          <Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.currentTarget.checked)} />
        </Box>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Theme</Text>
          <Select
            value={theme}
            onChange={setTheme}
            data={['light', 'dark', 'system']}
            w={200}
          />
        </Box>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Timezone</Text>
          <Select
            value={timezone}
            onChange={setTimezone}
            data={['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']}
            w={200}
          />
        </Box>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Account ID</Text>
          <Text c="dimmed">acct-12345-xyz</Text>
        </Box>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Plan</Text>
          <Text c="dimmed">Professional</Text>
        </Box>
        
        <Divider my="md" />
        
        <Text fw={600} size="md" mb="md">Appearance</Text>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Font size</Text>
          <Select
            value="medium"
            data={['small', 'medium', 'large']}
            w={200}
          />
        </Box>
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Compact mode</Text>
          <Switch />
        </Box>
        
        <Divider my="md" />
        
        <Text fw={600} size="md" mb="md">Branding</Text>
        
        {/* Target: Footer line */}
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Footer line</Text>
          <Box
            data-testid="editable-footer-line"
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
        
        <Box mb="md">
          <Text size="sm" fw={500} mb={8}>Logo URL</Text>
          <Text c="dimmed">https://example.com/logo.png</Text>
        </Box>
      </ScrollArea>
    </Card>
  );
}
