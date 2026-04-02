'use client';

/**
 * color_swatch_picker-mantine-v2-T14: Secondary ring matches secondary-ring-sample, Apply ring colors
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Group, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../../types';

const SECONDARY_REF = '#be4bdb';

const SWATCHES = [...MANTINE_SWATCHES, '#da77f2', '#cc5de8', '#be4bdb', '#ae3ec9', '#f783ac', '#e64980'];

const INIT = { primary: '#228be6', secondary: '#868e96', tertiary: '#fab005' };

export default function T14({ task: _task, onSuccess }: TaskComponentProps) {
  const doneRef = useRef(false);

  const [d, setD] = useState({ ...INIT });
  const [c, setC] = useState({ ...INIT });

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(c.secondary, SECONDARY_REF) &&
      hexMatches(c.primary, INIT.primary) &&
      hexMatches(c.tertiary, INIT.tertiary)
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [c, onSuccess]);

  const row = (label: string, key: keyof typeof d, refId?: string, refHex?: string) => (
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm" mb="md">
      <Text size="sm" w={130}>
        {label}
      </Text>
      {refHex && (
        <div
          data-testid={refId}
          data-color={refHex}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: refHex,
            border: '1px solid #ccc',
            flexShrink: 0,
            marginTop: 22,
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <ColorInput
          value={d[key]}
          onChange={(v) => setD((s) => ({ ...s, [key]: v }))}
          format="hex"
          swatches={SWATCHES}
          withPicker={false}
          disallowInput
          swatchesPerRow={6}
          size="xs"
        />
      </div>
    </Group>
  );

  return (
    <Card withBorder padding="md" maw={520}>
      <Text fw={600} mb="md">
        Ring colors
      </Text>
      {row('Primary ring color', 'primary')}
      {row('Secondary ring color', 'secondary', 'secondary-ring-sample', SECONDARY_REF)}
      {row('Tertiary ring color', 'tertiary')}
      <Button size="sm" onClick={() => setC({ ...d })}>
        Apply ring colors
      </Button>
      <div data-testid="secondary-ring-committed" style={{ display: 'none' }}>
        {normalizeHex(c.secondary)}
      </div>
    </Card>
  );
}
