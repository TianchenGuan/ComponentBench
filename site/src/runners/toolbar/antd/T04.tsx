'use client';

/**
 * toolbar-antd-T04: Clear formatting back to defaults
 *
 * A centered isolated card shows a toolbar labeled "Formatting". The toolbar includes 
 * three toggle buttons ("Bold", "Italic", "Underline"), an Alignment Segmented control 
 * (Left/Center/Right), and a right-aligned button labeled "Clear formatting".
 * Initial state: Bold is On, Italic is On, Underline is Off, and alignment is set to "Right".
 * When "Clear formatting" is clicked, the toolbar immediately resets to the defaults 
 * (all toggles Off and alignment Left).
 */

import React, { useState } from 'react';
import { Button, Card, Space, Segmented, Typography, Tooltip } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: 'left' | 'center' | 'right';
}

const DEFAULTS: FormattingState = {
  bold: false,
  italic: false,
  underline: false,
  alignment: 'left',
};

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [formatting, setFormatting] = useState<FormattingState>({
    bold: true,
    italic: true,
    underline: false,
    alignment: 'right',
  });

  const handleToggle = (key: 'bold' | 'italic' | 'underline') => {
    setFormatting((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAlignment = (value: FormattingState['alignment']) => {
    setFormatting((prev) => ({ ...prev, alignment: value }));
  };

  const handleClear = () => {
    setFormatting(DEFAULTS);
    // Check if this matches defaults
    if (
      DEFAULTS.bold === false &&
      DEFAULTS.italic === false &&
      DEFAULTS.underline === false &&
      DEFAULTS.alignment === 'left'
    ) {
      onSuccess();
    }
  };

  return (
    <Card title="Formatting" style={{ width: 500 }} data-testid="toolbar-formatting">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <Space size="small">
          <Tooltip title="Bold">
            <Button
              type={formatting.bold ? 'primary' : 'default'}
              icon={<BoldOutlined />}
              onClick={() => handleToggle('bold')}
              aria-pressed={formatting.bold}
              data-testid="toolbar-formatting-bold"
            />
          </Tooltip>
          <Tooltip title="Italic">
            <Button
              type={formatting.italic ? 'primary' : 'default'}
              icon={<ItalicOutlined />}
              onClick={() => handleToggle('italic')}
              aria-pressed={formatting.italic}
              data-testid="toolbar-formatting-italic"
            />
          </Tooltip>
          <Tooltip title="Underline">
            <Button
              type={formatting.underline ? 'primary' : 'default'}
              icon={<UnderlineOutlined />}
              onClick={() => handleToggle('underline')}
              aria-pressed={formatting.underline}
              data-testid="toolbar-formatting-underline"
            />
          </Tooltip>
        </Space>

        <Segmented
          options={[
            { value: 'left', icon: <AlignLeftOutlined /> },
            { value: 'center', icon: <AlignCenterOutlined /> },
            { value: 'right', icon: <AlignRightOutlined /> },
          ]}
          value={formatting.alignment}
          onChange={(value) => handleAlignment(value as FormattingState['alignment'])}
          data-testid="toolbar-formatting-alignment"
        />

        <div style={{ marginLeft: 'auto' }}>
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            data-testid="toolbar-formatting-clear"
          >
            Clear formatting
          </Button>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          background: '#fafafa',
          borderRadius: 4,
          marginBottom: 12,
          textAlign: formatting.alignment,
        }}
      >
        <span
          style={{
            fontWeight: formatting.bold ? 'bold' : 'normal',
            fontStyle: formatting.italic ? 'italic' : 'normal',
            textDecoration: formatting.underline ? 'underline' : 'none',
          }}
        >
          Preview text with formatting applied.
        </span>
      </div>

      <Text type="secondary">
        Defaults: Bold Off, Italic Off, Underline Off, Alignment Left
      </Text>
    </Card>
  );
}
