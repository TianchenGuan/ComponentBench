'use client';

/**
 * dialog_modal-mantine-v2-T02: Open fox avatar dialog (Profile badge), backdrop-dismiss
 */

import React, { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  Modal,
  Slider,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import '@mantine/core/styles.css';
import type { ModalState, TaskComponentProps } from '../../types';

const AV = { cat: '🐱', fox: '🦊', dog: '🐕' };

function patch(p: Partial<ModalState>) {
  const prev = window.__cbModalState;
  window.__cbModalState = {
    open: p.open ?? prev?.open ?? false,
    close_reason: p.close_reason ?? prev?.close_reason ?? null,
    modal_instance: p.modal_instance ?? p.last_opened_instance ?? prev?.modal_instance ?? null,
    last_opened_instance: p.last_opened_instance ?? p.modal_instance ?? prev?.last_opened_instance ?? null,
    related_instances: p.related_instances ?? prev?.related_instances,
  };
}

type Which = 'chat' | 'profile' | 'notify' | null;

const TITLE: Record<Exclude<Which, null>, string> = {
  chat: 'Chat theme',
  profile: 'Profile badge',
  notify: 'Notification style',
};

export default function T02({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState<Which>(null);
  const intentRef = useRef<'backdrop' | null>(null);
  const successRef = useRef(false);

  const overlayProps = {
    onPointerDownCapture: () => {
      if (open) intentRef.current = 'backdrop';
    },
  };

  const openModal = (w: Exclude<Which, null>) => {
    setOpen(w);
    patch({
      open: true,
      close_reason: null,
      modal_instance: TITLE[w],
      last_opened_instance: TITLE[w],
    });
  };

  const handleClose = () => {
    const t = open ? TITLE[open] : null;
    const reason = intentRef.current === 'backdrop' ? 'backdrop_click' : 'close_button';
    intentRef.current = null;
    setOpen(null);
    patch({
      open: false,
      close_reason: reason,
      modal_instance: t,
      last_opened_instance: t,
    });
    if (
      reason === 'backdrop_click' &&
      t === 'Profile badge' &&
      !successRef.current
    ) {
      successRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <Box style={{ display: 'flex', width: 650 }}>
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 150, marginRight: 16 }}>
        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            General
          </Text>
          <Text size="sm" c="dimmed">
            Account
          </Text>
          <Text size="sm" fw={500}>
            Personalization
          </Text>
          <Text size="sm" c="dimmed">
            Privacy
          </Text>
        </Stack>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
        <Card withBorder padding="sm" mb="md">
          <Group gap="sm">
            <Text size="sm" fw={500}>
              Reference cue:
            </Text>
            <Avatar size="sm" data-avatar="fox">
              {AV.fox}
            </Avatar>
          </Group>
        </Card>
        <Stack gap="xs" mb="md">
          <Group justify="space-between">
            <Text size="sm">High contrast</Text>
            <Switch disabled size="sm" />
          </Group>
          <Text size="sm" c="dimmed">
            Density
          </Text>
          <Slider disabled defaultValue={40} size="xs" />
        </Stack>
        <Stack gap="sm">
          <Group justify="space-between" p="xs" style={{ borderRadius: 4, background: 'var(--mantine-color-body)' }}>
            <Group gap="sm">
              <Avatar size="sm" data-avatar="cat">
                {AV.cat}
              </Avatar>
              <Text size="sm">Chat theme</Text>
            </Group>
            <Button size="xs" variant="light" onClick={() => openModal('chat')} data-testid="cb-open-chat">
              Open
            </Button>
          </Group>
          <Group justify="space-between" p="xs" style={{ borderRadius: 4, background: 'var(--mantine-color-body)' }}>
            <Group gap="sm">
              <Avatar size="sm" data-avatar="fox">
                {AV.fox}
              </Avatar>
              <Text size="sm">Profile badge</Text>
            </Group>
            <Button size="xs" variant="light" onClick={() => openModal('profile')} data-testid="cb-open-profile">
              Open
            </Button>
          </Group>
          <Group justify="space-between" p="xs" style={{ borderRadius: 4, background: 'var(--mantine-color-body)' }}>
            <Group gap="sm">
              <Avatar size="sm" data-avatar="dog">
                {AV.dog}
              </Avatar>
              <Text size="sm">Notification style</Text>
            </Group>
            <Button size="xs" variant="light" onClick={() => openModal('notify')} data-testid="cb-open-notify">
              Open
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={open === 'chat'}
        onClose={handleClose}
        title={
          <Group gap="sm">
            <Avatar size="sm">{AV.cat}</Avatar>
            <Text>Chat theme</Text>
          </Group>
        }
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-chat-theme"
      >
        <Text size="sm">Customize chat colors and bubble style.</Text>
      </Modal>
      <Modal
        opened={open === 'profile'}
        onClose={handleClose}
        title={
          <Group gap="sm">
            <Avatar size="sm">{AV.fox}</Avatar>
            <Text>Profile badge</Text>
          </Group>
        }
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-profile-badge"
      >
        <Text size="sm">Pick a badge shown next to your name.</Text>
      </Modal>
      <Modal
        opened={open === 'notify'}
        onClose={handleClose}
        title={
          <Group gap="sm">
            <Avatar size="sm">{AV.dog}</Avatar>
            <Text>Notification style</Text>
          </Group>
        }
        centered
        closeOnClickOutside
        closeOnEscape={false}
        overlayProps={overlayProps}
        data-testid="modal-notification-style"
      >
        <Text size="sm">Tune notification banners and sounds.</Text>
      </Modal>
    </Box>
  );
}
