'use client';

/**
 * toolbar-antd-T08: Compact toolbar: reorder tools in the Main instance
 *
 * The page is a settings_panel layout anchored to the bottom-left of the viewport. 
 * The panel contains several unrelated switches and checkboxes (clutter=medium).
 * Inside the panel are TWO compact toolbars with very similar icon-only buttons:
 * - "Main" toolbar (target)
 * - "Footer" toolbar (distractor)
 * The Main toolbar has 6 tools: Select, Move, Crop, Rotate, Flip, Reset.
 * Initial order: Crop, Rotate, Select, Move, Flip, Reset.
 * Target order: Select, Move, Crop, Rotate, Flip, Reset.
 */

import React, { useState } from 'react';
import { Button, Card, Switch, Checkbox, Tooltip, Typography, Space } from 'antd';
import {
  SelectOutlined,
  DragOutlined,
  ScissorOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ReloadOutlined,
  SettingOutlined,
  CheckOutlined,
  HolderOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const MAIN_INITIAL: Tool[] = [
  { id: 'crop', label: 'Crop', icon: <ScissorOutlined /> },
  { id: 'rotate', label: 'Rotate', icon: <RotateRightOutlined /> },
  { id: 'select', label: 'Select', icon: <SelectOutlined /> },
  { id: 'move', label: 'Move', icon: <DragOutlined /> },
  { id: 'flip', label: 'Flip', icon: <SwapOutlined /> },
  { id: 'reset', label: 'Reset', icon: <ReloadOutlined /> },
];

const FOOTER_TOOLS: Tool[] = [
  { id: 'zoom-in', label: 'Zoom In', icon: <SelectOutlined /> },
  { id: 'zoom-out', label: 'Zoom Out', icon: <DragOutlined /> },
  { id: 'fit', label: 'Fit', icon: <ReloadOutlined /> },
];

const TARGET_ORDER = ['select', 'move', 'crop', 'rotate', 'flip', 'reset'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [mainTools, setMainTools] = useState<Tool[]>(MAIN_INITIAL);
  const [mainCustomizing, setMainCustomizing] = useState(false);
  const [mainCommittedOrder, setMainCommittedOrder] = useState<string[]>(
    MAIN_INITIAL.map((t) => t.id)
  );
  const [mainDraggedIndex, setMainDraggedIndex] = useState<number | null>(null);

  const [footerCustomizing, setFooterCustomizing] = useState(false);

  const handleMainDragStart = (index: number) => {
    setMainDraggedIndex(index);
  };

  const handleMainDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (mainDraggedIndex === null || mainDraggedIndex === index) return;

    const newTools = [...mainTools];
    const [draggedItem] = newTools.splice(mainDraggedIndex, 1);
    newTools.splice(index, 0, draggedItem);
    setMainTools(newTools);
    setMainDraggedIndex(index);
  };

  const handleMainDragEnd = () => {
    setMainDraggedIndex(null);
  };

  const handleMainApply = () => {
    const currentOrder = mainTools.map((t) => t.id);
    setMainCommittedOrder(currentOrder);
    setMainCustomizing(false);

    if (JSON.stringify(currentOrder) === JSON.stringify(TARGET_ORDER)) {
      onSuccess();
    }
  };

  const renderToolbar = (
    label: string,
    tools: Tool[],
    customizing: boolean,
    onCustomize: () => void,
    onApply?: () => void,
    testIdPrefix: string = '',
    draggable: boolean = false,
    onDragStart?: (index: number) => void,
    onDragOver?: (e: React.DragEvent, index: number) => void,
    onDragEnd?: () => void
  ) => (
    <div style={{ marginBottom: 16 }} data-testid={testIdPrefix}>
      <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
        {label}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Space size={4}>
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              draggable={draggable && customizing}
              onDragStart={() => onDragStart?.(index)}
              onDragOver={(e) => onDragOver?.(e, index)}
              onDragEnd={onDragEnd}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: draggable && customizing ? 'grab' : 'default',
              }}
              data-tool-id={tool.id}
            >
              {customizing && <HolderOutlined style={{ color: '#999', fontSize: 10 }} />}
              <Tooltip title={tool.label}>
                <Button
                  size="small"
                  type="text"
                  icon={tool.icon}
                  aria-label={tool.label}
                  data-testid={`${testIdPrefix}-${tool.id}`}
                />
              </Tooltip>
            </div>
          ))}
        </Space>

        {!customizing ? (
          <Tooltip title="Customize">
            <Button
              size="small"
              type="text"
              icon={<SettingOutlined />}
              onClick={onCustomize}
              data-testid={`${testIdPrefix}-customize`}
            />
          </Tooltip>
        ) : (
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={onApply}
            data-testid={`${testIdPrefix}-apply`}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card title="Settings" size="small" style={{ width: 450 }}>
      {/* Clutter: unrelated settings */}
      <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text>Auto-save</Text>
          <Switch defaultChecked size="small" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text>Show grid</Text>
          <Switch size="small" />
        </div>
        <Checkbox style={{ marginBottom: 8 }}>Enable animations</Checkbox>
        <Checkbox>Show tooltips</Checkbox>
      </div>

      {/* Main toolbar (target) */}
      {renderToolbar(
        'Main',
        mainTools,
        mainCustomizing,
        () => setMainCustomizing(true),
        handleMainApply,
        'toolbar-main',
        true,
        handleMainDragStart,
        handleMainDragOver,
        handleMainDragEnd
      )}

      {/* Footer toolbar (distractor) */}
      {renderToolbar(
        'Footer',
        FOOTER_TOOLS,
        footerCustomizing,
        () => setFooterCustomizing(true),
        () => setFooterCustomizing(false),
        'toolbar-footer'
      )}
    </Card>
  );
}
