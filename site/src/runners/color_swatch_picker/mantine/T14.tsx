'use client';

/**
 * color_swatch_picker-mantine-T14: Set sidebar accent and apply in drawer
 *
 * Layout: drawer_flow with a button that opens a drawer.
 * The drawer contains two ColorInputs and requires clicking "Apply" to commit.
 *
 * Initial state: Background = #25262b, Accent = #228be6.
 * Success: Committed Accent color equals #be4bdb after clicking Apply.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Button, Drawer, Switch, Stack, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../types';

const TARGET_COLOR = '#be4bdb';

export default function T14({ task, onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [committedBgColor, setCommittedBgColor] = useState<string>('#25262b');
  const [committedAccentColor, setCommittedAccentColor] = useState<string>('#228be6');
  const [pendingBgColor, setPendingBgColor] = useState<string>('#25262b');
  const [pendingAccentColor, setPendingAccentColor] = useState<string>('#228be6');
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(committedAccentColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [committedAccentColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleOpen = () => {
    setPendingBgColor(committedBgColor);
    setPendingAccentColor(committedAccentColor);
    open();
  };

  const handleApply = () => {
    setCommittedBgColor(pendingBgColor);
    setCommittedAccentColor(pendingAccentColor);
    close();
  };

  const handleCancel = () => {
    setPendingBgColor(committedBgColor);
    setPendingAccentColor(committedAccentColor);
    close();
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
        <Stack gap="md">
          <div 
            style={{ 
              padding: 16, 
              backgroundColor: committedBgColor, 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ width: 4, height: 40, backgroundColor: committedAccentColor, borderRadius: 2 }} />
            <Text style={{ color: '#fff' }}>Sidebar preview</Text>
          </div>
          <Button onClick={handleOpen}>
            Edit sidebar theme
          </Button>
        </Stack>
      </Card>

      <Drawer
        opened={opened}
        onClose={handleCancel}
        title="Edit sidebar theme"
        position="right"
        size="md"
      >
        <Stack gap="md">
          <Switch
            label="Compact sidebar"
            checked={compactSidebar}
            onChange={(e) => setCompactSidebar(e.currentTarget.checked)}
          />
          
          <div data-testid="background-color">
            <ColorInput
              label="Background color"
              value={pendingBgColor}
              onChange={setPendingBgColor}
              format="hex"
              swatches={MANTINE_SWATCHES}
              withPicker={false}
            />
          </div>
          
          <div data-testid="accent-color">
            <ColorInput
              label="Accent color"
              value={pendingAccentColor}
              onChange={setPendingAccentColor}
              format="hex"
              swatches={MANTINE_SWATCHES}
              withPicker={false}
            />
          </div>
          
          <div 
            style={{ 
              padding: 16, 
              backgroundColor: pendingBgColor, 
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 16,
            }}
          >
            <div style={{ width: 4, height: 40, backgroundColor: pendingAccentColor, borderRadius: 2 }} />
            <Text style={{ color: '#fff' }}>Preview</Text>
          </div>
          
          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply
            </Button>
          </Group>
        </Stack>
      </Drawer>

      <div data-testid="sidebar-accent-committed" style={{ display: 'none' }}>
        {normalizeHex(committedAccentColor)}
      </div>
    </>
  );
}
