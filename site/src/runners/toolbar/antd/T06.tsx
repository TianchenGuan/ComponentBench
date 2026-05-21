'use client';

/**
 * toolbar-antd-T06: Set Bold and Underline on the Primary toolbar
 *
 * A centered isolated card contains TWO visually similar Ant Design toolbars stacked vertically:
 * 1) "Primary (Editor)" toolbar (target) and 2) "Secondary (Comment)" toolbar (distractor).
 * Each toolbar contains three toggle buttons: "Bold", "Italic", and "Underline".
 * To the right of the toolbars there is a small "Target formatting" preview panel that visually 
 * highlights the Bold and Underline icons.
 * Initial state: On the Primary toolbar, only Italic is On; Bold and Underline are Off. 
 * On the Secondary toolbar, Bold is On and the others are Off.
 */

import React, { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface ToggleState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState<ToggleState>({
    bold: false,
    italic: true,
    underline: false,
  });
  const [secondary, setSecondary] = useState<ToggleState>({
    bold: true,
    italic: false,
    underline: false,
  });

  const handlePrimaryToggle = (key: keyof ToggleState) => {
    const newState = { ...primary, [key]: !primary[key] };
    setPrimary(newState);
    // Success: bold=true, underline=true, italic=false
    if (newState.bold && newState.underline && !newState.italic) {
      onSuccess();
    }
  };

  const handleSecondaryToggle = (key: keyof ToggleState) => {
    setSecondary((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToolbar = (
    label: string,
    state: ToggleState,
    onToggle: (key: keyof ToggleState) => void,
    testIdPrefix: string
  ) => (
    <div style={{ marginBottom: 16 }} data-testid={testIdPrefix}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>
        {label}
      </Text>
      <Space size="small">
        <Button
          type={state.bold ? 'primary' : 'default'}
          icon={<BoldOutlined />}
          onClick={() => onToggle('bold')}
          aria-pressed={state.bold}
          aria-label="Bold"
          data-testid={`${testIdPrefix}-bold`}
        />
        <Button
          type={state.italic ? 'primary' : 'default'}
          icon={<ItalicOutlined />}
          onClick={() => onToggle('italic')}
          aria-pressed={state.italic}
          aria-label="Italic"
          data-testid={`${testIdPrefix}-italic`}
        />
        <Button
          type={state.underline ? 'primary' : 'default'}
          icon={<UnderlineOutlined />}
          onClick={() => onToggle('underline')}
          aria-pressed={state.underline}
          aria-label="Underline"
          data-testid={`${testIdPrefix}-underline`}
        />
      </Space>
    </div>
  );

  return (
    <Card style={{ width: 550 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          {renderToolbar('Primary (Editor)', primary, handlePrimaryToggle, 'toolbar-primary')}
          {renderToolbar('Secondary (Comment)', secondary, handleSecondaryToggle, 'toolbar-secondary')}
        </div>

        {/* Target preview */}
        <div
          style={{
            width: 150,
            padding: 12,
            background: '#f5f5f5',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Target formatting
          </Text>
          <Space size="small">
            <div
              style={{
                padding: 8,
                background: '#1677ff',
                color: '#fff',
                borderRadius: 4,
              }}
            >
              <BoldOutlined />
            </div>
            <div
              style={{
                padding: 8,
                background: '#e8e8e8',
                color: '#999',
                borderRadius: 4,
              }}
            >
              <ItalicOutlined />
            </div>
            <div
              style={{
                padding: 8,
                background: '#1677ff',
                color: '#fff',
                borderRadius: 4,
              }}
            >
              <UnderlineOutlined />
            </div>
          </Space>
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
            Bold + Underline (Italic off)
          </Text>
        </div>
      </div>
    </Card>
  );
}
