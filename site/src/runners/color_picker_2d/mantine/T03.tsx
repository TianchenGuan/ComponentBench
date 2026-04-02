'use client';

/**
 * color_picker_2d-mantine-T03: Open ColorInput dropdown
 *
 * Layout: isolated_card centered.
 * One Mantine ColorInput labeled "Border color" is shown with a left color preview swatch.
 * The component is configured with withPicker=true (dropdown enabled). No special props like disallowInput are set.
 * Initial state: dropdown is closed on load.
 * When opened, the dropdown shows a 2D color spectrum square, hue slider, and swatches underneath.
 * No other interactive components are present besides a "Help" link (non-blocking).
 *
 * Success: Color picker popup/open state equals True.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Anchor, Popover } from '@mantine/core';
import { ColorPicker } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#8C8C8C');
  const [opened, setOpened] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (opened && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Border Settings</Text>
      
      <Text size="sm" c="dimmed" mb="md">Border color: open dropdown</Text>
      
      <div style={{ marginBottom: 16 }}>
        <Text size="sm" fw={500} mb={4}>Border color</Text>
        <Popover 
          opened={opened} 
          onChange={setOpened}
          position="bottom-start"
          withArrow
        >
          <Popover.Target>
            <button
              onClick={() => setOpened(!opened)}
              data-testid="border-color"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: 4,
                background: '#fff',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: value,
                  border: '1px solid #dee2e6',
                }}
              />
              <span style={{ color: '#495057' }}>{value}</span>
            </button>
          </Popover.Target>
          <Popover.Dropdown>
            <ColorPicker
              value={value}
              onChange={setValue}
              format="hex"
            />
          </Popover.Dropdown>
        </Popover>
      </div>
      
      <Text size="xs" c="dimmed" mt="md">
        Click to open the dropdown picker. <Anchor size="xs">Help</Anchor>
      </Text>
    </Card>
  );
}
