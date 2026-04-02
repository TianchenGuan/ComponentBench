'use client';

/**
 * popover-mantine-T10: Scroll inside drawer and open Email notifications popover
 *
 * Drawer flow layout: a right-side drawer labeled 'Settings' is open on page load.
 * The drawer content is vertically scrollable and contains many settings rows.
 * In the 'Notifications' section below the fold, there is a row labeled 'Email notifications' with an ActionIcon.
 * Popover title: 'Email notifications'; content: one paragraph.
 * Initial state: popover closed; target row not initially visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Popover, ActionIcon, Stack, Switch, Divider, ScrollArea } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  const SettingRow = ({ label, hasPopover = false }: { label: string; hasPopover?: boolean }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text size="sm">{label}</Text>
        {hasPopover && (
          <Popover
            opened={opened}
            onChange={setOpened}
            width={240}
            position="left"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={() => setOpened((o) => !o)}
                data-testid="popover-target-email-notifications"
              >
                <IconInfoCircle size={14} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown data-testid="popover-email-notifications">
              <Text fw={500} size="sm" mb="xs">Email notifications</Text>
              <Text size="xs">
                Receive email updates about your account activity, new features, and important announcements.
              </Text>
            </Popover.Dropdown>
          </Popover>
        )}
      </div>
      <Switch size="sm" />
    </div>
  );

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ width: 380, height: 400 }}
      data-testid="drawer-settings"
    >
      <Text fw={500} size="lg" mb="md">
        Settings
      </Text>
      
      <ScrollArea h={320} type="scroll">
        <Stack gap={0}>
          <Text fw={500} size="sm" mb="xs">General</Text>
          <SettingRow label="Auto-save drafts" />
          <SettingRow label="Show hints" />
          <SettingRow label="Enable animations" />
          
          <Divider my="md" />
          
          <Text fw={500} size="sm" mb="xs">Display</Text>
          <SettingRow label="Dark mode" />
          <SettingRow label="Compact view" />
          <SettingRow label="Show avatars" />
          
          <Divider my="md" />
          
          <Text fw={500} size="sm" mb="xs">Privacy</Text>
          <SettingRow label="Profile visibility" />
          <SettingRow label="Activity status" />
          <SettingRow label="Read receipts" />
          
          <Divider my="md" />
          
          <Text fw={500} size="sm" mb="xs">Notifications</Text>
          <SettingRow label="Push notifications" />
          <SettingRow label="Email notifications" hasPopover />
          <SettingRow label="SMS alerts" />
          <SettingRow label="Weekly digest" />
          
          <Divider my="md" />
          
          <Text fw={500} size="sm" mb="xs">Account</Text>
          <SettingRow label="Two-factor auth" />
          <SettingRow label="Login alerts" />
        </Stack>
      </ScrollArea>
    </Card>
  );
}
