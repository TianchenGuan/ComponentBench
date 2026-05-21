'use client';

/**
 * color_text_input-mantine-T02: Set Footer background when two Mantine ColorInputs are present
 *
 * Layout: form_section titled 'Layout colors' containing two stacked Mantine ColorInputs.
 * Instances: 2 ColorInputs labeled 'Header background' and 'Footer background'.
 * Both show a preview swatch inside the input.
 *
 * Initial state: Header background=#f8f9fa, Footer background=#343a40.
 * Distractors: the inputs have the same placeholder ('Pick color') and identical icons.
 * Feedback: each input shows an error message if invalid and updates its preview swatch when valid.
 *
 * Success: Footer background parses to RGBA(18, 184, 134, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 18, g: 184, b: 134, a: 1 };

export default function T02({ onSuccess }: TaskComponentProps) {
  const [headerBg, setHeaderBg] = useState('#f8f9fa');
  const [footerBg, setFooterBg] = useState('#343a40');
  const [hasCompleted, setHasCompleted] = useState(false);

  const footerParsed = hexToRgba(footerBg);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (footerParsed && isColorWithinTolerance(footerParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [footerParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Layout colors</Text>
      
      <Stack gap="md">
        <ColorInput
          label="Header background"
          value={headerBg}
          onChange={setHeaderBg}
          format="hex"
          placeholder="Pick color"
          data-testid="header-background-input"
        />
        
        <ColorInput
          label="Footer background"
          value={footerBg}
          onChange={setFooterBg}
          format="hex"
          placeholder="Pick color"
          data-testid="footer-background-input"
        />
      </Stack>
    </Card>
  );
}
