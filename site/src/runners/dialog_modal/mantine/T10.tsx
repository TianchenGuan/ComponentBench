'use client';

/**
 * dialog_modal-mantine-T10: Match a reference avatar to open the correct dialog
 *
 * Layout: settings_panel with HIGH clutter. The page resembles a "Personalization" settings screen.
 *
 * At the top there is a "Reference avatar" block showing a fox avatar.
 *
 * There are three rows each with a button "Customize" that opens a Mantine Modal:
 * 1) Row "Chat theme" (cat avatar) → Modal title "Chat theme" with cat avatar
 * 2) Row "Profile badge" (fox avatar) → Modal title "Profile badge" with fox avatar
 * 3) Row "Notification style" (dog avatar) → Modal title "Notification style" with dog avatar
 *
 * Initial state: all modals closed.
 * Success: The modal with fox avatar header (title 'Profile badge') is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Text, Modal, Group, Stack, Avatar, Box, Switch, Slider } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Avatar emojis for visual distinction
const AVATARS = {
  cat: '🐱',
  fox: '🦊',
  dog: '🐕',
};

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [chatThemeOpen, setChatThemeOpen] = useState(false);
  const [profileBadgeOpen, setProfileBadgeOpen] = useState(false);
  const [notificationStyleOpen, setNotificationStyleOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenChatTheme = () => {
    setChatThemeOpen(true);
    setProfileBadgeOpen(false);
    setNotificationStyleOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Chat theme',
    };
  };

  const handleOpenProfileBadge = () => {
    setProfileBadgeOpen(true);
    setChatThemeOpen(false);
    setNotificationStyleOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Profile badge',
    };
    
    // Success when Profile badge (fox) modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleOpenNotificationStyle = () => {
    setNotificationStyleOpen(true);
    setChatThemeOpen(false);
    setProfileBadgeOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Notification style',
    };
  };

  const handleClose = (modal: string) => {
    if (modal === 'chat') setChatThemeOpen(false);
    if (modal === 'profile') setProfileBadgeOpen(false);
    if (modal === 'notification') setNotificationStyleOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'close_button',
      modal_instance: modal,
    };
  };

  return (
    <>
      <Box style={{ display: 'flex', width: 650 }}>
        {/* Left nav (non-interactive) */}
        <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 150, marginRight: 16 }}>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">General</Text>
            <Text size="sm" c="dimmed">Account</Text>
            <Text size="sm" fw={500}>Personalization</Text>
            <Text size="sm" c="dimmed">Privacy</Text>
            <Text size="sm" c="dimmed">Notifications</Text>
          </Stack>
        </Card>

        {/* Main content */}
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
          {/* Reference avatar */}
          <Card withBorder padding="sm" mb="md">
            <Group gap="sm">
              <Text size="sm" fw={500}>Target avatar:</Text>
              <Avatar size="sm" data-avatar="fox">{AVATARS.fox}</Avatar>
            </Group>
          </Card>

          {/* Clutter: toggles and sliders */}
          <Stack gap="xs" mb="md">
            <Group justify="space-between">
              <Text size="sm">Dark mode</Text>
              <Switch disabled size="sm" />
            </Group>
            <Group justify="space-between">
              <Text size="sm">Reduce motion</Text>
              <Switch disabled size="sm" />
            </Group>
            <Text size="sm" c="dimmed">Font size</Text>
            <Slider disabled defaultValue={50} size="xs" />
          </Stack>

          {/* Modal trigger rows */}
          <Stack gap="sm">
            <Group justify="space-between" p="xs" style={{ background: '#f8f9fa', borderRadius: 4 }}>
              <Group gap="sm">
                <Avatar size="sm" data-avatar="cat">{AVATARS.cat}</Avatar>
                <Text size="sm">Chat theme</Text>
              </Group>
              <Button size="xs" variant="light" onClick={handleOpenChatTheme} data-testid="cb-customize-chat">
                Customize
              </Button>
            </Group>

            <Group justify="space-between" p="xs" style={{ background: '#f8f9fa', borderRadius: 4 }}>
              <Group gap="sm">
                <Avatar size="sm" data-avatar="fox">{AVATARS.fox}</Avatar>
                <Text size="sm">Profile badge</Text>
              </Group>
              <Button size="xs" variant="light" onClick={handleOpenProfileBadge} data-testid="cb-customize-profile">
                Customize
              </Button>
            </Group>

            <Group justify="space-between" p="xs" style={{ background: '#f8f9fa', borderRadius: 4 }}>
              <Group gap="sm">
                <Avatar size="sm" data-avatar="dog">{AVATARS.dog}</Avatar>
                <Text size="sm">Notification style</Text>
              </Group>
              <Button size="xs" variant="light" onClick={handleOpenNotificationStyle} data-testid="cb-customize-notification">
                Customize
              </Button>
            </Group>
          </Stack>
        </Card>
      </Box>

      {/* Chat Theme Modal - Cat */}
      <Modal
        opened={chatThemeOpen}
        onClose={() => handleClose('chat')}
        title={
          <Group gap="sm">
            <Avatar size="sm" data-avatar="cat">{AVATARS.cat}</Avatar>
            <Text>Chat theme</Text>
          </Group>
        }
        centered
        data-testid="modal-chat-theme"
        data-avatar="cat"
      >
        <Text size="sm">Customize your chat appearance and colors.</Text>
      </Modal>

      {/* Profile Badge Modal - Fox */}
      <Modal
        opened={profileBadgeOpen}
        onClose={() => handleClose('profile')}
        title={
          <Group gap="sm">
            <Avatar size="sm" data-avatar="fox">{AVATARS.fox}</Avatar>
            <Text>Profile badge</Text>
          </Group>
        }
        centered
        data-testid="modal-profile-badge"
        data-avatar="fox"
      >
        <Text size="sm">Choose and customize your profile badge.</Text>
      </Modal>

      {/* Notification Style Modal - Dog */}
      <Modal
        opened={notificationStyleOpen}
        onClose={() => handleClose('notification')}
        title={
          <Group gap="sm">
            <Avatar size="sm" data-avatar="dog">{AVATARS.dog}</Avatar>
            <Text>Notification style</Text>
          </Group>
        }
        centered
        data-testid="modal-notification-style"
        data-avatar="dog"
      >
        <Text size="sm">Configure notification appearance and sounds.</Text>
      </Modal>
    </>
  );
}
