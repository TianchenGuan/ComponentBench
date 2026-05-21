'use client';

/**
 * hover_card-mantine-T10: Reset a pinned HoverCard in a cluttered dashboard
 *
 * Layout: dashboard card placed near the bottom-left of the viewport. Light theme, comfortable spacing.
 *
 * The dashboard widget shows two contact chips:
 * - "Primary contact"
 * - "Billing contact"
 *
 * Each chip has its own Mantine HoverCard (two instances). The page starts with:
 * - The "Billing contact" HoverCard dropdown already open and pinned (pinned=true).
 * - The dropdown header includes a pin icon (toggles to unpinned) and a close "×" button.
 *
 * Clutter: medium — the widget also contains unrelated buttons ("Export", "Refresh") and a small legend, but they do not affect success.
 * Goal requires returning the hover card state to closed + unpinned.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Badge, Group, Stack, Popover, ActionIcon, Avatar, Button } from '@mantine/core';
import { IconPin, IconPinFilled, IconX, IconDownload, IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const contacts = [
  { role: 'Primary contact', name: 'John Smith', email: 'john@company.com', initials: 'JS', color: 'blue' as const },
  { role: 'Billing contact', name: 'Emma Davis', email: 'emma@company.com', initials: 'ED', color: 'grape' as const },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [openedContact, setOpenedContact] = useState<string | null>('Billing contact');
  const [pinnedContact, setPinnedContact] = useState<string | null>('Billing contact');
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openedContact === null && pinnedContact === null && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openedContact, pinnedContact, onSuccess]);

  const handleUnpin = (role: string) => {
    if (pinnedContact === role) {
      setPinnedContact(null);
    }
  };

  const handleClose = () => {
    setPinnedContact(null);
    setOpenedContact(null);
  };

  const handleMouseEnter = (role: string) => {
    setOpenedContact(role);
  };

  const handleMouseLeave = (role: string) => {
    if (pinnedContact !== role) {
      setOpenedContact(null);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      {/* Header with clutter */}
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Contacts</Text>
        <Group gap="xs">
          <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}>
            Export
          </Button>
          <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />}>
            Refresh
          </Button>
        </Group>
      </Group>

      {/* Legend (clutter) */}
      <Text size="xs" c="dimmed" mb="md">
        Hover over a contact to view details. Pin to keep open.
      </Text>

      {/* Contact chips */}
      <Group gap="sm">
        {contacts.map((contact) => (
          <Popover 
            key={contact.role}
            width={240} 
            shadow="md"
            opened={openedContact === contact.role}
            onChange={(isOpen: boolean) => {
              if (pinnedContact !== contact.role) {
                setOpenedContact(isOpen ? contact.role : null);
              } else if (isOpen) {
                setOpenedContact(contact.role);
              }
            }}
          >
            <Popover.Target>
              <Badge 
                size="md"
                variant="light"
                color={contact.color}
                style={{ cursor: 'pointer' }}
                data-testid={`${contact.role.toLowerCase().replace(' ', '-')}-trigger`}
                data-cb-instance={contact.role}
                onMouseEnter={() => handleMouseEnter(contact.role)}
                onMouseLeave={() => handleMouseLeave(contact.role)}
              >
                {contact.role}
              </Badge>
            </Popover.Target>
            <Popover.Dropdown onMouseEnter={() => handleMouseEnter(contact.role)} onMouseLeave={() => handleMouseLeave(contact.role)} 
              data-testid={`hover-card-${contact.role.toLowerCase().replace(' ', '-')}`}
              data-cb-instance={contact.role}
              data-pinned={pinnedContact === contact.role}
              data-open={openedContact === contact.role}
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600}>{contact.role}</Text>
                <Group gap={2}>
                  <ActionIcon 
                    variant="subtle" 
                    size="sm"
                    onClick={() => handleUnpin(contact.role)}
                    data-testid={`pin-button-${contact.role.toLowerCase().replace(' ', '-')}`}
                    aria-label={pinnedContact === contact.role ? "Unpin" : "Pin"}
                  >
                    {pinnedContact === contact.role ? <IconPinFilled size={14} /> : <IconPin size={14} />}
                  </ActionIcon>
                  <ActionIcon 
                    variant="subtle" 
                    size="sm"
                    onClick={() => handleClose()}
                    data-testid={`close-button-${contact.role.toLowerCase().replace(' ', '-')}`}
                    aria-label="Close"
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </Group>
              </Group>
              <Group gap="sm">
                <Avatar size="sm" radius="xl" color={contact.color}>
                  {contact.initials}
                </Avatar>
                <Stack gap={2}>
                  <Text size="xs" fw={500}>{contact.name}</Text>
                  <Text size="xs" c="dimmed">{contact.email}</Text>
                </Stack>
              </Group>
            </Popover.Dropdown>
          </Popover>
        ))}
      </Group>
    </Card>
  );
}
