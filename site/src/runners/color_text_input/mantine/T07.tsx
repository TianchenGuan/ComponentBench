'use client';

/**
 * color_text_input-mantine-T07: Enter HEXA with alpha in Mantine ColorInput
 *
 * Layout: isolated_card centered with one ColorInput labeled 'Tooltip background (hexa)'.
 * Component: Mantine ColorInput configured with format='hexa'. The input accepts 8-digit hex
 * values (#RRGGBBAA) and shows an opacity-aware preview.
 *
 * Initial state: #000000b3 (black with 70% alpha).
 * Feedback: valid HEXA updates the preview over a checker pattern; invalid length/characters show an error.
 *
 * Success: Tooltip background parses to RGBA(34, 139, 230, ~0.80) within tolerance.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, hexToRgba } from '../types';

const TARGET_RGBA = { r: 34, g: 139, b: 230, a: 0.8 };

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#000000b3');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = hexToRgba(value);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0.01)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getOverlayColor = (): string => {
    if (!parsedColor) return 'rgba(0,0,0,0)';
    return `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${parsedColor.a})`;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Tooltip Settings</Text>
      
      {/* Preview with checkerboard */}
      <Text size="sm" c="dimmed" mb="xs">Preview</Text>
      <Box
        mb="md"
        style={{
          width: '100%',
          height: 60,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          borderRadius: 8,
          position: 'relative',
          border: '1px solid #e0e0e0',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: getOverlayColor(),
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text c="white" size="sm">Tooltip text</Text>
        </Box>
      </Box>
      
      <ColorInput
        label="Tooltip background (hexa)"
        description="Format: #RRGGBBAA (8 hex digits)"
        value={value}
        onChange={setValue}
        format="hexa"
        data-testid="tooltip-background-input"
      />
    </Card>
  );
}
