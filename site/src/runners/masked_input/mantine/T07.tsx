'use client';

/**
 * masked_input-mantine-T07: Edit vehicle plate in small field
 * 
 * Isolated card centered in the viewport titled "Fleet record".
 * The target is a single Mantine TextInput rendered at a small scale tier (e.g., size='xs' or narrow width), labeled "Vehicle plate".
 * The mask enforces three letters, a dash, and four digits (AAA-####) and auto-capitalizes letters.
 * The field starts prefilled with "QPX-0421", so the agent must edit within an existing masked value (change the third and fourth digits from 21 to 71).
 * 
 * Success: The "Vehicle plate" masked input value equals "QPX-0471".
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('QPX-0421');

  useEffect(() => {
    if (value === 'QPX-0471') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="md" mb="sm">Fleet record</Text>
      <div style={{ marginBottom: 8 }}>
        <Text component="label" htmlFor="vehicle-plate" fw={500} size="xs" mb={4} style={{ display: 'block' }}>
          Vehicle plate
        </Text>
        <IMaskInput
          id="vehicle-plate"
          mask="aaa-0000"
          definitions={{
            'a': /[A-Za-z]/,
            '0': /[0-9]/
          }}
          prepare={(str: string) => str.toUpperCase()}
          placeholder="AAA-####"
          value={value}
          onAccept={(val: string) => setValue(val)}
          data-testid="vehicle-plate"
          style={{
            width: '100%',
            padding: '4px 8px',
            fontSize: 12,
            lineHeight: 1.5,
            border: '1px solid #ced4da',
            borderRadius: 4,
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
      </div>
    </Card>
  );
}
