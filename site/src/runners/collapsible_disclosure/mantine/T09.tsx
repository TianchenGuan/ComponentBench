'use client';

/**
 * collapsible_disclosure-mantine-T09: Bottom-left placement + mixed guidance: expand the correct Team section
 * 
 * The accordion card is positioned near the bottom-left of the viewport.
 * 
 * - Layout: isolated_card, placement: bottom_left.
 * - At the top of the card: a "Target preview" row that shows the exact header style (icon + full label).
 * - Below: one Mantine Accordion with several similarly prefixed items:
 *   - "Team access"
 *   - "Team members"
 *   - "Team roles"
 *   - "Team invitations"
 * - Initial state: all items collapsed.
 * - Guidance is mixed:
 *   - Text hint: the correct item starts with "Team…"
 *   - Visual hint: choose the one that matches the Target preview exactly.
 * 
 * Success: Exactly one Team item expanded, matching the Target preview
 */

import React, { useState, useEffect, useRef } from 'react';
import { Accordion, Card, Text, Box, Group } from '@mantine/core';
import { IconUsers, IconUsersGroup, IconUserShield, IconUserPlus } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Target is "Team roles" with IconUserShield
const TARGET_KEY = 'team_roles';

const ACCORDION_ITEMS = [
  { key: 'team_access', icon: IconUsers, label: 'Team access', content: 'Manage team access permissions.' },
  { key: 'team_members', icon: IconUsersGroup, label: 'Team members', content: 'View and manage team members.' },
  { key: 'team_roles', icon: IconUserShield, label: 'Team roles', content: 'Define and assign team roles.' },
  { key: 'team_invitations', icon: IconUserPlus, label: 'Team invitations', content: 'Send and manage team invitations.' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when only the target is expanded
    if (value === TARGET_KEY && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Team settings</Text>
      
      {/* Target preview */}
      <Box 
        data-testid="team-target-preview"
        style={{
          padding: '12px 16px',
          background: '#f1f3f5',
          borderRadius: 8,
          marginBottom: 16,
          border: '2px dashed #228be6',
        }}
      >
        <Text size="sm" c="dimmed" mb={8}>
          Target preview:
        </Text>
        <Group gap="xs">
          <IconUserShield size={18} />
          <Text size="sm" fw={500}>Team roles</Text>
        </Group>
      </Box>
      
      <Accordion value={value} onChange={setValue} data-testid="accordion-root">
        {ACCORDION_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <Accordion.Item key={item.key} value={item.key}>
              <Accordion.Control>
                <Group gap="xs">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {item.content}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </Card>
  );
}
