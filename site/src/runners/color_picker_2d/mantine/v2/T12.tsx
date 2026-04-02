'use client';

/**
 * color_picker_2d-mantine-v2-T12: Nested scroll — Map pin halo; Focus ring unchanged; Save map styling
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorPicker, Group, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const FOCUS_RGBA: RGBA = { r: 90, g: 90, b: 90, a: 0.85 };
const FOCUS_INIT = 'rgba(90, 90, 90, 0.85)';
const HALO_INIT = 'rgba(200, 200, 200, 0.25)';
const TARGET_HALO: RGBA = { r: 18, g: 184, b: 134, a: 0.42 };

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [focus, setFocus] = useState(FOCUS_INIT);
  const [halo, setHalo] = useState(HALO_INIT);

  const save = () => {
    if (done.current) return;
    const f = parseRgba(focus);
    const h = parseRgba(halo);
    if (f && h && isColorWithinTolerance(f, FOCUS_RGBA, 2, 0.02) && isColorWithinTolerance(h, TARGET_HALO, 25, 0.05)) {
      done.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', width: '100%', maxWidth: 720 }}>
      <Card withBorder p="sm" style={{ flex: 1, minHeight: 200 }}>
        <Text size="sm" c="dimmed">
          Map
        </Text>
      </Card>
      <Card withBorder p={0} w={300}>
        <div style={{ maxHeight: 300, overflowY: 'auto', padding: 12 }}>
          <Text fw={600} size="sm" mb="sm">
            Map styling
          </Text>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <Text size="xs" c="dimmed">
                Block {i + 1}
              </Text>
              <div style={{ height: 36, background: '#f1f3f5', borderRadius: 4, marginTop: 4 }} />
            </div>
          ))}
          <Stack gap="md" mt="md">
            <div>
              <Text size="sm" mb={6}>
                Focus ring
              </Text>
              <ColorPicker
                format="rgba"
                value={focus}
                onChange={setFocus}
                data-testid="focus-ring"
              />
            </div>
            <div>
              <Text size="sm" mb={6}>
                Map pin halo
              </Text>
              <ColorPicker
                format="rgba"
                value={halo}
                onChange={setHalo}
                data-testid="map-pin-halo"
              />
              <Group gap={8} mt={6} align="center">
                <Text size="xs" c="dimmed">
                  Target halo
                </Text>
                <span
                  id="map-pin-halo-target-swatch"
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
                      background: rgbaCss(TARGET_HALO),
                      borderRadius: 'inherit',
                    }}
                  />
                </span>
              </Group>
            </div>
            <Button size="sm" onClick={save}>
              Save map styling
            </Button>
          </Stack>
        </div>
      </Card>
    </div>
  );
}
