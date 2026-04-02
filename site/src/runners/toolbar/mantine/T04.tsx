'use client';

/**
 * toolbar-mantine-T04: Open menu and choose Duplicate
 *
 * The page is a form_section titled "Edit post" with a few disabled inputs (Title, Slug) 
 * and helper text (clutter=low). At the top-left of the section is a toolbar labeled 
 * "Post actions" implemented with a Mantine Group.
 * Toolbar buttons: "Publish", "Preview", and a "More" control implemented as a Mantine Menu.
 * The Menu dropdown contains: Duplicate, Archive, Move to folder, Delete.
 */

import React, { useState } from 'react';
import { Paper, Group, Button, Menu, TextInput, Text, Title } from '@mantine/core';
import {
  IconSend,
  IconEye,
  IconDotsVertical,
  IconCopy,
  IconArchive,
  IconFolderPlus,
  IconTrash,
  IconHelp,
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: string) => {
    setLastAction(action);
    if (action.toLowerCase() === 'duplicate') {
      onSuccess();
    }
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 450 }}>
      <Group justify="space-between" mb="md">
        <Title order={5}>Edit post</Title>

        <Group gap="xs" data-testid="mantine-toolbar-post-actions">
          <Button
            leftSection={<IconSend size={16} />}
            variant="default"
            size="sm"
            onClick={() => handleAction('Publish')}
          >
            Publish
          </Button>
          <Button
            leftSection={<IconEye size={16} />}
            variant="default"
            size="sm"
            onClick={() => handleAction('Preview')}
          >
            Preview
          </Button>
          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <Button
                variant="default"
                size="sm"
                rightSection={<IconDotsVertical size={16} />}
                data-testid="mantine-toolbar-post-actions-more"
              >
                More
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconCopy size={14} />}
                onClick={() => handleAction('Duplicate')}
                data-testid="mantine-menu-duplicate"
              >
                Duplicate
              </Menu.Item>
              <Menu.Item
                leftSection={<IconArchive size={14} />}
                onClick={() => handleAction('Archive')}
              >
                Archive
              </Menu.Item>
              <Menu.Item
                leftSection={<IconFolderPlus size={14} />}
                onClick={() => handleAction('Move to folder')}
              >
                Move to folder
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => handleAction('Delete')}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <TextInput label="Title" value="My First Post" disabled mb="sm" />
      <TextInput label="Slug" value="my-first-post" disabled mb="md" />

      <Text size="sm" c="dimmed" mb="lg">
        Last action: {lastAction}
      </Text>

      {/* Distractor menu */}
      <div style={{ paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
        <Menu>
          <Menu.Target>
            <Button variant="subtle" size="xs" leftSection={<IconHelp size={14} />}>
              Help
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>Documentation</Menu.Item>
            <Menu.Item>Contact support</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </Paper>
  );
}
