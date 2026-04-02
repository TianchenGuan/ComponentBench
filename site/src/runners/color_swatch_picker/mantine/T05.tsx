'use client';

/**
 * color_swatch_picker-mantine-T05: Open swatches dropdown in dark theme
 *
 * Layout: isolated_card anchored to bottom_left with dark theme.
 * A ColorInput that needs to be opened to show swatches.
 *
 * Initial state: Dropdown is closed.
 * Success: Dropdown is open (swatches visible).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, Popover, TextInput, ActionIcon, Box, ColorSwatch } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';
import { MANTINE_SWATCHES } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#228be6');
  const [opened, { open, close, toggle }] = useDisclosure(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (opened) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [opened, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleSwatchClick = (color: string) => {
    setValue(color);
    // Don't close on select for this task
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Avatar</Text>
      
      <div data-testid="avatar-bg-color">
        <Text size="sm" fw={500} mb={4}>Avatar background color</Text>
        <Popover
          opened={opened}
          onChange={(isOpen) => isOpen ? open() : close()}
          position="bottom-start"
          withArrow
        >
          <Popover.Target>
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onClick={open}
              readOnly
              leftSection={
                <ColorSwatch color={value} size={18} />
              }
              rightSection={
                <ActionIcon variant="subtle" onClick={toggle} size="sm">
                  <Box w={12} h={12} style={{ border: '1px solid currentColor', borderRadius: 2 }} />
                </ActionIcon>
              }
              styles={{
                input: { cursor: 'pointer' },
              }}
              data-testid="avatar-bg-input"
            />
          </Popover.Target>
          <Popover.Dropdown data-testid="avatar-bg-dropdown">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
              {MANTINE_SWATCHES.map((color) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  size={24}
                  onClick={() => handleSwatchClick(color)}
                  style={{ cursor: 'pointer' }}
                  title={color}
                />
              ))}
            </div>
          </Popover.Dropdown>
        </Popover>
      </div>
      <div 
        data-testid="avatar-bg-dropdown-state" 
        data-open={opened ? 'true' : 'false'}
        style={{ display: 'none' }}
      />
    </Card>
  );
}
