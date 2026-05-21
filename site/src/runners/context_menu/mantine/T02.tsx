'use client';

/**
 * context_menu-mantine-T02: Edit contact via context menu
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a contact card shows the name "Alicia Diaz" and an email address.
 * Right-clicking on the contact card opens a custom context menu.
 *
 * Implementation: onContextMenu opens a Mantine Menu dropdown positioned at the cursor.
 *
 * Menu items: View profile, Edit details, Remove contact.
 *
 * Success: The activated item path equals ['Edit details'] for the Alicia Diaz context menu.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Group, Avatar } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Edit details' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(true);
  };

  const handleItemClick = (item: string) => {
    setLastActivatedItem(item);
    setMenuOpen(false);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 350 }}>
      <Text size="lg" fw={500} mb="md">Contact</Text>
      
      <Menu
        opened={menuOpen}
        onChange={setMenuOpen}
        position="bottom-start"
      >
        <Menu.Target>
          <Group
            onContextMenu={handleContextMenu}
            gap="sm"
            p="md"
            style={{
              background: 'var(--mantine-color-gray-0)',
              borderRadius: 8,
              cursor: 'context-menu',
            }}
            data-testid="contact-card"
            data-last-activated={lastActivatedItem}
          >
            <Avatar color="blue" radius="xl">
              <IconUser size={20} />
            </Avatar>
            <div>
              <Text size="sm" fw={500}>Alicia Diaz</Text>
              <Text size="xs" c="dimmed">alicia.diaz@example.com</Text>
            </div>
          </Group>
        </Menu.Target>

        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item onClick={() => handleItemClick('View profile')}>View profile</Menu.Item>
          <Menu.Item onClick={() => handleItemClick('Edit details')}>Edit details</Menu.Item>
          <Menu.Item onClick={() => handleItemClick('Remove contact')} color="red">Remove contact</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Text size="xs" c="dimmed" mt="md">
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </Text>
    </Paper>
  );
}
