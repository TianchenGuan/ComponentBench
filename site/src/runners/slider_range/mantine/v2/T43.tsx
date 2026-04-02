'use client';

/**
 * slider_range-mantine-v2-T43: Small-thumb opacity window (size xs), decimal 0–1, Save effects
 */

import React, { useEffect, useState } from 'react';
import { Box, Button, Card, Group, RangeSlider, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

function fmt(v: number) {
  return (v / 100).toFixed(2);
}

export default function T43({ onSuccess }: TaskComponentProps) {
  const [draftOp, setDraftOp] = useState<[number, number]>([10, 90]);
  const [draftBlur, setDraftBlur] = useState<[number, number]>([20, 80]);
  const [committedOp, setCommittedOp] = useState<[number, number]>([10, 90]);
  const [committedBlur, setCommittedBlur] = useState<[number, number]>([20, 80]);

  const save = () => {
    setCommittedOp(draftOp);
    setCommittedBlur(draftBlur);
  };

  useEffect(() => {
    const opOk =
      committedOp[0] >= 29 &&
      committedOp[0] <= 31 &&
      committedOp[1] >= 59 &&
      committedOp[1] <= 61;
    const blurOk = committedBlur[0] === 20 && committedBlur[1] === 80;
    if (opOk && blurOk) {
      onSuccess();
    }
  }, [committedOp, committedBlur, onSuccess]);

  return (
    <Card withBorder padding="sm" radius="md" maw={400}>
      <Text fw={700} size="sm" mb="xs">
        Effects
      </Text>

      <Text fw={500} size="sm" mb={4}>
        Opacity window
      </Text>
      <RangeSlider
        size="xs"
        value={draftOp}
        onChange={setDraftOp}
        min={0}
        max={100}
        step={1}
        label={(v) => fmt(v)}
        data-testid="opacity-window-range"
        mb="xs"
      />
      <Text size="xs" c="dimmed" mb="md">
        Selected: {fmt(draftOp[0])} - {fmt(draftOp[1])}
      </Text>

      <Text fw={500} size="sm" mb={4}>
        Blur window
      </Text>
      <RangeSlider
        size="xs"
        value={draftBlur}
        onChange={setDraftBlur}
        min={0}
        max={100}
        step={1}
        label={(v) => fmt(v)}
        data-testid="blur-window-range"
        mb="xs"
      />
      <Text size="xs" c="dimmed" mb="md">
        Selected: {fmt(draftBlur[0])} - {fmt(draftBlur[1])}
      </Text>

      <Group justify="flex-end">
        <Button size="xs" onClick={save}>
          Save effects
        </Button>
      </Group>
    </Card>
  );
}
