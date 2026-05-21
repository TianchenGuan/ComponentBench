'use client';

/**
 * alpha_slider-mantine-v2-T14: Selection tint alpha inside rgba ColorPicker
 *
 * Selection tint alpha 0.55 ±0.03; RGB stays (28,126,214); Background tint unchanged; Save selection styling.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Text, Stack, ColorPicker, Button, Paper, Select } from '@mantine/core';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const INITIAL_SELECTION = 'rgba(28, 126, 214, 1)';
const INITIAL_BACKGROUND = 'rgba(134, 142, 150, 0.4)';

function parseRgba(s: string): { r: number; g: number; b: number; a: number } | null {
  const m = s.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return {
    r: parseFloat(m[1]),
    g: parseFloat(m[2]),
    b: parseFloat(m[3]),
    a: m[4] !== undefined ? parseFloat(m[4]) : 1,
  };
}

function rgbaEqual(a: string, b: string): boolean {
  const x = parseRgba(a);
  const y = parseRgba(b);
  if (!x || !y) return false;
  return x.r === y.r && x.g === y.g && x.b === y.b && Math.abs(x.a - y.a) < 0.001;
}

export default function T14({ onSuccess }: TaskComponentProps) {
  const [dSel, setDSel] = useState(INITIAL_SELECTION);
  const [dBg, setDBg] = useState(INITIAL_BACKGROUND);
  const [cSel, setCSel] = useState(INITIAL_SELECTION);
  const [cBg, setCBg] = useState(INITIAL_BACKGROUND);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const p = parseRgba(cSel);
    if (
      p &&
      p.r === 28 &&
      p.g === 126 &&
      p.b === 214 &&
      isAlphaWithinTolerance(p.a, 0.55, 0.03) &&
      rgbaEqual(cBg, INITIAL_BACKGROUND)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [cSel, cBg, onSuccess]);

  const save = () => {
    setCSel(dSel);
    setCBg(dBg);
  };

  return (
    <div style={{ padding: 8, maxWidth: 440 }}>
      <Paper p="md" withBorder>
        <Select
          label="Theme density"
          placeholder="Pick one"
          data={['comfortable', 'compact']}
          defaultValue="compact"
          mb="md"
        />
        <Text fw={600} mb="sm">
          Selection styling
        </Text>
        <Stack gap="md">
          <div>
            <Text size="sm" mb={6}>
              Selection tint
            </Text>
            <ColorPicker format="rgba" value={dSel} onChange={setDSel} />
          </div>
          <div>
            <Text size="sm" mb={6}>
              Background tint
            </Text>
            <ColorPicker format="rgba" value={dBg} onChange={setDBg} />
          </div>
          <Button onClick={save}>Save selection styling</Button>
        </Stack>
      </Paper>
    </div>
  );
}
