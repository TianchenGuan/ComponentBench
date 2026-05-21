'use client';

/**
 * alpha_slider-mantine-v2-T16: Dark modal scrim visual match
 *
 * AlphaSlider until Current matches Target; Save scrim. Reference: mantine-scrim-target
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Text, Stack, AlphaSlider } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const SCRIM_HEX = '#000000';
const TARGET_ALPHA = 0.41;

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [draft, setDraft] = useState(0.75);
  const [committed, setCommitted] = useState(0.75);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (isAlphaWithinTolerance(committed, TARGET_ALPHA, 0.03)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const preview = (alpha: number, label: string, testId?: string) => (
    <div style={{ flex: 1 }}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <div
        data-testid={testId}
        style={{
          marginTop: 8,
          height: 100,
          borderRadius: 8,
          position: 'relative',
          backgroundImage: `
            linear-gradient(45deg, #555 25%, transparent 25%),
            linear-gradient(-45deg, #555 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #555 75%),
            linear-gradient(-45deg, transparent 75%, #555 75%)
          `,
          backgroundSize: '14px 14px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            backgroundColor: hexToRgba(SCRIM_HEX, alpha),
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: 8 }}>
      <Button onClick={() => setOpened(true)}>Edit scrim</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit scrim" centered>
        <Stack gap="md">
          <div style={{ display: 'flex', gap: 12 }}>
            {preview(draft, 'Current')}
            {preview(TARGET_ALPHA, 'Target', 'mantine-scrim-target')}
          </div>
          <Text size="sm" fw={500}>
            Scrim opacity
          </Text>
          <AlphaSlider color={SCRIM_HEX} value={draft} onChange={setDraft} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCommitted(draft)}>Save scrim</Button>
          </div>
        </Stack>
      </Modal>
    </div>
  );
}
