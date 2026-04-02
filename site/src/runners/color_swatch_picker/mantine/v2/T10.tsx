'use client';

/**
 * color_swatch_picker-mantine-v2-T10: Billing tag matches billing-tag-sample, Apply tag colors
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Group, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES, EXTENDED_MANTINE_SWATCHES } from '../../types';

const BILLING_REF = '#e64980';

const SWATCHES = Array.from(
  new Set([...MANTINE_SWATCHES, ...EXTENDED_MANTINE_SWATCHES.slice(0, 24), BILLING_REF]),
);

const INIT = { ops: '#228be6', docs: '#40c057', billing: '#868e96', qa: '#fab005' };

export default function T10({ task: _task, onSuccess }: TaskComponentProps) {
  const doneRef = useRef(false);

  const [d, setD] = useState({ ...INIT });
  const [c, setC] = useState({ ...INIT });

  useEffect(() => {
    if (doneRef.current) return;
    if (
      hexMatches(c.billing, BILLING_REF) &&
      hexMatches(c.ops, INIT.ops) &&
      hexMatches(c.docs, INIT.docs) &&
      hexMatches(c.qa, INIT.qa)
    ) {
      doneRef.current = true;
      onSuccess();
    }
  }, [c, onSuccess]);

  const row = (label: string, key: keyof typeof d, sampleTestId?: string, refColor?: string) => (
    <Group justify="space-between" align="center" wrap="nowrap" gap="sm" mb="sm">
      <Text size="sm" w={100}>
        {label}
      </Text>
      {refColor && (
        <div
          data-testid={sampleTestId}
          data-color={refColor}
          style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            background: refColor,
            border: '1px solid var(--mantine-color-dark-4)',
            flexShrink: 0,
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <ColorInput
          value={d[key]}
          onChange={(v) => setD((s) => ({ ...s, [key]: v }))}
          format="hex"
          swatches={SWATCHES}
          withPicker={false}
          disallowInput
          swatchesPerRow={7}
          size="xs"
        />
      </div>
    </Group>
  );

  return (
    <Card withBorder padding="md" maw={520}>
      <Text fw={600} mb="md">
        Tag colors
      </Text>
      {row('Ops tag', 'ops')}
      {row('Docs tag', 'docs')}
      {row('Billing tag', 'billing', 'billing-tag-sample', BILLING_REF)}
      {row('QA tag', 'qa')}
      <Button mt="md" size="sm" onClick={() => setC({ ...d })}>
        Apply tag colors
      </Button>
      <div data-testid="billing-tag-committed" style={{ display: 'none' }}>
        {normalizeHex(c.billing)}
      </div>
    </Card>
  );
}
