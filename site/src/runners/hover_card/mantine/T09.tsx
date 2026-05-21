'use client';

/**
 * hover_card-mantine-T09: Pin the Billing contact HoverCard (3 instances, compact)
 *
 * Layout: isolated_card anchored near the top-left of the viewport. Light theme with compact spacing and small scale.
 *
 * The card shows three inline chips in one row:
 * - "Primary contact"
 * - "Billing contact"
 * - "Emergency contact"
 *
 * Each chip is wrapped with its own Mantine HoverCard (three instances) inside a HoverCard.Group that applies a shared openDelay/closeDelay.
 * - Hovering a chip opens a dropdown card with contact details.
 * - The dropdown header includes a small "Pin" control to toggle pinned state for that instance.
 *
 * Initial state: all dropdowns closed and unpinned.
 * Due to compact spacing, chips are closely spaced, increasing mis-hover and wrong-instance risk.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Badge, Group, Stack, Popover, ActionIcon, Avatar } from '@mantine/core';
import { IconPin, IconPinFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const contacts = [
  { role: 'Primary contact', name: 'John Smith', email: 'john@company.com', phone: '+1 555-0101', initials: 'JS', color: 'blue' as const },
  { role: 'Billing contact', name: 'Emma Davis', email: 'emma@company.com', phone: '+1 555-0102', initials: 'ED', color: 'grape' as const },
  { role: 'Emergency contact', name: 'Mike Wilson', email: 'mike@company.com', phone: '+1 555-0103', initials: 'MW', color: 'orange' as const },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [openedContact, setOpenedContact] = useState<string | null>(null);
  const [pinnedContact, setPinnedContact] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openedContact === 'Billing contact' && pinnedContact === 'Billing contact' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openedContact, pinnedContact, onSuccess]);

  const handlePin = (role: string) => {
    setPinnedContact(role);
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
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="sm" mb="sm">Contacts</Text>
      <Group gap="xs">
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
                size="sm"
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
            >
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={600}>{contact.role}</Text>
                <ActionIcon 
                  variant="subtle" 
                  size="sm"
                  onClick={() => handlePin(contact.role)}
                  data-testid={`pin-button-${contact.role.toLowerCase().replace(' ', '-')}`}
                  aria-label="Pin"
                >
                  {pinnedContact === contact.role ? <IconPinFilled size={14} /> : <IconPin size={14} />}
                </ActionIcon>
              </Group>
              <Group gap="sm">
                <Avatar size="sm" radius="xl" color={contact.color}>
                  {contact.initials}
                </Avatar>
                <Stack gap={2}>
                  <Text size="xs" fw={500}>{contact.name}</Text>
                  <Text size="xs" c="dimmed">{contact.email}</Text>
                  <Text size="xs" c="dimmed">{contact.phone}</Text>
                </Stack>
              </Group>
            </Popover.Dropdown>
          </Popover>
        ))}
      </Group>
    </Card>
  );
}
