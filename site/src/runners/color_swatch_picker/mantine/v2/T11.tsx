'use client';

/**
 * color_swatch_picker-mantine-v2-T11: Edit alert banner — Background #fd7e14, Apply banner
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Text, Stack, ColorInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../../types';

const TARGET = '#fd7e14';

const WARM = ['#fd7e14', '#fab005', '#ff922b', '#fa5252', '#e64980', '#868e96', ...MANTINE_SWATCHES];

export default function T11({ task: _task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const doneRef = useRef(false);

  const INIT_BORDER = '#7950f2';
  const INIT_BG = '#e9ecef';

  const [dBorder, setDBorder] = useState(INIT_BORDER);
  const [dBg, setDBg] = useState(INIT_BG);
  const [cBorder, setCBorder] = useState(INIT_BORDER);
  const [cBg, setCBg] = useState(INIT_BG);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(cBg, TARGET) && hexMatches(cBorder, INIT_BORDER)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cBg, cBorder, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button onClick={() => setOpened(true)}>Edit alert banner</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Edit alert banner" centered>
        <Stack gap="md">
          <ColorInput
            label="Border"
            value={dBorder}
            onChange={setDBorder}
            format="hex"
            swatches={WARM}
            withPicker={false}
            disallowInput
            swatchesPerRow={6}
          />
          <ColorInput
            label="Background"
            value={dBg}
            onChange={setDBg}
            format="hex"
            swatches={WARM}
            withPicker={false}
            disallowInput
            swatchesPerRow={6}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setCBorder(dBorder);
                setCBg(dBg);
              }}
            >
              Apply banner
            </Button>
          </Group>
        </Stack>
        <div data-testid="banner-background-committed" style={{ display: 'none' }}>
          {normalizeHex(cBg)}
        </div>
      </Modal>
    </div>
  );
}
