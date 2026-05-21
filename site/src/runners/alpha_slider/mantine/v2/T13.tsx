'use client';

/**
 * alpha_slider-mantine-v2-T13: Secondary overlay among four visible AlphaSliders
 *
 * Secondary alpha 0.61 ±0.03; Primary, Tertiary, Neutral unchanged; Apply overlays.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Text, Stack, AlphaSlider, Button, Paper, SimpleGrid } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const ROWS: { key: string; label: string; color: string; initial: number }[] = [
  { key: 'p', label: 'Primary overlay', color: '#228be6', initial: 0.9 },
  { key: 's', label: 'Secondary overlay', color: '#40c057', initial: 0.5 },
  { key: 't', label: 'Tertiary overlay', color: '#fd7e14', initial: 0.7 },
  { key: 'n', label: 'Neutral overlay', color: '#868e96', initial: 0.35 },
];

function hexToRgba(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function T13({ onSuccess }: TaskComponentProps) {
  const initialMap = Object.fromEntries(ROWS.map((r) => [r.key, r.initial])) as Record<string, number>;
  const [draft, setDraft] = useState<Record<string, number>>(() => ({ ...initialMap }));
  const [committed, setCommitted] = useState<Record<string, number>>(() => ({ ...initialMap }));
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const sec = committed.s;
    const ok =
      isAlphaWithinTolerance(sec, 0.61, 0.03) &&
      committed.p === ROWS[0].initial &&
      committed.t === ROWS[2].initial &&
      committed.n === ROWS[3].initial;
    if (ok) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const apply = () => setCommitted({ ...draft });

  return (
    <div style={{ padding: 8, maxWidth: 640 }}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={8} mb="md">
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} p="xs" withBorder bg="dark.7">
            <Text size="xs" c="dimmed">
              Metric {i}
            </Text>
            <Text size="lg" c="white">
              {100 + i * 13}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>
      <Paper p="md" withBorder bg="dark.8">
        <Text fw={600} mb="md" c="white">
          Overlay dashboard
        </Text>
        <Stack gap="lg">
          {ROWS.map((row) => (
            <div key={row.key}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <Text size="sm" c="dimmed">
                    {row.label}
                  </Text>
                  <div
                    style={{
                      marginTop: 6,
                      height: 36,
                      borderRadius: 6,
                      position: 'relative',
                      backgroundImage: `
                        linear-gradient(45deg, #444 25%, transparent 25%),
                        linear-gradient(-45deg, #444 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #444 75%),
                        linear-gradient(-45deg, transparent 75%, #444 75%)
                      `,
                      backgroundSize: '8px 8px',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 6,
                        backgroundColor: hexToRgba(row.color, draft[row.key]),
                      }}
                    />
                  </div>
                </div>
              </div>
              <AlphaSlider mt="xs" color={row.color} value={draft[row.key]} onChange={(v) => setDraft((d) => ({ ...d, [row.key]: v }))} />
            </div>
          ))}
          <Button onClick={apply} fullWidth>
            Apply overlays
          </Button>
        </Stack>
      </Paper>
    </div>
  );
}
