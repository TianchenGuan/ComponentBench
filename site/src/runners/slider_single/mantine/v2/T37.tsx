'use client';

/**
 * slider_single-mantine-v2-T37: Advanced escalation popover — restrictToMarks, Escalation=75 + Apply
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Group, Popover, Slider, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const marks = [5, 15, 35, 55, 75, 95].map((value) => ({ value, label: `${value}` }));

export default function T37({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [retry, setRetry] = useState(35);
  const [escalation, setEscalation] = useState(15);
  const [appliedRetry, setAppliedRetry] = useState(35);
  const [appliedEscalation, setAppliedEscalation] = useState(15);

  useEffect(() => {
    if (appliedEscalation === 75 && appliedRetry === 35) {
      onSuccess();
    }
  }, [appliedEscalation, appliedRetry, onSuccess]);

  const open = () => {
    setRetry(appliedRetry);
    setEscalation(appliedEscalation);
    setOpened(true);
  };

  const apply = () => {
    setAppliedRetry(retry);
    setAppliedEscalation(escalation);
    setOpened(false);
  };

  const cancel = () => {
    setRetry(appliedRetry);
    setEscalation(appliedEscalation);
    setOpened(false);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="sm" mb="xs">
        Escalation policy
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Retry: {appliedRetry} · Escalation: {appliedEscalation}
      </Text>
      <Group gap="sm" mb="sm">
        <Text size="xs" c="dimmed">
          Version 12 · owner: platform
        </Text>
      </Group>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" withArrow shadow="md">
        <Popover.Target>
          <Button size="sm" onClick={open} data-testid="btn-advanced-escalation">
            Advanced escalation
          </Button>
        </Popover.Target>
        <Popover.Dropdown maw={360}>
          <Stack gap="md">
            <Text size="xs" c="dimmed">
              Fine-grained levels snap to approved checkpoints.
            </Text>
            <div>
              <Text fw={500} size="sm" mb="xs">
                Retry level
              </Text>
              <Slider
                value={retry}
                onChange={setRetry}
                min={5}
                max={95}
                step={1}
                marks={marks}
                restrictToMarks
                data-testid="slider-retry-level"
              />
              <Text c="dimmed" size="xs" mt={4}>
                Current: {retry}
              </Text>
            </div>
            <div>
              <Text fw={500} size="sm" mb="xs">
                Escalation level
              </Text>
              <Slider
                value={escalation}
                onChange={setEscalation}
                min={5}
                max={95}
                step={1}
                marks={marks}
                restrictToMarks
                data-testid="slider-escalation-level"
              />
              <Text c="dimmed" size="xs" mt={4}>
                Current: {escalation}
              </Text>
            </div>
            <Group justify="flex-end" gap="xs">
              <Button variant="default" size="xs" onClick={cancel}>
                Cancel
              </Button>
              <Button size="xs" onClick={apply} data-testid="btn-apply-escalation">
                Apply
              </Button>
            </Group>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
