'use client';

/**
 * color_picker_2d-mantine-v2-T15: Four card accents — Card C matches reference; Apply accents
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const REF_C: RGBA = { r: 255, g: 140, b: 0, a: 0.6 };
const A0: RGBA = { r: 60, g: 60, b: 60, a: 1 };
const B0: RGBA = { r: 100, g: 140, b: 200, a: 1 };
const C0: RGBA = { r: 200, g: 50, b: 50, a: 1 };
const D0: RGBA = { r: 150, g: 150, b: 50, a: 1 };

function toStr(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T15({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [a, setA] = useState(toStr(A0));
  const [b, setB] = useState(toStr(B0));
  const [c, setC] = useState(toStr(C0));
  const [d, setD] = useState(toStr(D0));

  const apply = () => {
    if (done.current) return;
    const pa = parseRgba(a);
    const pb = parseRgba(b);
    const pc = parseRgba(c);
    const pd = parseRgba(d);
    if (
      pa &&
      pb &&
      pc &&
      pd &&
      isColorWithinTolerance(pa, A0, 2, 0.02) &&
      isColorWithinTolerance(pb, B0, 2, 0.02) &&
      isColorWithinTolerance(pd, D0, 2, 0.02) &&
      isColorWithinTolerance(pc, REF_C, 25, 0.05)
    ) {
      done.current = true;
      onSuccess();
    }
  };

  const cards = [
    { id: 'A', label: 'Card A', value: a, set: setA, ref: null as RGBA | null },
    { id: 'B', label: 'Card B', value: b, set: setB, ref: null },
    { id: 'C', label: 'Card C', value: c, set: setC, ref: REF_C },
    { id: 'D', label: 'Card D', value: d, set: setD, ref: null },
  ];

  return (
    <Card shadow="sm" padding="md" withBorder w={640}>
      <Text fw={600} mb="xs">
        Dashboard accents
      </Text>
      <Text size="xs" c="dimmed" mb="md">
        Exports · sharing · layout
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {cards.map((card) => (
          <Card key={card.id} withBorder padding="sm" radius="md">
            <Text size="sm" fw={600} mb="xs">
              {card.label}
            </Text>
            <ColorPicker
              format="rgba"
              value={card.value}
              onChange={card.set}
              data-testid={`accent-${card.id.toLowerCase()}`}
            />
            <Group gap={8} mt="sm">
              <span
                title="live"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: 24,
                  height: 18,
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
                    background: rgbaCss(parseRgba(card.value) || A0),
                    borderRadius: 'inherit',
                  }}
                />
              </span>
              {card.ref && (
                <span
                  id="card-c-reference-chip"
                  title="reference"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: 24,
                    height: 18,
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
                      background: rgbaCss(card.ref),
                      borderRadius: 'inherit',
                    }}
                  />
                </span>
              )}
            </Group>
          </Card>
        ))}
      </SimpleGrid>
      <Button fullWidth mt="md" onClick={apply}>
        Apply accents
      </Button>
    </Card>
  );
}
