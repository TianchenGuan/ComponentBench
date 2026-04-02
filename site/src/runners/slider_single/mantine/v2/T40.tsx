'use client';

/**
 * slider_single-mantine-v2-T40: Cache controls drawer — scaled storage label + labelAlwaysOn, match 1 GB + Save
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Drawer, Group, Slider, Stack, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const CACHE_TIERS_MB = [128, 256, 512, 1024, 2048] as const;

function formatStorage(mb: number): string {
  if (mb >= 1024 && mb % 1024 === 0) {
    return `${mb / 1024} GB`;
  }
  return `${mb} MB`;
}

export default function T40({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [cacheIdx, setCacheIdx] = useState(1);
  const [logRetention, setLogRetention] = useState(40);
  const [appliedIdx, setAppliedIdx] = useState(1);
  const [appliedLog, setAppliedLog] = useState(40);

  const scale = useMemo(
    () => (idx: number) => CACHE_TIERS_MB[Math.min(Math.max(Math.round(idx), 0), CACHE_TIERS_MB.length - 1)],
    [],
  );

  useEffect(() => {
    const mb = CACHE_TIERS_MB[appliedIdx];
    if (mb === 1024 && appliedLog === 40) {
      onSuccess();
    }
  }, [appliedIdx, appliedLog, onSuccess]);

  const open = () => {
    setCacheIdx(appliedIdx);
    setLogRetention(appliedLog);
    setOpened(true);
  };

  const save = () => {
    setAppliedIdx(cacheIdx);
    setAppliedLog(logRetention);
    setOpened(false);
  };

  const cancel = () => {
    setCacheIdx(appliedIdx);
    setLogRetention(appliedLog);
    setOpened(false);
  };

  const marks = CACHE_TIERS_MB.map((mb, i) => ({
    value: i,
    label: formatStorage(mb),
  }));

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="sm" mb="xs">
        Storage policies
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Cache {formatStorage(CACHE_TIERS_MB[appliedIdx])} · logs {appliedLog} days
      </Text>
      <Button size="sm" onClick={open} data-testid="btn-open-cache-controls">
        Cache controls
      </Button>

      <Drawer opened={opened} onClose={cancel} title="Cache controls" position="right" size="md">
        <Stack gap="lg" pb={64}>
          <Group justify="space-between" align="flex-start">
            <div style={{ flex: 1 }}>
              <Text fw={500} size="sm" mb="xs">
                Cache size
              </Text>
              <Badge size="sm" variant="light" data-reference-id="ref-cache-size">
                Target: 1 GB
              </Badge>
            </div>
          </Group>
          <Slider
            value={cacheIdx}
            onChange={setCacheIdx}
            min={0}
            max={CACHE_TIERS_MB.length - 1}
            step={1}
            marks={marks}
            scale={scale}
            labelAlwaysOn
            label={(mb) => formatStorage(mb)}
            data-testid="slider-cache-size"
          />
          <div>
            <Text fw={500} size="sm" mb="xs">
              Log retention
            </Text>
            <Slider
              value={logRetention}
              onChange={setLogRetention}
              min={0}
              max={90}
              step={1}
              label={(v) => `${v} days`}
              data-testid="slider-log-retention"
            />
            <Text size="xs" c="dimmed" mt={4}>
              {logRetention} days
            </Text>
          </div>
        </Stack>
        <Group justify="flex-end" gap="xs" style={{ position: 'absolute', bottom: 16, right: 16, left: 16 }}>
          <Button variant="default" size="xs" onClick={cancel}>
            Cancel
          </Button>
          <Button size="xs" onClick={save} data-testid="btn-save-cache-controls">
            Save controls
          </Button>
        </Group>
      </Drawer>
    </Card>
  );
}
