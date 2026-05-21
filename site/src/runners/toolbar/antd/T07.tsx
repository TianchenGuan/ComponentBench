'use client';

/**
 * toolbar-antd-T07: Reorder clipboard tools and click Done
 *
 * A centered isolated card shows a single toolbar labeled "Clipboard" with four action 
 * chips/icons in a row: "Cut", "Copy", "Paste", and "Undo". At the right end of the toolbar 
 * there is a "Customize" button that toggles reorder mode.
 * Initial state: the tool order is Cut, Copy, Paste, Undo.
 * Target order: Undo, Cut, Copy, Paste.
 * When "Customize" is activated, each tool shows a visible drag handle and a "Done" button 
 * appears to commit the order.
 */

import React, { useState } from 'react';
import { Button, Card, Space, Typography, Tag } from 'antd';
import {
  ScissorOutlined,
  CopyOutlined,
  SnippetsOutlined,
  UndoOutlined,
  SettingOutlined,
  HolderOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const INITIAL_TOOLS: Tool[] = [
  { id: 'cut', label: 'Cut', icon: <ScissorOutlined /> },
  { id: 'copy', label: 'Copy', icon: <CopyOutlined /> },
  { id: 'paste', label: 'Paste', icon: <SnippetsOutlined /> },
  { id: 'undo', label: 'Undo', icon: <UndoOutlined /> },
];

const TARGET_ORDER = ['undo', 'cut', 'copy', 'paste'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [tools, setTools] = useState<Tool[]>(INITIAL_TOOLS);
  const [customizing, setCustomizing] = useState(false);
  const [committedOrder, setCommittedOrder] = useState<string[]>(INITIAL_TOOLS.map((t) => t.id));
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTools = [...tools];
    const [draggedItem] = newTools.splice(draggedIndex, 1);
    newTools.splice(index, 0, draggedItem);
    setTools(newTools);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDone = () => {
    const currentOrder = tools.map((t) => t.id);
    setCommittedOrder(currentOrder);
    setCustomizing(false);

    // Check if matches target
    if (JSON.stringify(currentOrder) === JSON.stringify(TARGET_ORDER)) {
      onSuccess();
    }
  };

  const handleCustomize = () => {
    setCustomizing(true);
  };

  return (
    <Card title="Clipboard" style={{ width: 500 }} data-testid="toolbar-clipboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Space size="small" style={{ flex: 1 }}>
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              draggable={customizing}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                cursor: customizing ? 'grab' : 'default',
              }}
              data-tool-id={tool.id}
            >
              {customizing && (
                <HolderOutlined style={{ color: '#999', cursor: 'grab' }} />
              )}
              <Tag
                icon={tool.icon}
                style={{
                  padding: '4px 8px',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {tool.label}
              </Tag>
            </div>
          ))}
        </Space>

        {!customizing ? (
          <Button
            icon={<SettingOutlined />}
            onClick={handleCustomize}
            data-testid="toolbar-clipboard-customize"
          >
            Customize
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleDone}
            data-testid="toolbar-clipboard-done"
          >
            Done
          </Button>
        )}
      </div>

      {customizing && (
        <Text type="secondary" style={{ fontSize: 12 }}>
          Drag to reorder
        </Text>
      )}

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          Current order: {committedOrder.join(', ')}
        </Text>
      </div>
    </Card>
  );
}
