'use client';

/**
 * slider_range-mantine-v2-T45: Signal threshold decimals in drawer, minRange, Save tuning
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  Group,
  RangeSlider,
  Text,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

function fmt3(n: number) {
  return (n / 1000).toFixed(3);
}

export default function T45({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [signalCommitted, setSignalCommitted] = useState<[number, number]>([200, 800]);
  const [noiseCommitted, setNoiseCommitted] = useState<[number, number]>([150, 650]);
  const [signalDraft, setSignalDraft] = useState<[number, number]>([200, 800]);
  const [noiseDraft, setNoiseDraft] = useState<[number, number]>([150, 650]);

  const open = () => {
    setSignalDraft(signalCommitted);
    setNoiseDraft(noiseCommitted);
    setOpened(true);
  };

  const save = () => {
    setSignalCommitted(signalDraft);
    setNoiseCommitted(noiseDraft);
    setOpened(false);
  };

  const cancel = () => {
    setOpened(false);
  };

  useEffect(() => {
    const sigOk =
      signalCommitted[0] >= 115 &&
      signalCommitted[0] <= 135 &&
      signalCommitted[1] >= 545 &&
      signalCommitted[1] <= 565;
    const noiseOk = noiseCommitted[0] === 150 && noiseCommitted[1] === 650;
    if (sigOk && noiseOk) {
      onSuccess();
    }
  }, [signalCommitted, noiseCommitted, onSuccess]);

  return (
    <Box>
      <Text size="xs" c="dimmed" mb="xs">
        Applied — Signal: {fmt3(signalCommitted[0])}–{fmt3(signalCommitted[1])}, Noise:{' '}
        {fmt3(noiseCommitted[0])}–{fmt3(noiseCommitted[1])}
      </Text>
      <Button size="sm" onClick={open}>
        Signal tuning
      </Button>

      <Drawer opened={opened} onClose={cancel} title="Signal tuning" position="right" size="md">
        <Box
          mb="md"
          p="sm"
          style={{ background: 'var(--mantine-color-gray-1)', borderRadius: 4 }}
        >
          <Text size="sm" c="dimmed">
            Reference:{' '}
            <Text span fw={600}>
              0.125 – 0.555
            </Text>
          </Text>
        </Box>

        <Text fw={500} size="sm" mb={4}>
          Signal threshold
        </Text>
        <RangeSlider
          value={signalDraft}
          onChange={setSignalDraft}
          min={0}
          max={1000}
          step={1}
          minRange={100}
          label={(val) => fmt3(val)}
          data-testid="signal-threshold-range"
          mb="xs"
        />
        <Text size="xs" c="dimmed" mb="md">
          Selected: {fmt3(signalDraft[0])} - {fmt3(signalDraft[1])}
        </Text>

        <Text fw={500} size="sm" mb={4}>
          Noise threshold
        </Text>
        <RangeSlider
          value={noiseDraft}
          onChange={setNoiseDraft}
          min={0}
          max={1000}
          step={1}
          label={(val) => fmt3(val)}
          data-testid="noise-threshold-range"
          mb="xs"
        />
        <Text size="xs" c="dimmed" mb="lg">
          Selected: {fmt3(noiseDraft[0])} - {fmt3(noiseDraft[1])}
        </Text>

        <Group justify="flex-end">
          <Button variant="default" onClick={cancel}>
            Cancel
          </Button>
          <Button onClick={save}>Save tuning</Button>
        </Group>
      </Drawer>
    </Box>
  );
}
