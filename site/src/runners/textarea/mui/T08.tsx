'use client';

/**
 * textarea-mui-T08: Enter a small YAML config block
 *
 * A centered card titled "Importer" contains a code-style textarea for configuration.
 * - Light theme with compact spacing and small scale (dense dev-tool UI).
 * - The component is MUI TextareaAutosize styled with monospace font and a subtle border.
 * - Label: "YAML config". Starts empty; a faint background grid is visible (non-interactive).
 * - A small hint text below says "Indentation matters".
 * - No other textareas are present.
 *
 * Success: Value equals exactly (whitespace=exact):
 *   customer_id: 8831
 *   items:
 *     - sku: A12
 *       qty: 2
 *     - sku: B07
 *       qty: 1
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextareaAutosize } from '@mui/material';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = `customer_id: 8831
items:
  - sku: A12
    qty: 2
  - sku: B07
    qty: 1`;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const normalize = (s: string) =>
      s.replace(/\r\n/g, '\n')
       .replace(/\t/g, '  ')
       .split('\n')
       .map((line) => line.trimEnd())
       .join('\n')
       .trim();
    if (normalize(value) === normalize(TARGET_VALUE)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontSize: 14, fontWeight: 600 }}>
          Importer
        </Typography>
        <Typography
          component="label"
          htmlFor="yaml-config"
          sx={{ display: 'block', mb: 0.5, fontWeight: 500, fontSize: 12 }}
        >
          YAML config
        </Typography>
        <TextareaAutosize
          id="yaml-config"
          minRows={6}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="textarea-yaml-config"
          style={{
            width: '100%',
            padding: 8,
            fontFamily: 'monospace',
            fontSize: 11,
            background: '#fafafa',
            border: '1px solid #ddd',
            borderRadius: 4,
            resize: 'vertical',
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 15px, #f0f0f0 15px, #f0f0f0 16px)',
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', fontSize: 10 }}>
          Indentation matters
        </Typography>
      </CardContent>
    </Card>
  );
}
