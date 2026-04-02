'use client';

/**
 * menubar-mantine-T08: Preview header: Help → About (two menubars)
 * 
 * Layout: isolated_card, centered.
 * Two Mantine-styled headers are visible inside the card, each with a label:
 * 1) "Main header"
 * 2) "Preview header"   ← target instance
 * Each header has a Help dropdown implemented with Mantine Menu.
 * - Preview header Help items: Documentation, About (target), Keyboard shortcuts.
 * - Main header Help items: Documentation, Release notes, Contact support.
 * - Initial state: both dropdowns closed.
 * - No other page controls; only the correct header instance matters.
 * 
 * Success: In the menubar labeled "Preview header", the selected path is Help → About.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button, Stack } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [mainSelectedPath, setMainSelectedPath] = useState<string[]>([]);
  const [previewSelectedPath, setPreviewSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      previewSelectedPath.length === 2 &&
      previewSelectedPath[0] === 'Help' &&
      previewSelectedPath[1] === 'About' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [previewSelectedPath, successTriggered, onSuccess]);

  const renderMenubar = (
    label: string,
    helpItems: string[],
    setSelectedPath: React.Dispatch<React.SetStateAction<string[]>>,
    testId: string
  ) => (
    <div>
      <Text size="sm" fw={600} mb="xs">{label}</Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid={testId}>
          <UnstyledButton
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              borderBottom: '2px solid var(--mantine-color-blue-6)',
              color: 'var(--mantine-color-blue-6)',
            }}
          >
            Home
          </UnstyledButton>
          <UnstyledButton style={{ padding: '8px 16px', borderRadius: 4 }}>
            Projects
          </UnstyledButton>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
                data-testid={`${testId}-help`}
              >
                Help
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid={`${testId}-help-dropdown`}>
              {helpItems.map((item) => (
                <Menu.Item
                  key={item}
                  onClick={() => setSelectedPath(['Help', item])}
                  data-testid={`${testId}-item-${item.toLowerCase().replace(/ /g, '-')}`}
                >
                  {item}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>
    </div>
  );

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 550 }}>
      <Text size="xs" c="dimmed" mb="md" fw={500}>
        Two headers: Main header and Preview header. Use Preview header → Help → About.
      </Text>
      
      <Stack gap="lg">
        {renderMenubar(
          'Main header',
          ['Documentation', 'Release notes', 'Contact support'],
          setMainSelectedPath,
          'menubar-main'
        )}
        {renderMenubar(
          'Preview header',
          ['Documentation', 'About', 'Keyboard shortcuts'],
          setPreviewSelectedPath,
          'menubar-preview'
        )}
      </Stack>
    </Paper>
  );
}
