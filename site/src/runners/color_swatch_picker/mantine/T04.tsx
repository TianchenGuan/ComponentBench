'use client';

/**
 * color_swatch_picker-mantine-T04: Clear the Badge color
 *
 * Layout: isolated_card centered on the page.
 * A ColorInput with a custom clear button.
 *
 * Initial state: Badge color is #fa5252.
 * Success: Color is cleared (empty).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Text, ColorInput, CloseButton } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { MANTINE_SWATCHES } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('#fa5252');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isCleared = value === '' || value === null || value === undefined;

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isCleared) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isCleared, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Badge</Text>
      
      <div data-testid="badge-color">
        <ColorInput
          label="Badge color"
          value={value}
          onChange={setValue}
          format="hex"
          swatches={MANTINE_SWATCHES}
          withPicker={false}
          rightSection={
            value ? (
              <CloseButton 
                size="sm" 
                onClick={handleClear}
                aria-label="Clear"
                data-testid="clear-button"
              />
            ) : null
          }
          data-testid="badge-color-input"
        />
      </div>
      <div 
        data-testid="badge-color-value" 
        data-cleared={isCleared ? 'true' : 'false'}
        style={{ display: 'none' }}
      >
        {value || ''}
      </div>
    </Card>
  );
}
