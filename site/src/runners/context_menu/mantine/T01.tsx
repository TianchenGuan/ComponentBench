'use client';

/**
 * context_menu-mantine-T01: Open context menu on Sticky note
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a large yellow-like note area titled "Sticky note" with a short message.
 * Right-clicking inside the note opens a custom context menu.
 *
 * Implementation: Mantine provides a Menu component, but right-click triggering is composed by the page:
 * an onContextMenu handler prevents the browser menu and opens a Mantine Menu dropdown positioned at cursor.
 *
 * Menu items: "Edit", "Duplicate", "Delete".
 *
 * Success: The custom Mantine-based context menu overlay is open (menu_open=true).
 */

import React, { useState, useEffect } from 'react';
import { Menu, Paper, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (menuOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [menuOpen, successTriggered, onSuccess]);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setMenuOpen(true);
  };

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 400 }}>
      <Text size="lg" fw={500} mb="md">Sticky note</Text>
      
      <Menu
        opened={menuOpen}
        onChange={setMenuOpen}
        position="bottom-start"
        offset={{ mainAxis: 0, crossAxis: 0 }}
      >
        <Menu.Target>
          <Box
            onContextMenu={handleContextMenu}
            style={{
              width: '100%',
              minHeight: 180,
              background: '#fffbe6',
              border: '1px solid #ffe58f',
              borderRadius: 4,
              padding: 16,
              cursor: 'context-menu',
              position: 'relative',
              left: position.x > 0 ? position.x - 200 : 0,
              top: position.y > 0 ? position.y - 200 : 0,
            }}
            data-testid="sticky-note"
            data-menu-open={menuOpen}
          >
            <Text c="dimmed" size="sm">
              Don&apos;t forget to buy groceries on the way home.
            </Text>
            <Text c="dimmed" size="sm" mt="xs">
              Pick up the dry cleaning.
            </Text>
            <Text c="dimmed" size="xs" mt="md" style={{ fontStyle: 'italic' }}>
              Right-click for options
            </Text>
          </Box>
        </Menu.Target>

        <Menu.Dropdown data-testid="context-menu-overlay">
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Item>Delete</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Paper>
  );
}
