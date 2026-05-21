'use client';

/**
 * toolbar-mantine-T09: Dashboard with 3 toolbars: configure Footer toolbar state
 *
 * The page is a dense dashboard with multiple widgets (clutter=high). Three Mantine 
 * toolbars appear in different areas:
 * - "Main" toolbar (top)
 * - "Sidebar" toolbar (left)
 * - "Footer" toolbar (bottom, target)
 * Each toolbar contains three ActionIcon toggles (Favorite, Pin, Mute) and a small 
 * SegmentedControl labeled "Mode" with two options: Comfortable and Compact.
 * Target: In Footer toolbar: mute=true, pin=true, favorite=false, mode=compact.
 * Initial state: Footer has all toggles Off, Mode Comfortable.
 */

import React, { useState } from 'react';
import { Paper, Group, ActionIcon, SegmentedControl, Text, Title, Box, Tooltip, Badge } from '@mantine/core';
import { IconHeart, IconPin, IconVolume3 } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToolbarState {
  toggles: {
    favorite: boolean;
    pin: boolean;
    mute: boolean;
  };
  mode: 'comfortable' | 'compact';
}

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [main, setMain] = useState<ToolbarState>({
    toggles: { favorite: true, pin: false, mute: false },
    mode: 'comfortable',
  });
  const [sidebar, setSidebar] = useState<ToolbarState>({
    toggles: { favorite: false, pin: true, mute: false },
    mode: 'compact',
  });
  const [footer, setFooter] = useState<ToolbarState>({
    toggles: { favorite: false, pin: false, mute: false },
    mode: 'comfortable',
  });

  const handleFooterToggle = (key: 'favorite' | 'pin' | 'mute') => {
    const newState = {
      ...footer,
      toggles: { ...footer.toggles, [key]: !footer.toggles[key] },
    };
    setFooter(newState);
    checkSuccess(newState);
  };

  const handleFooterMode = (mode: string) => {
    const newState = { ...footer, mode: mode as 'comfortable' | 'compact' };
    setFooter(newState);
    checkSuccess(newState);
  };

  const checkSuccess = (state: ToolbarState) => {
    // Success: mute=true, pin=true, favorite=false, mode=compact
    if (
      state.toggles.mute &&
      state.toggles.pin &&
      !state.toggles.favorite &&
      state.mode === 'compact'
    ) {
      onSuccess();
    }
  };

  const renderToolbar = (
    label: string,
    state: ToolbarState,
    onToggle: (key: 'favorite' | 'pin' | 'mute') => void,
    onModeChange: (mode: string) => void,
    testIdPrefix: string
  ) => (
    <Box p="xs" style={{ background: '#f9f9f9', borderRadius: 6 }} data-testid={testIdPrefix}>
      <Group justify="space-between" gap="xs">
        <Text size="xs" fw={600}>
          {label}
        </Text>
        <Group gap={4}>
          <Tooltip label="Favorite">
            <ActionIcon
              size="xs"
              variant={state.toggles.favorite ? 'filled' : 'default'}
              color={state.toggles.favorite ? 'red' : 'gray'}
              onClick={() => onToggle('favorite')}
              aria-pressed={state.toggles.favorite}
              aria-label="Favorite"
              data-testid={`${testIdPrefix}-favorite`}
            >
              <IconHeart size={12} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Pin">
            <ActionIcon
              size="xs"
              variant={state.toggles.pin ? 'filled' : 'default'}
              color={state.toggles.pin ? 'blue' : 'gray'}
              onClick={() => onToggle('pin')}
              aria-pressed={state.toggles.pin}
              aria-label="Pin"
              data-testid={`${testIdPrefix}-pin`}
            >
              <IconPin size={12} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Mute">
            <ActionIcon
              size="xs"
              variant={state.toggles.mute ? 'filled' : 'default'}
              onClick={() => onToggle('mute')}
              aria-pressed={state.toggles.mute}
              aria-label="Mute"
              data-testid={`${testIdPrefix}-mute`}
            >
              <IconVolume3 size={12} />
            </ActionIcon>
          </Tooltip>
          <SegmentedControl
            size="xs"
            value={state.mode}
            onChange={onModeChange}
            data={[
              { value: 'comfortable', label: 'Comfortable' },
              { value: 'compact', label: 'Compact' },
            ]}
            data-testid={`${testIdPrefix}-mode`}
          />
        </Group>
      </Group>
    </Box>
  );

  return (
    <Paper shadow="sm" p="md" radius="md" style={{ width: 600 }}>
      {/* Main toolbar (top) */}
      <Box mb="md">
        {renderToolbar(
          'Main',
          main,
          (key) =>
            setMain((prev) => ({
              ...prev,
              toggles: { ...prev.toggles, [key]: !prev.toggles[key] },
            })),
          (mode) => setMain((prev) => ({ ...prev, mode: mode as 'comfortable' | 'compact' })),
          'mantine-toolbar-main'
        )}
      </Box>

      {/* Dashboard content with Sidebar */}
      <Group align="flex-start" gap="md" mb="md">
        {/* Sidebar toolbar */}
        <Box style={{ width: 180 }}>
          {renderToolbar(
            'Sidebar',
            sidebar,
            (key) =>
              setSidebar((prev) => ({
                ...prev,
                toggles: { ...prev.toggles, [key]: !prev.toggles[key] },
              })),
            (mode) => setSidebar((prev) => ({ ...prev, mode: mode as 'comfortable' | 'compact' })),
            'mantine-toolbar-sidebar'
          )}
          <Box p="sm" mt="xs" style={{ background: '#f0f0f0', borderRadius: 4 }}>
            <Text size="xs" c="dimmed">
              Widget A
            </Text>
          </Box>
        </Box>

        {/* Main content area (clutter) */}
        <Box style={{ flex: 1 }}>
          <Group grow mb="xs">
            <Paper p="xs" withBorder>
              <Text size="xs" c="dimmed">
                Chart 1
              </Text>
            </Paper>
            <Paper p="xs" withBorder>
              <Text size="xs" c="dimmed">
                Chart 2
              </Text>
            </Paper>
          </Group>
          <Paper p="xs" withBorder>
            <Text size="xs" c="dimmed">
              Data Table
            </Text>
          </Paper>
        </Box>
      </Group>

      {/* Target preview */}
      <Box
        p="xs"
        mb="md"
        style={{ background: '#e6f7ff', borderRadius: 4, textAlign: 'center' }}
      >
        <Text size="xs" c="dimmed">
          Target: Compact mode + Mute+Pin (Favorite off) in Footer toolbar
        </Text>
        <Group gap="xs" justify="center" mt={4}>
          <Badge size="xs" color="gray">
            Pin
          </Badge>
          <Badge size="xs" color="gray">
            Mute
          </Badge>
          <Badge size="xs" color="blue">
            Compact
          </Badge>
        </Group>
      </Box>

      {/* Footer toolbar (target) */}
      {renderToolbar(
        'Footer',
        footer,
        handleFooterToggle,
        handleFooterMode,
        'mantine-toolbar-footer'
      )}
    </Paper>
  );
}
