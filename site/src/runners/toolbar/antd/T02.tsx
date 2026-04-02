'use client';

/**
 * toolbar-antd-T02: Turn on Bold toggle in formatting toolbar
 *
 * A centered isolated card contains a toolbar labeled "Formatting". The toolbar is a 
 * horizontal row of three toggle-like controls implemented with Ant Design Buttons 
 * (or Button.Group) that visually indicate pressed state: "Bold", "Italic", and "Underline".
 * Each control has a tooltip on hover that repeats the label.
 * Below the toolbar, a small preview sentence is shown and a compact status readout lists 
 * the current toggle states (e.g., "Bold: Off"). Initially, all toggles are Off.
 */

import React, { useState } from 'react';
import { Button, Card, Space, Tooltip, Typography } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface ToggleState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleState>({
    bold: false,
    italic: false,
    underline: false,
  });

  const handleToggle = (key: keyof ToggleState) => {
    const newState = { ...toggles, [key]: !toggles[key] };
    setToggles(newState);
    if (key === 'bold' && newState.bold) {
      onSuccess();
    }
  };

  return (
    <Card title="Formatting" style={{ width: 400 }} data-testid="toolbar-formatting">
      <Space size="small" style={{ marginBottom: 16 }}>
        <Tooltip title="Bold">
          <Button
            type={toggles.bold ? 'primary' : 'default'}
            icon={<BoldOutlined />}
            onClick={() => handleToggle('bold')}
            aria-pressed={toggles.bold}
            aria-label="Bold"
            data-testid="toolbar-formatting-bold"
          />
        </Tooltip>
        <Tooltip title="Italic">
          <Button
            type={toggles.italic ? 'primary' : 'default'}
            icon={<ItalicOutlined />}
            onClick={() => handleToggle('italic')}
            aria-pressed={toggles.italic}
            aria-label="Italic"
            data-testid="toolbar-formatting-italic"
          />
        </Tooltip>
        <Tooltip title="Underline">
          <Button
            type={toggles.underline ? 'primary' : 'default'}
            icon={<UnderlineOutlined />}
            onClick={() => handleToggle('underline')}
            aria-pressed={toggles.underline}
            aria-label="Underline"
            data-testid="toolbar-formatting-underline"
          />
        </Tooltip>
      </Space>

      <div style={{ marginBottom: 12, padding: 8, background: '#fafafa', borderRadius: 4 }}>
        <span
          style={{
            fontWeight: toggles.bold ? 'bold' : 'normal',
            fontStyle: toggles.italic ? 'italic' : 'normal',
            textDecoration: toggles.underline ? 'underline' : 'none',
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </span>
      </div>

      <Text type="secondary">Bold: {toggles.bold ? 'On' : 'Off'}</Text>
    </Card>
  );
}
