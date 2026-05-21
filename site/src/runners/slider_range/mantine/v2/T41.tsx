'use client';

/**
 * slider_range-mantine-v2-T41: Bandwidth allocation with minRange and no push
 *
 * Network tuning panel: Bandwidth allocation minRange=20 (Mantine has no pushOnOverlap prop in v7),
 * Backup window sibling, Apply panel commits state.
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Group, RangeSlider, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T41({ onSuccess }: TaskComponentProps) {
  const [draftBw, setDraftBw] = useState<[number, number]>([10, 40]);
  const [draftBackup, setDraftBackup] = useState<[number, number]>([15, 35]);
  const [committedBw, setCommittedBw] = useState<[number, number]>([10, 40]);
  const [committedBackup, setCommittedBackup] = useState<[number, number]>([15, 35]);

  const apply = () => {
    setCommittedBw(draftBw);
    setCommittedBackup(draftBackup);
  };

  useEffect(() => {
    if (
      committedBw[0] === 30 &&
      committedBw[1] === 50 &&
      committedBackup[0] === 15 &&
      committedBackup[1] === 35
    ) {
      onSuccess();
    }
  }, [committedBw, committedBackup, onSuccess]);

  return (
    <Card withBorder padding="sm" radius="md" shadow="xs" maw={440}>
      <Text fw={700} size="sm" mb="xs">
        Network tuning
      </Text>
      <Text size="xs" c="dimmed" mb="sm">
        Adjust bandwidth allocation; leave backup window unchanged unless instructed.
      </Text>

      <Text fw={500} size="sm" mb={4}>
        Bandwidth allocation
      </Text>
      <Text size="xs" c="dimmed" mb="xs">
        Minimum width: 20
      </Text>
      <RangeSlider
        value={draftBw}
        onChange={setDraftBw}
        min={0}
        max={100}
        step={1}
        minRange={20}
        data-testid="bandwidth-allocation"
        mb="sm"
      />
      <Text size="xs" c="dimmed" mb="md">
        Selected: {draftBw[0]} - {draftBw[1]}
        {committedBw[0] !== draftBw[0] || committedBw[1] !== draftBw[1] ? ' (draft)' : ''}
      </Text>

      <Text fw={500} size="sm" mb={4}>
        Backup window
      </Text>
      <RangeSlider
        value={draftBackup}
        onChange={setDraftBackup}
        min={0}
        max={100}
        step={1}
        data-testid="backup-window"
        mb="sm"
      />
      <Text size="xs" c="dimmed" mb="md">
        Selected: {draftBackup[0]} - {draftBackup[1]}
      </Text>

      <Group justify="flex-end">
        <Button size="xs" onClick={apply}>
          Apply panel
        </Button>
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        Applied — Bandwidth: {committedBw[0]}-{committedBw[1]}, Backup: {committedBackup[0]}-
        {committedBackup[1]}
      </Text>
    </Card>
  );
}
