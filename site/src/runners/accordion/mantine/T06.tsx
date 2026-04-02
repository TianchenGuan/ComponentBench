'use client';

/**
 * accordion-mantine-T06: Two accordions: open Permissions in Team settings
 * 
 * Scene is a settings_panel layout with low clutter (a sidebar of headings and a disabled 
 * 'Save' button). The main area contains two Mantine Accordion instances stacked vertically, 
 * each preceded by a bold label:
 * • "Personal settings"
 * • "Team settings"
 * Each accordion has 4 items: "General", "Members", "Permissions", "Audit log".
 * Initial state: in both accordions, "General" is expanded by default.
 * 
 * Success: Team settings accordion has expanded_item_ids exactly: [permissions]
 */

import React, { useState, useEffect } from 'react';
import { Accordion, Card, Text, Box, Button, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [personalValue, setPersonalValue] = useState<string | null>('general');
  const [teamValue, setTeamValue] = useState<string | null>('general');

  useEffect(() => {
    if (teamValue === 'permissions') {
      onSuccess();
    }
  }, [teamValue, onSuccess]);

  const items = [
    { value: 'general', label: 'General' },
    { value: 'members', label: 'Members' },
    { value: 'permissions', label: 'Permissions' },
    { value: 'audit_log', label: 'Audit log' },
  ];

  return (
    <Box style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 900 }}>
      {/* Sidebar (clutter) */}
      <Box style={{ width: 180, flexShrink: 0 }}>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">Dashboard</Text>
          <Text size="sm" c="dimmed">Users</Text>
          <Text size="sm" c="dimmed">Analytics</Text>
          <Text size="sm" c="dimmed">Reports</Text>
        </Stack>
        <Button variant="outline" fullWidth disabled mt="lg">
          Save
        </Button>
      </Box>

      {/* Main content */}
      <Box style={{ flex: 1 }}>
        {/* Personal settings accordion */}
        <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
          <Text fw={600} size="md" mb="md">Personal settings</Text>
          <Accordion 
            value={personalValue} 
            onChange={setPersonalValue} 
            data-testid="accordion-personal"
          >
            {items.map(item => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>{item.label}</Accordion.Control>
                <Accordion.Panel>
                  Personal {item.label.toLowerCase()} settings content.
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>

        {/* Team settings accordion - the target */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={600} size="md" mb="md">Team settings</Text>
          <Accordion 
            value={teamValue} 
            onChange={setTeamValue} 
            data-testid="accordion-team"
          >
            {items.map(item => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.Control>{item.label}</Accordion.Control>
                <Accordion.Panel>
                  Team {item.label.toLowerCase()} settings content.
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>
      </Box>
    </Box>
  );
}
