'use client';

/**
 * icon_button-mantine-T03: Expand FAQ answer (chevron ActionIcon)
 *
 * Layout: isolated_card centered in the viewport.
 * A single FAQ card shows one question with a chevron ActionIcon.
 * 
 * Success: The FAQ disclosure ActionIcon has aria-expanded="true".
 */

import React, { useState } from 'react';
import { Card, Text, ActionIcon, Group, Box, Badge, Collapse } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <Text fw={500}>FAQ: &quot;How do I reset my password?&quot;</Text>
          <Badge color={expanded ? 'green' : 'gray'} size="sm">
            {expanded ? 'Expanded' : 'Collapsed'}
          </Badge>
        </Group>
        <ActionIcon
          variant="subtle"
          onClick={handleToggle}
          aria-label="Expand FAQ answer"
          aria-expanded={expanded}
          data-testid="mantine-action-icon-expand"
        >
          {expanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
        </ActionIcon>
      </Group>
      <Collapse in={expanded}>
        <Box p="md" style={{ background: 'var(--mantine-color-gray-0)', borderRadius: 4 }}>
          <Text size="sm">
            To reset your password, click on the &quot;Forgot Password&quot; link on the login page. 
            You&apos;ll receive an email with instructions to create a new password. 
            Make sure to check your spam folder if you don&apos;t see it within a few minutes.
          </Text>
        </Box>
      </Collapse>
    </Card>
  );
}
