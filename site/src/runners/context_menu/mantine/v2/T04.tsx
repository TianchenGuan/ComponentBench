'use client';

/**
 * context_menu-mantine-v2-T04: Playlist item 12 — Sort → By date → Newest first
 */

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Paper, Text, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';


const ITEMS = Array.from({ length: 8 }, (_, i) => 8 + i);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [path, setPath] = useState<string[] | null>(null);
  const [showSortSub, setShowSortSub] = useState(false);
  const [showByDateSub, setShowByDateSub] = useState(false);
  const [showByTitleSub, setShowByTitleSub] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (
      path &&
      path.length === 3 &&
      path[0] === 'Sort' &&
      path[1] === 'By date' &&
      path[2] === 'Newest first'
    ) {
      done.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpened(true);
  };

  const activate = (segments: string[]) => {
    setPath(segments);
    setOpened(false);
  };

  return (
    <Paper shadow="sm" p="md" radius="md" w={320} maw="100%">
      <Text fw={600} size="sm" mb="sm">
        Playlist
      </Text>
      <Stack gap={4}>
        {ITEMS.map((n) => {
          const label = `Playlist item ${n}`;
          const is12 = n === 12;
          return is12 ? (
            <Menu
              key={label}
              opened={opened}
              onChange={setOpened}
              trigger="click-hover"
              closeDelay={180}
              openDelay={60}
              position="bottom-start"
            >
              <Menu.Target>
                <Box
                  px="xs"
                  py={6}
                  onContextMenu={handleContextMenu}
                  style={{
                    borderRadius: 6,
                    cursor: 'context-menu',
                    background: 'var(--mantine-color-grape-0)',
                    border: '1px solid var(--mantine-color-grape-3)',
                  }}
                  data-testid="playlist-item-12"
                >
                  <Text size="sm" fw={600}>
                    {label}
                  </Text>
                </Box>
              </Menu.Target>
              <Menu.Dropdown data-testid="context-menu-overlay">
                <Menu.Item onClick={() => activate(['Open'])}>Open</Menu.Item>
                <Menu.Item closeMenuOnClick={false} onClick={() => setShowSortSub(!showSortSub)}>Sort →</Menu.Item>
                {showSortSub && (
                  <>
                    <Menu.Item closeMenuOnClick={false} pl={28} onClick={() => setShowByDateSub(!showByDateSub)}>By date →</Menu.Item>
                    {showByDateSub && (
                      <>
                        <Menu.Item pl={52} onClick={() => activate(['Sort', 'By date', 'Newest first'])}>
                          Newest first
                        </Menu.Item>
                        <Menu.Item pl={52} onClick={() => activate(['Sort', 'By date', 'Oldest first'])}>
                          Oldest first
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Item closeMenuOnClick={false} pl={28} onClick={() => setShowByTitleSub(!showByTitleSub)}>By title →</Menu.Item>
                    {showByTitleSub && (
                      <>
                        <Menu.Item pl={52} onClick={() => activate(['Sort', 'By title', 'A → Z'])}>A → Z</Menu.Item>
                        <Menu.Item pl={52} onClick={() => activate(['Sort', 'By title', 'Z → A'])}>Z → A</Menu.Item>
                      </>
                    )}
                  </>
                )}
                <Menu.Item onClick={() => activate(['Queue next'])}>Queue next</Menu.Item>
                <Menu.Item color="red" onClick={() => activate(['Remove'])}>
                  Remove
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Box
              key={label}
              px="xs"
              py={6}
              style={{
                borderRadius: 6,
                background: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-3)',
              }}
            >
              <Text size="sm" c="dimmed">
                {label}
              </Text>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}
