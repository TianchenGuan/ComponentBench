'use client';

/**
 * menubar-mantine-T09: Editor header: enable Show line numbers and Save (3 instances)
 * 
 * Layout: drawer_flow.
 * The page simulates an editor opened in a side drawer. Three separate header/menubar instances exist, each with a label:
 * 1) Main header (top of page)
 * 2) Editor header (top of the drawer)   ← target instance
 * 3) Preview header (inside a preview panel)
 * Each header has a dropdown labeled "View settings" implemented with Mantine Menu, but the contents differ.
 * - Editor header View settings dropdown contains:
 *     • Show line numbers (initially OFF)  ← target
 *     • Wrap lines (initially ON)
 *     • Highlight active line (initially OFF)
 *   and action buttons at the bottom: "Save" and "Cancel".
 * Behavior:
 * - Toggling options changes pending state; only "Save" commits the changes for that header.
 * - "Cancel" discards pending changes.
 * Initial state: committed Show line numbers = OFF in Editor header; dropdown closed.
 * There are no additional interactive controls outside the menubars (clutter=none).
 * 
 * Success: In the menubar labeled "Editor header", the committed toggle state "Show line numbers" is ON (after Save).
 */

import React, { useState, useEffect } from 'react';
import { Paper, Group, UnstyledButton, Text, Menu, Button, Stack, Checkbox, Divider, Box } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleStates {
  'Show line numbers': boolean;
  'Wrap lines': boolean;
  'Highlight active line': boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  // Editor header states (the target)
  const [editorCommitted, setEditorCommitted] = useState<ToggleStates>({
    'Show line numbers': false,
    'Wrap lines': true,
    'Highlight active line': false,
  });
  const [editorPending, setEditorPending] = useState<ToggleStates>({
    'Show line numbers': false,
    'Wrap lines': true,
    'Highlight active line': false,
  });
  const [editorMenuOpen, setEditorMenuOpen] = useState(false);
  
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (editorCommitted['Show line numbers'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [editorCommitted, successTriggered, onSuccess]);

  const handleEditorToggle = (key: keyof ToggleStates) => {
    setEditorPending((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditorSave = () => {
    setEditorCommitted({ ...editorPending });
    setEditorMenuOpen(false);
  };

  const handleEditorCancel = () => {
    setEditorPending({ ...editorCommitted });
    setEditorMenuOpen(false);
  };

  const renderSimpleHeader = (label: string, testId: string) => (
    <div>
      <Text size="sm" fw={600} mb="xs">{label}</Text>
      <Paper withBorder p="xs" radius="sm" bg="gray.0">
        <Group gap="xs" data-testid={testId}>
          <UnstyledButton style={{ padding: '8px 16px', borderRadius: 4 }}>Home</UnstyledButton>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="subtle" rightSection={<IconChevronDown size={16} />}>
                View settings
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Option A</Menu.Item>
              <Menu.Item>Option B</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Paper>
    </div>
  );

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 600 }}>
      <Text size="xs" c="dimmed" mb="md" fw={500}>
        Headers: Main header, Editor header, Preview header. Use Editor header → View settings → Show line numbers → Save.
      </Text>
      
      <Stack gap="lg">
        {/* Main header */}
        {renderSimpleHeader('Main header', 'menubar-main')}

        {/* Editor header - the target */}
        <div>
          <Text size="sm" fw={600} mb="xs">Editor header</Text>
          <Paper withBorder p="xs" radius="sm" bg="gray.0">
            <Group gap="xs" data-testid="menubar-editor">
              <UnstyledButton style={{ padding: '8px 16px', borderRadius: 4 }}>Home</UnstyledButton>
              <Menu 
                shadow="md" 
                width={250}
                opened={editorMenuOpen}
                onChange={(opened) => {
                  setEditorMenuOpen(opened);
                  if (opened) {
                    // Reset pending to committed when opening
                    setEditorPending({ ...editorCommitted });
                  }
                }}
              >
                <Menu.Target>
                  <Button
                    variant="subtle"
                    rightSection={<IconChevronDown size={16} />}
                    data-testid="menubar-editor-view-settings"
                  >
                    View settings
                  </Button>
                </Menu.Target>
                <Menu.Dropdown data-testid="menu-editor-view-settings">
                  <Box p="sm">
                    {(Object.keys(editorPending) as Array<keyof ToggleStates>).map((key) => (
                      <Checkbox
                        key={key}
                        label={key}
                        checked={editorPending[key]}
                        onChange={() => handleEditorToggle(key)}
                        mb="xs"
                        data-testid={`toggle-${key.toLowerCase().replace(/ /g, '-')}`}
                      />
                    ))}
                  </Box>
                  <Divider />
                  <Group p="xs" justify="flex-end" gap="xs">
                    <Button size="xs" variant="subtle" onClick={handleEditorCancel} data-testid="btn-cancel">
                      Cancel
                    </Button>
                    <Button size="xs" onClick={handleEditorSave} data-testid="btn-save">
                      Save
                    </Button>
                  </Group>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Paper>
        </div>

        {/* Preview header */}
        {renderSimpleHeader('Preview header', 'menubar-preview')}
      </Stack>
    </Paper>
  );
}
