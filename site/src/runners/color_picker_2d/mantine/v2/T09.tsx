'use client';

/**
 * color_picker_2d-mantine-v2-T09: Surface tokens — Secondary tint target; Primary unchanged; Save
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const PRIMARY_RGBA: RGBA = { r: 100, g: 100, b: 100, a: 1 };
const PRIMARY_INIT = 'rgba(100, 100, 100, 1)';
const SECONDARY_INIT = 'rgba(28, 126, 214, 1)';
const TARGET_SECONDARY: RGBA = { r: 55, g: 160, b: 220, a: 0.55 };

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [primary, setPrimary] = useState(PRIMARY_INIT);
  const [secondary, setSecondary] = useState(SECONDARY_INIT);

  const save = () => {
    if (done.current) return;
    const p = parseRgba(primary);
    const s = parseRgba(secondary);
    if (p && s && isColorWithinTolerance(p, PRIMARY_RGBA, 2, 0.02) && isColorWithinTolerance(s, TARGET_SECONDARY, 25, 0.05)) {
      done.current = true;
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder w={440}>
      <Text fw={600} mb="sm">
        Surface tokens
      </Text>
      <Stack gap="sm" mb="md">
        <TextInput label="Panel title" defaultValue="Overview" size="xs" />
        <Select
          label="Spacing scale"
          size="xs"
          data={['4px', '8px', '12px']}
          defaultValue="8px"
        />
      </Stack>
      <Stack gap="md">
        <div>
          <Text size="sm" mb={6}>
            Primary surface tint
          </Text>
          <ColorPicker
            format="rgba"
            value={primary}
            onChange={setPrimary}
            data-testid="primary-surface-tint"
          />
        </div>
        <div>
          <Text size="sm" mb={6}>
            Secondary surface tint
          </Text>
          <ColorPicker
            format="rgba"
            value={secondary}
            onChange={setSecondary}
            data-testid="secondary-surface-tint"
          />
        </div>
        <Button onClick={save}>Save surface tokens</Button>
      </Stack>
      <Text size="xs" c="dimmed" mt="sm">
        Secondary ≈ rgba(55, 160, 220, 0.55); keep Primary unchanged.
      </Text>
      <Group gap={8} mt={6} align="center">
        <Text size="xs" c="dimmed">
          Target secondary
        </Text>
        <span
          id="secondary-surface-target-swatch"
          style={{
            position: 'relative',
            display: 'inline-block',
            width: 120,
            height: 48,
            borderRadius: 6,
            border: '1px solid #ced4da',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: rgbaCss(TARGET_SECONDARY),
              borderRadius: 'inherit',
            }}
          />
        </span>
      </Group>
    </Card>
  );
}
