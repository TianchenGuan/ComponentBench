'use client';

/**
 * color_swatch_picker-mantine-v2-T09: Edit pill colors — Pill fill #364fc7, Save pill colors
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Text, ColorInput } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { normalizeHex, hexMatches, MANTINE_SWATCHES } from '../../types';

const TARGET = '#364fc7';

const SWATCHES = [...MANTINE_SWATCHES, '#364fc7', '#4c6ef5', '#5c7cfa'];

export default function T09({ task: _task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const doneRef = useRef(false);

  const INIT_TEXT = '#868e96';
  const INIT_FILL = '#fab005';

  const [dFill, setDFill] = useState(INIT_FILL);
  const [dText, setDText] = useState(INIT_TEXT);
  const [cFill, setCFill] = useState(INIT_FILL);
  const [cText, setCText] = useState(INIT_TEXT);

  useEffect(() => {
    if (doneRef.current) return;
    if (hexMatches(cFill, TARGET) && hexMatches(cText, INIT_TEXT)) {
      doneRef.current = true;
      onSuccess();
    }
  }, [cFill, cText, onSuccess]);

  return (
    <div style={{ padding: 8 }}>
      <Button onClick={() => setOpen(true)}>Edit pill colors</Button>
      <Drawer opened={open} onClose={() => setOpen(false)} title="Edit pill colors" position="right" size="md">
        <Text size="sm" c="dimmed" mb="md">
          Swatches only — typing is disabled.
        </Text>
        <div data-testid="pill-text" style={{ marginBottom: 12 }}>
          <ColorInput
            label="Pill text"
            value={dText}
            onChange={setDText}
            format="hex"
            swatches={SWATCHES}
            withPicker={false}
            disallowInput
            swatchesPerRow={5}
          />
        </div>
        <div data-testid="pill-fill" style={{ marginBottom: 24 }}>
          <ColorInput
            label="Pill fill"
            value={dFill}
            onChange={setDFill}
            format="hex"
            swatches={SWATCHES}
            withPicker={false}
            disallowInput
            swatchesPerRow={5}
          />
        </div>
        <Button
          onClick={() => {
            setCFill(dFill);
            setCText(dText);
          }}
        >
          Save pill colors
        </Button>
        <div data-testid="pill-fill-committed" style={{ display: 'none' }}>
          {normalizeHex(cFill)}
        </div>
      </Drawer>
    </div>
  );
}
