'use client';

/**
 * color_picker_2d-mantine-v2-T11: Chart palette — Series C matches reference; A and B unchanged
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, ColorPicker, Group, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const INITIAL_A: RGBA = { r: 40, g: 40, b: 40, a: 1 };
const INITIAL_B: RGBA = { r: 120, g: 120, b: 200, a: 1 };
const INITIAL_C: RGBA = { r: 200, g: 80, b: 80, a: 1 };
const REFERENCE_C: RGBA = { r: 240, g: 100, b: 160, a: 0.7 };

function toStr(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [a, setA] = useState(toStr(INITIAL_A));
  const [b, setB] = useState(toStr(INITIAL_B));
  const [c, setC] = useState(toStr(INITIAL_C));

  useEffect(() => {
    if (done.current) return;
    const pa = parseRgba(a);
    const pb = parseRgba(b);
    const pc = parseRgba(c);
    if (!pa || !pb || !pc) return;
    if (
      isColorWithinTolerance(pa, INITIAL_A, 2, 0.02) &&
      isColorWithinTolerance(pb, INITIAL_B, 2, 0.02) &&
      isColorWithinTolerance(pc, REFERENCE_C, 25, 0.05)
    ) {
      done.current = true;
      onSuccess();
    }
  }, [a, b, c, onSuccess]);

  return (
    <Card shadow="sm" padding="md" withBorder w={520}>
      <Text fw={600} mb="xs">
        Chart palette
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        Metrics · legend · exports
      </Text>
      <Stack gap="md">
        {[
          { label: 'Series A', value: a, onChange: setA, ref: null as RGBA | null },
          { label: 'Series B', value: b, onChange: setB, ref: null },
          { label: 'Series C', value: c, onChange: setC, ref: REFERENCE_C },
        ].map((row) => (
          <Group key={row.label} justify="space-between" align="flex-start" wrap="nowrap">
            <Text size="sm" w={72}>
              {row.label}
            </Text>
            <ColorPicker
              format="rgba"
              value={row.value}
              onChange={row.onChange}
              data-testid={row.label.toLowerCase().replace(/\s+/g, '-')}
            />
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
                width: 28,
                height: 22,
                borderRadius: 4,
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
                  background: rgbaCss(parseRgba(row.value) || INITIAL_A),
                  borderRadius: 'inherit',
                }}
              />
            </span>
            {row.ref && (
              <span
                id="series-c-reference-chip"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: 28,
                  height: 22,
                  borderRadius: 4,
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
                    background: rgbaCss(row.ref),
                    borderRadius: 'inherit',
                  }}
                />
              </span>
            )}
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
