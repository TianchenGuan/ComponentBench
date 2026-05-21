'use client';

/**
 * select_native-mantine-T13: Choose Nord syntax theme (dark settings panel)
 *
 * Layout: a developer settings panel anchored near the top-right of the viewport.
 * Theme: dark. Spacing: compact.
 *
 * The panel includes several toggles (Auto-save, Vim mode, Line numbers) as clutter.
 * The target component is a Mantine NativeSelect labeled "Syntax theme".
 *
 * Options (label → value):
 * - GitHub → github
 * - Dracula → dracula
 * - Nord → nord  ← TARGET
 * - Monokai → monokai
 * - Solarized Dark → solarized-dark
 *
 * Initial state: Dracula is selected.
 * Feedback: immediate; no Save/Apply.
 *
 * Success: The target native select has selected option value 'nord' (label 'Nord').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect, Switch, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const themeOptions = [
  { label: 'GitHub', value: 'github' },
  { label: 'Dracula', value: 'dracula' },
  { label: 'Nord', value: 'nord' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
];

export default function T13({ onSuccess }: TaskComponentProps) {
  const [syntaxTheme, setSyntaxTheme] = useState<string>('dracula');
  const [autoSave, setAutoSave] = useState(true);
  const [vimMode, setVimMode] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSyntaxTheme(value);
    if (value === 'nord') {
      onSuccess();
    }
  };

  return (
    <Card 
      shadow="sm" 
      padding="md" 
      radius="md" 
      style={{ 
        width: 340, 
        backgroundColor: '#1a1a2e',
        border: '1px solid #333'
      }}
    >
      <Text fw={600} size="md" mb="md" c="white">Developer Settings</Text>
      
      <Stack gap="sm">
        <Switch
          label="Auto-save"
          checked={autoSave}
          onChange={(e) => setAutoSave(e.currentTarget.checked)}
          size="sm"
          styles={{ label: { color: '#ccc' } }}
        />
        
        <Switch
          label="Vim mode"
          checked={vimMode}
          onChange={(e) => setVimMode(e.currentTarget.checked)}
          size="sm"
          styles={{ label: { color: '#ccc' } }}
        />
        
        <Switch
          label="Line numbers"
          checked={lineNumbers}
          onChange={(e) => setLineNumbers(e.currentTarget.checked)}
          size="sm"
          styles={{ label: { color: '#ccc' } }}
        />

        <NativeSelect
          data-testid="syntax-theme-select"
          data-canonical-type="select_native"
          data-selected-value={syntaxTheme}
          label="Syntax theme"
          value={syntaxTheme}
          onChange={handleThemeChange}
          data={themeOptions}
          size="sm"
          styles={{
            label: { color: '#ccc' },
            input: { 
              backgroundColor: '#252542',
              borderColor: '#444',
              color: '#fff'
            }
          }}
        />
      </Stack>
    </Card>
  );
}
