'use client';

/**
 * checkbox_tristate-mantine-T10: Dashboard scroll: clear Staging rollout (Unchecked)
 *
 * Layout: dashboard with a main scrollable content column (the page itself scrolls).
 * Near the top of the dashboard is a "Rollout controls" card that contains a long list
 * of environments and toggles. The list is long enough that the entries for staging and
 * production are below the initial fold, requiring scrolling to reach them.
 *
 * Within the Rollout controls card there are two Mantine tri-state checkboxes with similar labels:
 * - "Staging rollout" (target)
 * - "Production rollout" (distractor)
 *
 * Initial states:
 * - Staging rollout: Checked
 * - Production rollout: Indeterminate
 *
 * Clutter: high but realistic for a dashboard. Above the card are filters and a date range picker;
 * within the card are several unrelated controls.
 * 
 * Success: "Staging rollout" is Unchecked.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Text, Button, Group, Stack, TextInput, Select, Divider, Box } from '@mantine/core';
import { IconSearch, IconCalendar } from '@tabler/icons-react';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [stagingState, setStagingState] = useState<TristateValue>('checked');
  const [productionState, setProductionState] = useState<TristateValue>('indeterminate');

  const handleStagingClick = () => {
    const newState = cycleTristateValue(stagingState);
    setStagingState(newState);
    if (newState === 'unchecked') {
      onSuccess();
    }
  };

  const handleProductionClick = () => {
    setProductionState(cycleTristateValue(productionState));
  };

  return (
    <Box style={{ width: 550, maxHeight: 450, overflow: 'auto' }} data-testid="dashboard-scroll-container">
      {/* Dashboard filters */}
      <Group mb="md" justify="space-between">
        <Group gap="sm">
          <TextInput
            placeholder="Search environments..."
            leftSection={<IconSearch size={14} />}
            size="sm"
            style={{ width: 180 }}
          />
          <Select
            placeholder="Filter by"
            size="sm"
            data={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
            ]}
            style={{ width: 120 }}
          />
        </Group>
        <Group gap="sm">
          <Button size="sm" variant="light" leftSection={<IconCalendar size={14} />}>
            Date range
          </Button>
        </Group>
      </Group>

      {/* Rollout controls card */}
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={500}>Rollout controls</Text>
          <Group gap="xs">
            <Button size="xs" variant="subtle">Pause all</Button>
            <Button size="xs" variant="subtle">Resume</Button>
          </Group>
        </Group>

        <TextInput
          placeholder="Search environments..."
          size="xs"
          mb="md"
        />

        <Stack gap="md">
          {/* Development env */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Development</Text>
            <Group justify="space-between" align="center">
              <Text size="sm">Feature flags enabled</Text>
              <Checkbox defaultChecked label="" />
            </Group>
          </Box>
          
          <Divider />
          
          {/* Testing env */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Testing</Text>
            <Group justify="space-between" align="center">
              <Text size="sm">Auto-deploy</Text>
              <Checkbox defaultChecked label="" />
            </Group>
          </Box>
          
          <Divider />
          
          {/* QA env */}
          <Box>
            <Text size="sm" fw={500} mb="xs">QA</Text>
            <Group justify="space-between" align="center">
              <Text size="sm">Integration tests</Text>
              <Checkbox defaultChecked label="" />
            </Group>
          </Box>
          
          <Divider />
          
          {/* Staging env - target area */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Staging</Text>
            <div onClick={handleStagingClick} style={{ cursor: 'pointer' }}>
              <Checkbox
                checked={stagingState === 'checked'}
                indeterminate={stagingState === 'indeterminate'}
                label="Staging rollout"
                data-testid="staging-rollout-checkbox"
                readOnly
              />
            </div>
          </Box>
          
          <Divider />
          
          {/* Production env - distractor */}
          <Box>
            <Text size="sm" fw={500} mb="xs">Production</Text>
            <div onClick={handleProductionClick} style={{ cursor: 'pointer' }}>
              <Checkbox
                checked={productionState === 'checked'}
                indeterminate={productionState === 'indeterminate'}
                label="Production rollout"
                data-testid="production-rollout-checkbox"
                readOnly
              />
            </div>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
