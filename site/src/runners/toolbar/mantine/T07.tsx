'use client';

/**
 * toolbar-mantine-T07: Dark theme: match reference icon in tool palette
 *
 * A centered isolated card in dark theme shows two columns. The left column is a 
 * "Reference" panel containing a large example icon with no text label.
 * The right column contains a Mantine Group toolbar labeled "Image tools" with 7 
 * small ActionIcon toggles (icon-only). Only one tool can be active at a time.
 * The reference icon corresponds to the Crop tool. Initial active tool is Select.
 */

import React, { useState } from 'react';
import { Paper, Group, ActionIcon, Text, Title, Box, Tooltip } from '@mantine/core';
import {
  IconPointer,
  IconArrowsMove,
  IconCrop,
  IconRotate,
  IconFlipHorizontal,
  IconTrash,
  IconColorPicker,
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TOOLS: Tool[] = [
  { id: 'select', label: 'Select', icon: <IconPointer size={18} /> },
  { id: 'move', label: 'Move', icon: <IconArrowsMove size={18} /> },
  { id: 'crop', label: 'Crop', icon: <IconCrop size={18} /> },
  { id: 'rotate', label: 'Rotate', icon: <IconRotate size={18} /> },
  { id: 'flip', label: 'Flip', icon: <IconFlipHorizontal size={18} /> },
  { id: 'erase', label: 'Erase', icon: <IconTrash size={18} /> },
  { id: 'picker', label: 'Color Picker', icon: <IconColorPicker size={18} /> },
];

const TARGET_TOOL = 'crop';
const INITIAL_TOOL = 'select';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [activeTool, setActiveTool] = useState<string>(INITIAL_TOOL);

  const handleSelectTool = (toolId: string) => {
    setActiveTool(toolId);
    if (toolId === TARGET_TOOL) {
      onSuccess();
    }
  };

  const targetToolData = TOOLS.find((t) => t.id === TARGET_TOOL);

  return (
    <Paper shadow="sm" p="lg" radius="md" style={{ width: 480 }}>
      <Group align="flex-start" gap="xl">
        {/* Reference panel */}
        <Box
          p="md"
          style={{
            background: '#2e2e2e',
            borderRadius: 8,
            textAlign: 'center',
            width: 130,
          }}
        >
          <Text size="sm" c="dimmed" mb="md">
            Reference
          </Text>
          <Box
            p="lg"
            style={{
              width: 72,
              height: 72,
              margin: '0 auto',
              border: '2px dashed #228be6',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#228be6',
            }}
            data-reference-tool={TARGET_TOOL}
          >
            {targetToolData?.icon}
          </Box>
        </Box>

        {/* Image tools toolbar */}
        <Box style={{ flex: 1 }}>
          <Title order={5} mb="md">
            Image tools
          </Title>
          <Group gap="xs" data-testid="mantine-toolbar-image-tools">
            {TOOLS.map((tool) => (
              <Tooltip key={tool.id} label={tool.label}>
                <ActionIcon
                  variant={activeTool === tool.id ? 'filled' : 'default'}
                  onClick={() => handleSelectTool(tool.id)}
                  aria-pressed={activeTool === tool.id}
                  aria-label={tool.label}
                  data-testid={`mantine-toolbar-image-tools-${tool.id}`}
                  data-tool-id={tool.id}
                >
                  {tool.icon}
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>

          <Text size="sm" c="dimmed" mt="md">
            Active tool: {TOOLS.find((t) => t.id === activeTool)?.label}
          </Text>
        </Box>
      </Group>
    </Paper>
  );
}
