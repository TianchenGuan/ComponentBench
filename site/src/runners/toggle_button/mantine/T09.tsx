'use client';

/**
 * toggle_button-mantine-T29: Enable 'Include archived' inside filters drawer and apply
 *
 * Layout: drawer_flow. The main page shows a results list and a button labeled "Filters" near the top.
 * Theme is light, spacing comfortable, default scale. The drawer slides in from the left.
 *
 * Flow:
 * 1) Click the "Filters" button to open a Mantine Drawer titled "Filters".
 * 2) Inside the drawer, there is a single toggle control labeled "Include archived", implemented as a Mantine Button with toggle semantics.
 * 3) At the bottom of the drawer is an "Apply filters" button (plus a "Close" control).
 *
 * Commit behavior:
 * - The toggle's UI state updates inside the drawer, but it is only committed after clicking "Apply filters".
 * - Closing the drawer without applying discards changes (reverts to Off).
 *
 * Initial state when opening: Include archived is Off.
 */

import React, { useState } from 'react';
import { Card, Text, Button, Drawer, Stack, Group, Divider, Box, Paper } from '@mantine/core';
import { IconFilter, IconArchive, IconCheck } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempPressed, setTempPressed] = useState(false);
  const [committedPressed, setCommittedPressed] = useState(false);

  const openDrawer = () => {
    setTempPressed(committedPressed);
    setDrawerOpen(true);
  };

  const handleClose = () => {
    setTempPressed(committedPressed);
    setDrawerOpen(false);
  };

  const handleApply = () => {
    setCommittedPressed(tempPressed);
    setDrawerOpen(false);
    if (tempPressed) {
      onSuccess();
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Search Results</Text>
          <Button
            variant="outline"
            leftSection={<IconFilter size={16} />}
            onClick={openDrawer}
            data-testid="open-filters-button"
          >
            Filters
          </Button>
        </Group>

        {/* Mock results list */}
        <Stack gap="xs">
          <Paper p="sm" withBorder>
            <Text size="sm">Result item 1</Text>
          </Paper>
          <Paper p="sm" withBorder>
            <Text size="sm">Result item 2</Text>
          </Paper>
          <Paper p="sm" withBorder>
            <Text size="sm">Result item 3</Text>
          </Paper>
        </Stack>

        <Text size="xs" c="dimmed" mt="md">
          Include archived: {committedPressed ? 'Yes' : 'No'} (applied)
        </Text>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={handleClose}
        title="Filters"
        position="left"
        size="sm"
      >
        <Stack style={{ height: '100%' }}>
          <Box style={{ flex: 1 }}>
            <Group justify="space-between" align="center">
              <Box>
                <Text fw={500}>Include archived</Text>
                <Text size="xs" c="dimmed">Show archived items in results</Text>
              </Box>
              <Button
                variant={tempPressed ? 'filled' : 'outline'}
                leftSection={tempPressed ? <IconCheck size={16} /> : <IconArchive size={16} />}
                onClick={() => setTempPressed(!tempPressed)}
                aria-pressed={tempPressed}
                data-testid="include-archived-toggle"
              >
                {tempPressed ? 'On' : 'Off'}
              </Button>
            </Group>
          </Box>

          <Divider />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={handleClose}>Close</Button>
            <Button onClick={handleApply} data-testid="apply-filters-button">
              Apply filters
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
