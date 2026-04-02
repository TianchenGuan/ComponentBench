'use client';

/**
 * color_picker_2d-mantine-v2-T13: Modal — Selection background exact rgba; Save selection styling
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Checkbox, ColorPicker, Modal, Select, Stack, Text } from '@mantine/core';
import type { TaskComponentProps, RGBA } from '../../types';
import { isColorWithinTolerance, parseRgba } from '../../types';

const TARGET: RGBA = { r: 77, g: 110, b: 245, a: 0.38 };
const INIT = 'rgba(200, 200, 200, 0.5)';

function rgbaCss(r: RGBA) {
  return `rgba(${r.r}, ${r.g}, ${r.b}, ${r.a})`;
}

export default function T13({ onSuccess }: TaskComponentProps) {
  const done = useRef(false);
  const [opened, setOpened] = useState(false);
  const [committed, setCommitted] = useState(INIT);
  const [draft, setDraft] = useState(INIT);

  const open = () => {
    setDraft(committed);
    setOpened(true);
  };

  const save = () => {
    setCommitted(draft);
    setOpened(false);
    if (done.current) return;
    const v = parseRgba(draft);
    if (v && isColorWithinTolerance(v, TARGET, 35, 0.05)) {
      done.current = true;
      onSuccess();
    }
  };

  const live = parseRgba(draft);

  return (
    <Card
      shadow="sm"
      padding="md"
      withBorder
      w={380}
      style={{ background: '#000', borderColor: '#333' }}
    >
      <Text c="white" fw={600} mb="sm">
        Selection
      </Text>
      <div
        style={{
          position: 'relative',
          height: 40,
          borderRadius: 6,
          marginBottom: 12,
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
            background: live ? rgbaCss(live) : '#333',
            borderRadius: 'inherit',
          }}
        />
      </div>
      <Button onClick={open}>Edit selection styling</Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Edit selection styling"
        styles={{ content: { background: '#000' } }}
      >
        <Stack gap="md">
          <Checkbox defaultChecked label="Show selection handles" styles={{ label: { color: '#fff' } }} />
          <Select
            label="Font weight"
            data={['400', '500', '600']}
            defaultValue="500"
            styles={{ label: { color: '#fff' } }}
          />
          <div>
            <Text size="sm" c="gray.4" mb={6}>
              Selection background
            </Text>
            <ColorPicker format="rgba" value={draft} onChange={setDraft} data-testid="selection-bg" />
          </div>
          <div
            style={{
              position: 'relative',
              marginTop: 8,
              height: 48,
              borderRadius: 6,
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
                background: live ? rgbaCss(live) : '#222',
                borderRadius: 'inherit',
              }}
            />
          </div>
          <Text size="xs" c="dimmed" mt={8} mb={4}>
            Target
          </Text>
          <span
            id="selection-bg-target-preview"
            style={{
              position: 'relative',
              display: 'block',
              width: '100%',
              height: 48,
              borderRadius: 6,
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
          <Text size="xs" c="dimmed">
            Target ≈ rgba(77, 110, 245, 0.38)
          </Text>
          <Stack gap="xs" mt="md">
            <Button fullWidth onClick={save}>
              Save selection styling
            </Button>
            <Button variant="default" fullWidth onClick={() => setOpened(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </Card>
  );
}
