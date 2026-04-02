'use client';

/**
 * toolbar-antd-T10: Match the reference icon in an icon-only toolbar
 *
 * A centered isolated card is split into two columns.
 * Left column: a "Reference" panel shows a single large example icon (no text label) 
 * representing the target tool.
 * Right column: a toolbar labeled "Drawing tools" contains 8 small icon-only buttons.
 * Only one tool can be active at a time; the active tool appears pressed/highlighted.
 * The reference icon corresponds to the "highlighter" tool.
 */

import React, { useState } from 'react';
import { Button, Card, Typography, Space } from 'antd';
import {
  EditOutlined,
  HighlightOutlined,
  DeleteOutlined,
  ScissorOutlined,
  FormatPainterOutlined,
  BorderOutlined,
  LineOutlined,
  BgColorsOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TOOLS: Tool[] = [
  { id: 'pencil', label: 'Pencil', icon: <EditOutlined /> },
  { id: 'highlighter', label: 'Highlighter', icon: <HighlightOutlined /> },
  { id: 'eraser', label: 'Eraser', icon: <DeleteOutlined /> },
  { id: 'scissors', label: 'Scissors', icon: <ScissorOutlined /> },
  { id: 'brush', label: 'Brush', icon: <FormatPainterOutlined /> },
  { id: 'shape', label: 'Shape', icon: <BorderOutlined /> },
  { id: 'line', label: 'Line', icon: <LineOutlined /> },
  { id: 'fill', label: 'Fill', icon: <BgColorsOutlined /> },
];

const TARGET_TOOL = 'highlighter';
const INITIAL_TOOL = 'pencil';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [activeTool, setActiveTool] = useState<string>(INITIAL_TOOL);

  const handleSelectTool = (toolId: string) => {
    setActiveTool(toolId);
    if (toolId === TARGET_TOOL) {
      onSuccess();
    }
  };

  const targetToolData = TOOLS.find((t) => t.id === TARGET_TOOL);

  return (
    <Card style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Reference panel */}
        <div
          style={{
            width: 120,
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Reference
          </Text>
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto',
              border: '2px dashed #1677ff',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
            data-reference-tool={TARGET_TOOL}
          >
            {targetToolData?.icon}
          </div>
        </div>

        {/* Drawing tools toolbar */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Drawing tools
          </Text>
          <Space size="small" wrap data-testid="toolbar-drawing-tools">
            {TOOLS.map((tool) => (
              <Button
                key={tool.id}
                type={activeTool === tool.id ? 'primary' : 'default'}
                icon={tool.icon}
                onClick={() => handleSelectTool(tool.id)}
                aria-pressed={activeTool === tool.id}
                aria-label={tool.label}
                data-testid={`toolbar-drawing-tools-${tool.id}`}
                data-tool-id={tool.id}
              />
            ))}
          </Space>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Active tool: {TOOLS.find((t) => t.id === activeTool)?.label}
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
