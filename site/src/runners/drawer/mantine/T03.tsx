'use client';

/**
 * drawer-mantine-T03: Open the drawer that matches a visual color reference (2 instances)
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * At the top of the card:
 * - A "Target swatch" is shown as a small colored rectangle (no text), e.g., a teal accent.
 *
 * Below are two identical Mantine Buttons labeled "Open panel":
 * - Button 1 opens Drawer A, which has a teal accent line under the header.
 * - Button 2 opens Drawer B, which has a purple accent line under the header.
 *
 * Both drawers:
 * - Have the same visible title text "Panel".
 * - Open from the right with an overlay and a header close (X) button.
 *
 * Initial state:
 * - Both drawers are CLOSED.
 *
 * Feedback:
 * - The opened drawer shows its header accent color clearly, allowing visual confirmation against the Target swatch.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack, Box, Group } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

type DrawerType = 'teal' | 'purple' | null;

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const successCalledRef = useRef(false);

  // Target is the teal drawer (Drawer A)
  useEffect(() => {
    if (openDrawer === 'teal' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openDrawer, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Stack gap="lg" align="center">
        {/* Target swatch */}
        <Box
          style={{
            border: '1px dashed #ccc',
            padding: 16,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Text size="xs" c="dimmed" mb="xs">
            Target swatch
          </Text>
          <Box
            style={{
              width: 60,
              height: 20,
              backgroundColor: '#0d9488',
              borderRadius: 4,
            }}
          />
        </Box>

        {/* Buttons */}
        <Group>
          <Button
            variant="outline"
            onClick={() => setOpenDrawer('teal')}
            data-testid="open-a"
            leftSection={
              <Box style={{ width: 14, height: 14, backgroundColor: '#0d9488', borderRadius: 3 }} />
            }
          >
            Open panel
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpenDrawer('purple')}
            data-testid="open-b"
            leftSection={
              <Box style={{ width: 14, height: 14, backgroundColor: '#9333ea', borderRadius: 3 }} />
            }
          >
            Open panel
          </Button>
        </Group>
      </Stack>

      {/* Drawer A - Teal accent */}
      <Drawer
        opened={openDrawer === 'teal'}
        onClose={() => setOpenDrawer(null)}
        title="Panel"
        position="right"
        data-testid="drawer-a"
      >
        <Box style={{ borderTop: '3px solid #0d9488', paddingTop: 16 }}>
          <Text size="sm">This panel has a teal accent.</Text>
        </Box>
      </Drawer>

      {/* Drawer B - Purple accent */}
      <Drawer
        opened={openDrawer === 'purple'}
        onClose={() => setOpenDrawer(null)}
        title="Panel"
        position="right"
        data-testid="drawer-b"
      >
        <Box style={{ borderTop: '3px solid #9333ea', paddingTop: 16 }}>
          <Text size="sm">This panel has a purple accent.</Text>
        </Box>
      </Drawer>
    </Card>
  );
}
