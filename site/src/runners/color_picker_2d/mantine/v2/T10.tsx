'use client';

/**
 * color_picker_2d-mantine-v2-T10: Drawer — Tooltip background matches target chip; ColorInput picker only
 */

import React, { useRef, useState } from 'react';
import { Button, Card, ColorInput, Drawer, Group, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const BORDER_INIT = 'rgba(40, 40, 40, 1)';
const BORDER_RGBA: RGBA = { r: 40, g: 40, b: 40, a: 1 };
const BG_INIT = 'rgba(200, 200, 200, 0.3)';
const TARGET_BG: RGBA = { r: 88, g: 62, b: 140, a: 0.72 };

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [open, setOpen] = useState(false);
  const [committedBg, setCommittedBg] = useState(BG_INIT);
  const [committedBorder, setCommittedBorder] = useState(BORDER_INIT);
  const [draftBg, setDraftBg] = useState(BG_INIT);
  const [draftBorder, setDraftBorder] = useState(BORDER_INIT);

  const openDrawer = () => {
    setDraftBg(committedBg);
    setDraftBorder(committedBorder);
    setOpen(true);
  };

  const apply = () => {
    setCommittedBg(draftBg);
    setCommittedBorder(draftBorder);
    setOpen(false);
    if (done.current) return;
    const bg = parseRgba(draftBg);
    const br = parseRgba(draftBorder);
    if (bg && br && isColorWithinTolerance(bg, TARGET_BG, 25, 0.05) && isColorWithinTolerance(br, BORDER_RGBA, 2, 0.02)) {
      done.current = true;
      onSuccess();
    }
  };

  const cur = parseRgba(draftBg);

  return (
    <Card shadow="sm" padding="md" withBorder w={400}>
      <Button onClick={openDrawer}>Edit tooltip theme</Button>
      <Drawer
        opened={open}
        onClose={() => setOpen(false)}
        title="Tooltip theme"
        position="right"
        padding="md"
      >
        <Stack gap="md">
          <ColorInput
            label="Tooltip background"
            format="rgba"
            value={draftBg}
            onChange={setDraftBg}
            disallowInput
            withPicker
            data-testid="tooltip-background"
          />
          <ColorInput
            label="Tooltip border"
            format="rgba"
            value={draftBorder}
            onChange={setDraftBorder}
            disallowInput
            withPicker
            data-testid="tooltip-border"
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
                  width: 72,
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
                id="tooltip-target-chip"
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginTop: 6,
                  width: 72,
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
                    background: rgbaCss(TARGET_BG),
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
            <Button onClick={apply}>Apply tooltip theme</Button>
          </Group>
        </Stack>
      </Drawer>
    </Card>
  );
}
