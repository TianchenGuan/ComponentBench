'use client';

/**
 * color_swatch_picker-mantine-v2-T16: Edit avatar ring — match sample-c, Save ring color
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Text, Group, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../../types';

const SAMPLE_C = '#f06595';

const SWATCHES = [...MANTINE_SWATCHES, '#f783ac', '#f06595', '#e64980', '#c2255c', '#be4bdb', '#7950f2'];

export default function T16({ task: _task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const doneRef = useRef(false);

  const INIT = '#868e96';
  const [draft, setDraft] = useState(INIT);
  const [committed, setCommitted] = useState(INIT);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(committed, SAMPLE_C)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button onClick={() => setOpen(true)}>Edit avatar ring</Button>
      <Drawer opened={open} onClose={() => setOpen(false)} title="Edit avatar ring" position="right" size="sm">
        <Group align="center" gap="sm" mb="md" wrap="nowrap">
          <Text size="sm" fw={500}>
            Avatar ring color
          </Text>
          <div
            data-testid="sample-c"
            data-color={SAMPLE_C}
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: SAMPLE_C,
              border: '2px solid var(--mantine-color-dark-4)',
            }}
          />
          <Text size="xs" c="dimmed">
            Sample C
          </Text>
        </Group>
        <ColorInput
          label="Avatar ring color"
          value={draft}
          onChange={setDraft}
          format="hex"
          swatches={SWATCHES}
          withPicker={false}
          disallowInput
          swatchesPerRow={6}
          mb="xl"
        />
        <Button
          onClick={() => {
            setCommitted(draft);
          }}
        >
          Save ring color
        </Button>
        <div data-testid="avatar-ring-committed" style={{ display: 'none' }}>
          {normalizeHex(committed)}
        </div>
      </Drawer>
    </div>
  );
}
