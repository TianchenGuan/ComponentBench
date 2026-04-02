'use client';

/**
 * toolbar-mantine-T05: Set Bold and Italic on the Editor toolbar (two instances)
 *
 * A centered isolated card contains two stacked toolbars with headings:
 * - "Editor" toolbar (target)
 * - "Preview" toolbar (distractor)
 * Each toolbar is a Mantine Group of three ActionIcon toggles: Bold, Italic, Underline.
 * To the right, a small "Target formatting" preview visually highlights Bold and Italic as active.
 * Initial state: In the Editor toolbar, Underline is On, Bold and Italic are Off.
 * In the Preview toolbar, Bold is On.
 */

import React, { useState } from 'react';
import { Paper, Group, ActionIcon, Text, Title, Box, Tooltip } from '@mantine/core';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface ToggleState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [editor, setEditor] = useState<ToggleState>({
    bold: false,
    italic: false,
    underline: true,
  });
  const [preview, setPreview] = useState<ToggleState>({
    bold: true,
    italic: false,
    underline: false,
  });

  const handleEditorToggle = (key: keyof ToggleState) => {
    const newState = { ...editor, [key]: !editor[key] };
    setEditor(newState);
    // Success: bold=true, italic=true, underline=false
    if (newState.bold && newState.italic && !newState.underline) {
      onSuccess();
    }
  };

  const handlePreviewToggle = (key: keyof ToggleState) => {
    setPreview((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToolbar = (
    label: string,
    state: ToggleState,
    onToggle: (key: keyof ToggleState) => void,
    testIdPrefix: string
  ) => (
    <Box mb="md" data-testid={testIdPrefix}>
      <Text size="sm" fw={600} mb="xs">
        {label}
      </Text>
      <Group gap="xs">
        <Tooltip label="Bold">
          <ActionIcon
            variant={state.bold ? 'filled' : 'default'}
            onClick={() => onToggle('bold')}
            aria-pressed={state.bold}
            aria-label="Bold"
            data-testid={`${testIdPrefix}-bold`}
          >
            <IconBold size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Italic">
          <ActionIcon
            variant={state.italic ? 'filled' : 'default'}
            onClick={() => onToggle('italic')}
            aria-pressed={state.italic}
            aria-label="Italic"
            data-testid={`${testIdPrefix}-italic`}
          >
            <IconItalic size={16} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Underline">
          <ActionIcon
            variant={state.underline ? 'filled' : 'default'}
            onClick={() => onToggle('underline')}
            aria-pressed={state.underline}
            aria-label="Underline"
            data-testid={`${testIdPrefix}-underline`}
          >
            <IconUnderline size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Box>
  );

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 500 }}>
      <Group align="flex-start" gap="xl">
        <Box style={{ flex: 1 }}>
          {renderToolbar('Editor', editor, handleEditorToggle, 'mantine-toolbar-editor')}
          {renderToolbar('Preview', preview, handlePreviewToggle, 'mantine-toolbar-preview')}
        </Box>

        {/* Target preview */}
        <Box
          p="sm"
          style={{
            background: '#f5f5f5',
            borderRadius: 8,
            textAlign: 'center',
            width: 140,
          }}
        >
          <Text size="xs" c="dimmed" mb="xs">
            Target formatting
          </Text>
          <Group gap="xs" justify="center">
            <Box
              p={6}
              style={{
                background: '#228be6',
                color: '#fff',
                borderRadius: 4,
              }}
            >
              <IconBold size={14} />
            </Box>
            <Box
              p={6}
              style={{
                background: '#228be6',
                color: '#fff',
                borderRadius: 4,
              }}
            >
              <IconItalic size={14} />
            </Box>
            <Box
              p={6}
              style={{
                background: '#e8e8e8',
                color: '#999',
                borderRadius: 4,
              }}
            >
              <IconUnderline size={14} />
            </Box>
          </Group>
          <Text size="xs" c="dimmed" mt="xs">
            Bold + Italic (Underline off)
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
