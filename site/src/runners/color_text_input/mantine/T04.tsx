'use client';

/**
 * color_text_input-mantine-T04: Enter RGBA with alpha in Mantine ColorInput
 *
 * Layout: settings_panel titled 'Overlays' with several descriptive rows.
 * Component: Mantine ColorInput configured with format='rgba' so the input expects/shows
 * an RGBA string. The component includes the usual preview swatch.
 *
 * Initial state: Overlay color is rgba(0, 0, 0, 0.40).
 * Clutter: a Checkbox for 'Enable overlay' and a Slider for 'Blur' are nearby but not required.
 * Feedback: valid RGBA updates the preview; invalid formatting shows an error message.
 *
 * Success: Overlay color parses to RGBA(34, 139, 230, 0.75) within alpha tolerance.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, Checkbox, Slider, Stack, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, parseRgbString } from '../types';

const TARGET_RGBA = { r: 34, g: 139, b: 230, a: 0.75 };

export default function T04({ onSuccess }: TaskComponentProps) {
  const [overlayColor, setOverlayColor] = useState('rgba(0, 0, 0, 0.40)');
  const [enableOverlay, setEnableOverlay] = useState(true);
  const [blur, setBlur] = useState(5);
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = parseRgbString(overlayColor);

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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Overlays</Text>
      
      <Stack gap="md">
        <ColorInput
          label="Overlay color"
          description="Enter rgba format: rgba(r, g, b, a)"
          value={overlayColor}
          onChange={setOverlayColor}
          format="rgba"
          data-testid="overlay-color-input"
        />
        
        <Checkbox
          label="Enable overlay"
          checked={enableOverlay}
          onChange={(e) => setEnableOverlay(e.currentTarget.checked)}
        />
        
        <div>
          <Group justify="space-between" mb={4}>
            <Text size="sm">Blur</Text>
            <Text size="sm" c="dimmed">{blur}px</Text>
          </Group>
          <Slider
            value={blur}
            onChange={setBlur}
            min={0}
            max={20}
            marks={[
              { value: 0, label: '0' },
              { value: 10, label: '10' },
              { value: 20, label: '20' },
            ]}
          />
        </div>
      </Stack>
    </Card>
  );
}
