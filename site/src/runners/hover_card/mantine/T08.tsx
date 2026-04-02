'use client';

/**
 * hover_card-mantine-T08: Open HoverCard inside a drawer flow
 *
 * Layout: drawer_flow. Light theme, comfortable spacing, default scale.
 *
 * The page has a primary button labeled "Open Team Drawer".
 * - Clicking it opens a right-side Drawer containing a list of two team members:
 *   * "Alex Nguyen"
 *   * "Samira Khan"
 * - Each team member name is wrapped with a Mantine HoverCard (two instances).
 * - Hovering a name opens a dropdown card with role, timezone, and quick links.
 *
 * Initial state: Drawer closed; no hover cards visible.
 * Clutter: medium (drawer contains additional static text like "Invite member", but it is not required for success).
 *
 * Note on layering: hover card dropdown renders above the drawer content via Portal.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Drawer, Stack, HoverCard, Group, Avatar, Badge } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const teamMembers = [
  { name: 'Alex Nguyen', role: 'Engineer', timezone: 'PST (UTC-8)', initials: 'AN', color: 'blue' },
  { name: 'Samira Khan', role: 'Designer', timezone: 'EST (UTC-5)', initials: 'SK', color: 'pink' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [activeMember, setActiveMember] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeMember === 'Alex Nguyen' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeMember, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Team Management</Text>
        <Button onClick={() => setDrawerOpened(true)} data-testid="open-drawer-button">
          Open Team Drawer
        </Button>
      </Card>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Team Members"
        position="right"
        size="sm"
      >
        <Stack gap="md">
          {teamMembers.map((member) => (
            <HoverCard 
              key={member.name}
              width={260} 
              shadow="md"
              position="left"
              onOpen={() => setActiveMember(member.name)}
              onClose={() => setActiveMember(null)}
            >
              <HoverCard.Target>
                <Group 
                  style={{ cursor: 'pointer', padding: 8, borderRadius: 4 }}
                  data-testid={`member-${member.name.toLowerCase().replace(' ', '-')}`}
                  data-cb-instance={`Team member: ${member.name}`}
                >
                  <Avatar size="md" radius="xl" color={member.color}>
                    {member.initials}
                  </Avatar>
                  <div>
                    <Text size="sm" fw={500} c="blue">{member.name}</Text>
                    <Text size="xs" c="dimmed">{member.role}</Text>
                  </div>
                </Group>
              </HoverCard.Target>
              <HoverCard.Dropdown 
                data-testid={`hover-card-${member.name.toLowerCase().replace(' ', '-')}`}
                data-cb-instance={`Team member: ${member.name}`}
              >
                <Group mb="sm">
                  <Avatar size="lg" radius="xl" color={member.color}>
                    {member.initials}
                  </Avatar>
                  <Stack gap={2}>
                    <Text size="sm" fw={600}>{member.name}</Text>
                    <Badge size="xs" variant="light">{member.role}</Badge>
                  </Stack>
                </Group>
                <Text size="xs" c="dimmed" mb="xs">
                  Timezone: {member.timezone}
                </Text>
                <Group gap="xs">
                  <Button size="xs" variant="light">Message</Button>
                  <Button size="xs" variant="light">View Profile</Button>
                </Group>
              </HoverCard.Dropdown>
            </HoverCard>
          ))}
          <Button variant="outline" size="sm" mt="md">
            Invite member
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
