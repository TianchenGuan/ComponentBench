'use client';

/**
 * drawer-mantine-T10: Open nested Invite members drawer from within Team settings
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * On the card:
 * - A primary Mantine Button labeled "Open Team settings".
 *
 * Drawer flow (nested):
 * 1) Clicking "Open Team settings" opens the first Mantine Drawer titled "Team settings" (position="right").
 *    - Inside it are several read-only setting rows and a button labeled "Invite members".
 * 2) Clicking "Invite members" opens a second Mantine Drawer titled "Invite members" on top of the first drawer.
 *    - The nested drawer has its own overlay layer and its own header close button.
 *
 * Initial state:
 * - Both drawers are CLOSED.
 *
 * Target:
 * - The nested "Invite members" drawer must be OPEN at the end.
 *
 * Feedback:
 * - The topmost drawer's header clearly shows "Invite members" when successful.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack, TextInput, Switch, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [teamSettingsOpened, setTeamSettingsOpened] = useState(false);
  const [inviteOpened, setInviteOpened] = useState(false);
  const successCalledRef = useRef(false);

  // Success when the Invite members drawer is open
  useEffect(() => {
    if (inviteOpened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [inviteOpened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Team Management
      </Text>
      <Button
        onClick={() => setTeamSettingsOpened(true)}
        data-testid="open-team-settings"
      >
        Open Team settings
      </Button>

      {/* First drawer: Team settings */}
      <Drawer
        opened={teamSettingsOpened}
        onClose={() => setTeamSettingsOpened(false)}
        title="Team settings"
        position="right"
        data-testid="drawer-team-settings"
      >
        <Stack gap="md">
          <TextInput label="Team name" defaultValue="Engineering Team" disabled />
          <Group justify="space-between">
            <Text size="sm">Allow external members</Text>
            <Switch defaultChecked={false} disabled />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Require 2FA</Text>
            <Switch defaultChecked={true} disabled />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Public visibility</Text>
            <Switch defaultChecked={false} disabled />
          </Group>

          <Button
            variant="outline"
            mt="md"
            onClick={() => setInviteOpened(true)}
            data-testid="open-invite"
          >
            Invite members
          </Button>
        </Stack>

        {/* Nested drawer: Invite members */}
        <Drawer
          opened={inviteOpened}
          onClose={() => setInviteOpened(false)}
          title="Invite members"
          position="right"
          data-testid="drawer-invite-members"
        >
          <Stack gap="md">
            <TextInput
              label="Email address"
              placeholder="colleague@example.com"
            />
            <Text size="xs" c="dimmed">
              Enter the email address of the person you want to invite to join the team.
            </Text>
            <Button disabled>Send invitation</Button>
          </Stack>
        </Drawer>
      </Drawer>
    </Card>
  );
}
