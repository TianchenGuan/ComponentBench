'use client';

/**
 * window_splitter-mantine-v2-T08: Alerts layout — Preview (right) 30% + Apply layout
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Group,
  NavLink,
  Text,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { IconBell, IconSettings } from '@tabler/icons-react';
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [rulesPct, setRulesPct] = useState(60);
  const [committedPreview, setCommittedPreview] = useState<number | null>(null);
  const successFired = useRef(false);
  const previewPct = 100 - rulesPct;

  useEffect(() => {
    if (
      !successFired.current &&
      committedPreview !== null &&
      committedPreview >= 29 &&
      committedPreview <= 31
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedPreview, onSuccess]);

  const apply = () => {
    setCommittedPreview(previewPct);
  };

  return (
    <Box style={{ display: 'flex', gap: 20, minHeight: 420 }}>
      <Box w={200}>
        <NavLink label="General" leftSection={<IconSettings size={16} />} />
        <NavLink label="Alerts" leftSection={<IconBell size={16} />} active />
      </Box>
      <Box flex={1}>
        <Group gap="xs" mb="md">
          <Text size="xs" c="dimmed">Settings panel — locate the Alerts layout card.</Text>
        </Group>

        <Card withBorder padding="sm" radius="md" maw={560}>
          <Text fw={600} size="sm" mb="xs">Alerts layout</Text>
          <Text size="xs" c="blue" mb="sm">Divider supports keyboard adjustment</Text>
          <Box
            style={{ height: 200, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
            data-testid="splitter-primary"
          >
            <HorizSplit
              defaultLeftPct={60}
              leftMin={15}
              leftMax={88}
              onLeftPctChange={setRulesPct}
              leftContent={
                <Box h="100%" bg="gray.0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="sm" fw={500}>Rules</Text>
                </Box>
              }
              rightContent={
                <Box h="100%" bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text size="sm" fw={500}>Preview</Text>
                </Box>
              }
            />
          </Box>
          <Text size="xs" c="dimmed" mt="xs" ta="center">
            Rules: {rulesPct.toFixed(1)}% • Preview: {previewPct.toFixed(1)}%
          </Text>
          {committedPreview !== null && (
            <Text size="xs" c="green" mt={4} ta="center" data-committed-layout={`${100 - committedPreview},${committedPreview}`}>
              Applied Preview: {committedPreview.toFixed(1)}%
            </Text>
          )}
          <Group justify="flex-end" mt="md">
            <Button size="xs" onClick={apply}>Apply layout</Button>
          </Group>
        </Card>
      </Box>
    </Box>
  );
}
