'use client';

/**
 * color_swatch_picker-mantine-v2-T15: Toolbar Selection color matches toolbar-selection-sample
 */

import React, { useState, useEffect, useRef } from 'react';
import { Group, Text, Button, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, GRAYSCALE_SWATCHES } from '../../types';

const SAMPLE = '#64748b';

const SWATCHES = [
  ...GRAYSCALE_SWATCHES.slice(0, 28),
  '#64748b',
  '#475569',
  '#94a3b8',
  '#cbd5e1',
  '#228be6',
  '#4c6ef5',
  '#15aabf',
];

export default function T15({ task: _task, onSuccess }: TaskComponentProps) {
  const doneRef = useRef(false);

  const INIT = '#adb5bd';
  const [draft, setDraft] = useState(INIT);
  const [committed, setCommitted] = useState(INIT);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(committed, SAMPLE)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <div style={{ padding: 4, maxWidth: 360 }}>
      <Group gap="xs" align="flex-end" wrap="wrap">
        <div
          data-testid="toolbar-selection-sample"
          data-color={SAMPLE}
          title="Sample"
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: SAMPLE,
            border: '1px solid #fff',
            marginBottom: 4,
          }}
        />
        <div style={{ flex: '1 1 180px', minWidth: 160 }}>
          <ColorInput
            label="Selection color"
            value={draft}
            onChange={setDraft}
            format="hex"
            swatches={SWATCHES}
            withPicker={false}
            disallowInput
            swatchesPerRow={8}
            size="xs"
          />
        </div>
        <Button size="xs" onClick={() => setCommitted(draft)}>
          Apply toolbar colors
        </Button>
      </Group>
      <div data-testid="toolbar-selection-committed" style={{ display: 'none' }}>
        {normalizeHex(committed)}
      </div>
    </div>
  );
}
