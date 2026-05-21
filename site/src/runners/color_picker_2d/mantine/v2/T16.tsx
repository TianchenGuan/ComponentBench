'use client';

/**
 * color_picker_2d-mantine-v2-T16: Drawer — Sidebar active state matches target chip; Save state colors
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorInput, Drawer, Group, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const TARGET: RGBA = { r: 140, g: 200, b: 255, a: 0.45 };
const INIT = 'rgba(90, 90, 90, 0.25)';

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState(INIT);
  const [draft, setDraft] = useState(INIT);

  const openDrawer = () => {
    setDraft(committed);
    setOpen(true);
  };

  const save = () => {
    setCommitted(draft);
    setOpen(false);
    if (done.current) return;
    const v = parseRgba(draft);
    if (v && isColorWithinTolerance(v, TARGET, 25, 0.05)) {
      done.current = true;
      onSuccess();
    }
  };

  const cur = parseRgba(draft);

  return (
    <Card shadow="sm" padding="md" withBorder w={400}>
      <Button onClick={openDrawer}>Edit sidebar state</Button>
      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title="Sidebar state"
        position="right"
        padding="md"
      >
        <Stack gap="md">
          <ColorInput
            label="Sidebar active state"
            format="rgba"
            value={draft}
            onChange={setDraft}
            disallowInput
            withPicker
            data-testid="sidebar-active-state"
          />
          <Group gap="lg">
            <div>
              <Text size="xs" c="dimmed">
                Current
              </Text>
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginTop: 6,
                  width: 80,
                  height: 28,
                  borderRadius: 4,
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
                    background: cur ? rgbaCss(cur) : 'transparent',
                    borderRadius: 'inherit',
                  }}
                />
              </span>
            </div>
            <div>
              <Text size="xs" c="dimmed">
                Target
              </Text>
              <span
                id="sidebar-state-target-chip"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginTop: 6,
                  width: 80,
                  height: 28,
                  borderRadius: 4,
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
                    background: rgbaCss(TARGET),
                    borderRadius: 'inherit',
                  }}
                />
              </span>
            </div>
          </Group>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save state colors</Button>
          </Group>
        </Stack>
      </Drawer>
    </Card>
  );
}
