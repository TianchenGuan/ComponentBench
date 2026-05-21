'use client';

/**
 * slider_single-mantine-v2-T34: Gamma calibration — label=null, post-release readout + Save
 */

import React, { useEffect, useState } from 'react';
import { Button, Card, Group, Slider, Stack, Switch, Text } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

export default function T34({ onSuccess }: TaskComponentProps) {
  const [gamma, setGamma] = useState(1.2);
  const [gammaLine, setGammaLine] = useState(1.2);
  const [temperature, setTemperature] = useState(0.2);
  const [appliedGamma, setAppliedGamma] = useState(1.2);
  const [appliedTemperature, setAppliedTemperature] = useState(0.2);

  useEffect(() => {
    if (
      Math.abs(appliedGamma - 1.37) <= 0.01 &&
      Math.abs(appliedTemperature - 0.2) < 0.001
    ) {
      onSuccess();
    }
  }, [appliedGamma, appliedTemperature, onSuccess]);

  const save = () => {
    setAppliedGamma(gamma);
    setAppliedTemperature(temperature);
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="sm" mb="xs">
        Color correction
      </Text>
      <Group justify="space-between" mb="sm">
        <Switch size="xs" label="Auto white balance" defaultChecked />
        <Text size="xs" c="dimmed">
          Profile: sRGB
        </Text>
      </Group>
      <Stack gap="lg">
        <div>
          <Text fw={500} size="sm" mb="xs">
            Gamma
          </Text>
          <Slider
            value={gamma}
            onChange={setGamma}
            onChangeEnd={(v) => setGammaLine(v)}
            min={1}
            max={2}
            step={0.01}
            label={null}
            data-testid="slider-gamma"
          />
          <Text size="xs" c="dimmed" mt={6}>
            Current: {gammaLine.toFixed(2)}
          </Text>
        </div>
        <div>
          <Text fw={500} size="sm" mb="xs">
            Temperature offset
          </Text>
          <Slider
            value={temperature}
            onChange={setTemperature}
            min={0}
            max={1}
            step={0.01}
            label={(v) => v.toFixed(2)}
            data-testid="slider-temperature-offset"
          />
          <Text size="xs" c="dimmed" mt={4}>
            Current: {temperature.toFixed(2)}
          </Text>
        </div>
      </Stack>
      <Group justify="flex-end" mt="md">
        <Button size="xs" onClick={save} data-testid="btn-save-correction">
          Save correction
        </Button>
      </Group>
      <Text size="xs" c="dimmed" mt="sm">
        Saved γ {appliedGamma.toFixed(2)} · temp {appliedTemperature.toFixed(2)}
      </Text>
    </Card>
  );
}
