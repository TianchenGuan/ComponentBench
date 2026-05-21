'use client';

/**
 * toolbar-mantine-T06: Drawer toolbar: open the overflow menu
 *
 * The scene is a drawer_flow. The main page shows a centered card with a single 
 * primary button labeled "Open quick tools".
 * Clicking it opens a right-side Mantine Drawer titled "Quick Tools".
 * In the drawer header there is a compact toolbar with small ActionIcon buttons: 
 * Pin, Favorite, and a three-dots ActionIcon labeled "More". The More control is 
 * implemented as a Mantine Menu.
 * The task is only to end with the More menu open.
 */

import React, { useState, useEffect } from 'react';
import { Paper, Button, Drawer, Group, ActionIcon, Menu, Text, Title, Box } from '@mantine/core';
import { IconPin, IconHeart, IconDotsVertical, IconSettings, IconArchive, IconTrash } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Success when menu is opened
  useEffect(() => {
    if (menuOpen) {
      onSuccess();
    }
  }, [menuOpen, onSuccess]);

  return (
    <>
      <Paper shadow="sm" p="xl" radius="md" style={{ width: 350, textAlign: 'center' }}>
        <Button
          onClick={() => setDrawerOpen(true)}
          data-testid="mantine-btn-open-quick-tools"
        >
          Open quick tools
        </Button>
      </Paper>

      <Drawer
        opened={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setMenuOpen(false);
        }}
        position="right"
        title={
          <Group justify="space-between" style={{ width: '100%' }}>
            <Title order={5}>Quick Tools</Title>
            <Group gap="xs" data-testid="mantine-toolbar-quick-tools">
              <ActionIcon variant="default" aria-label="Pin" title="Pin">
                <IconPin size={16} />
              </ActionIcon>
              <ActionIcon variant="default" aria-label="Favorite" title="Favorite">
                <IconHeart size={16} />
              </ActionIcon>
              <Menu
                position="bottom-end"
                shadow="md"
                opened={menuOpen}
                onChange={setMenuOpen}
              >
                <Menu.Target>
                  <ActionIcon
                    variant="default"
                    aria-label="More"
                    title="More"
                    data-testid="mantine-toolbar-quick-tools-more"
                  >
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconSettings size={14} />}>Settings</Menu.Item>
                  <Menu.Item leftSection={<IconArchive size={14} />}>Archive</Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconTrash size={14} />} color="red">
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        }
      >
        <Box>
          <Text size="sm" c="dimmed" mb="md">
            More menu: {menuOpen ? 'open' : 'closed'}
          </Text>
          <Text size="sm">
            Use the toolbar controls in the header to manage this item.
          </Text>
        </Box>
      </Drawer>
    </>
  );
}
