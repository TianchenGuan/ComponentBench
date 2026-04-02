'use client';

/**
 * checkbox_tristate-mantine-T08: Dark dashboard: set Workspace visibility to On (Checked)
 *
 * Layout: dashboard in dark theme with multiple cards and a dense header.
 * In the "Visibility" dashboard card there are three Mantine tri-state checkboxes displayed as rows:
 * - "Project visibility"
 * - "Workspace visibility" (target)
 * - "Org visibility"
 *
 * Guidance is mixed:
 * - At the top of the card is a small read-only indicator showing an icon and text
 *   "Desired for Workspace: On" (On corresponds to Checked).
 *
 * Initial states:
 * - Project visibility: Checked
 * - Workspace visibility: Indeterminate
 * - Org visibility: Unchecked
 *
 * Clutter: high. The card also contains a small activity chart and two buttons.
 * 
 * Success: "Workspace visibility" is Checked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Button, Group, Stack, Badge, Progress, TextInput, Avatar, Box } from '@mantine/core';
import { IconSearch, IconUser } from '@tabler/icons-react';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [projectState, setProjectState] = useState<TristateValue>('checked');
  const [workspaceState, setWorkspaceState] = useState<TristateValue>('indeterminate');
  const [orgState, setOrgState] = useState<TristateValue>('unchecked');

  const handleProjectClick = () => {
    setProjectState(cycleTristateValue(projectState));
  };

  const handleWorkspaceClick = () => {
    const newState = cycleTristateValue(workspaceState);
    setWorkspaceState(newState);
    if (newState === 'checked') {
      onSuccess();
    }
  };

  const handleOrgClick = () => {
    setOrgState(cycleTristateValue(orgState));
  };

  return (
    <Box style={{ width: 550 }}>
      {/* Dashboard header */}
      <Group justify="space-between" mb="md" pb="sm" style={{ borderBottom: '1px solid #444' }}>
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={14} />}
          size="sm"
          style={{ width: 200 }}
        />
        <Group gap="sm">
          <Button size="xs" variant="default">Actions</Button>
          <Avatar size="sm"><IconUser size={14} /></Avatar>
        </Group>
      </Group>

      {/* Visibility card */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={500}>Visibility</Text>
          <Badge variant="light">Desired for Workspace: On</Badge>
        </Group>

        <Stack gap="sm" mb="md">
          <div onClick={handleProjectClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={projectState === 'checked'}
              indeterminate={projectState === 'indeterminate'}
              label="Project visibility"
              data-testid="visibility-project-checkbox"
              readOnly
            />
          </div>
          
          <div onClick={handleWorkspaceClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={workspaceState === 'checked'}
              indeterminate={workspaceState === 'indeterminate'}
              label="Workspace visibility"
              data-testid="visibility-workspace-checkbox"
              readOnly
            />
          </div>
          
          <div onClick={handleOrgClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={orgState === 'checked'}
              indeterminate={orgState === 'indeterminate'}
              label="Org visibility"
              data-testid="visibility-org-checkbox"
              readOnly
            />
          </div>
        </Stack>

        {/* Activity chart placeholder */}
        <Text size="xs" c="dimmed" mb="xs">Recent activity</Text>
        <Progress value={65} size="sm" mb="md" />

        <Group gap="xs">
          <Button size="xs" variant="light">Invite</Button>
          <Button size="xs" variant="default">Manage</Button>
        </Group>
      </Card>
    </Box>
  );
}
