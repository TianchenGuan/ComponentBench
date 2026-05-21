'use client';

/**
 * menu-mantine-T09: Select an exact set of tags in a multi-select menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=form_section, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A Mantine Menu triggered by a button labeled "Project tags".
 * - The dropdown shows a checkbox-style list where multiple tags can be selected.
 *
 * Tags (with some confusable distractors):
 * - Billing (unchecked initially)
 * - Security (unchecked initially)
 * - Integrations (checked initially) ← already selected
 * - Integration tests (unchecked) ← distractor
 * - Analytics (unchecked)
 * - Payments (unchecked)
 * - Support (unchecked)
 * - Notifications (unchecked)
 * - Audit (unchecked)
 *
 * Initial state:
 * - Integrations is checked; others are unchecked.
 *
 * Goal:
 * - Exactly {Billing, Security, Integrations} are selected.
 *
 * Success: The selected tag set is exactly {Billing, Security, Integrations}.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Button, Paper, Text, TextInput, Box, Group, Badge } from '@mantine/core';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const tagOptions = [
  'Billing',
  'Security',
  'Integrations',
  'Integration tests',
  'Analytics',
  'Payments',
  'Support',
  'Notifications',
  'Audit',
];

const targetSet = new Set(['Billing', 'Security', 'Integrations']);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(['Integrations']));
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    const isEqual =
      selectedTags.size === targetSet.size &&
      Array.from(targetSet).every((item) => selectedTags.has(item));

    if (isEqual && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedTags, successTriggered, onSuccess]);

  const handleToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 450 }}>
      <Text size="lg" fw={500} mb="md">Project settings</Text>

      {/* Form section clutter */}
      <Box mb="md">
        <TextInput label="Project name" value="Main Application" disabled mb="xs" />
        <TextInput label="Environment" value="Production" disabled />
      </Box>

      <Text size="xs" c="dimmed" fw={500} mb="xs">Project tags</Text>
      
      <Menu shadow="md" width={200} closeOnItemClick={false}>
        <Menu.Target>
          <Button
            variant="outline"
            rightSection={<IconChevronDown size={16} />}
            data-testid="menu-button-project-tags"
          >
            Project tags
          </Button>
        </Menu.Target>

        <Menu.Dropdown data-testid="menu-project-tags">
          {tagOptions.map((tag) => (
            <Menu.Item
              key={tag}
              leftSection={selectedTags.has(tag) ? <IconCheck size={14} color="green" /> : <span style={{ width: 14 }} />}
              onClick={() => handleToggle(tag)}
              data-testid={`menu-item-${tag.toLowerCase().replace(/ /g, '-')}`}
              data-checked={selectedTags.has(tag)}
            >
              {tag}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      {/* Selected tags as pills */}
      <Group gap="xs" mt="md">
        {Array.from(selectedTags).map((tag) => (
          <Badge key={tag} variant="light" data-testid={`badge-${tag.toLowerCase().replace(/ /g, '-')}`}>
            {tag}
          </Badge>
        ))}
      </Group>

      <Text size="sm" c="dimmed" mt="md" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        Selected tags: <strong data-testid="selected-tags">{Array.from(selectedTags).sort().join(', ') || 'None'}</strong>
      </Text>
    </Paper>
  );
}
