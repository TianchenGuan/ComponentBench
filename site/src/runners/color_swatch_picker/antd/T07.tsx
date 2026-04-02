'use client';

/**
 * color_swatch_picker-antd-T07: Pick Cyan and apply in modal
 *
 * Layout: modal_flow with a button that opens a modal dialog.
 * The modal contains a ColorPicker and requires clicking "Apply changes" to commit.
 *
 * Initial state: Committed Accent color is #1677ff (Ant Blue).
 * Success: Committed color equals #13c2c2 (Cyan) after clicking Apply changes.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Modal, Button, Switch, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text, Paragraph } = Typography;

const TARGET_COLOR = '#13c2c2';

const presets = [
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Neutrals',
    colors: NEUTRAL_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [committedColor, setCommittedColor] = useState<string>('#1677ff');
  const [pendingColor, setPendingColor] = useState<Color | string>('#1677ff');
  const [useSystemTheme, setUseSystemTheme] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pendingHex = typeof pendingColor === 'object' && 'toHexString' in pendingColor
    ? pendingColor.toHexString()
    : String(pendingColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(committedColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [committedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleOpen = () => {
    setPendingColor(committedColor);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setCommittedColor(normalizeHex(pendingHex));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setPendingColor(committedColor);
    setIsModalOpen(false);
  };

  return (
    <div ref={containerRef}>
      <Card style={{ width: 400 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 24,
                height: 24,
                backgroundColor: committedColor,
                borderRadius: 4,
                border: '1px solid #d9d9d9',
              }}
            />
            <Text>Current theme accent: {committedColor}</Text>
          </div>
          <Button type="primary" onClick={handleOpen}>
            Customize theme
          </Button>
        </Space>
      </Card>

      <Modal
        title="Customize theme"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply}>
            Apply changes
          </Button>,
        ]}
        getContainer={() => containerRef.current || document.body}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Paragraph type="secondary">
            Customize the theme settings for your application.
          </Paragraph>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Use system theme</Text>
            <Switch checked={useSystemTheme} onChange={setUseSystemTheme} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Accent color</Text>
            <ColorPicker
              value={pendingColor}
              onChange={setPendingColor}
              showText
              presets={presets}
              panelRender={(panel, { components: { Presets } }) => (
                <div>
                  <Divider style={{ margin: '8px 0' }}>Preset Colors</Divider>
                  <Presets />
                </div>
              )}
              getPopupContainer={() => containerRef.current || document.body}
            />
          </div>
          
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <Text type="secondary">Preview: </Text>
            <span style={{ color: pendingHex, fontWeight: 600 }}>Sample accent text</span>
          </div>
        </Space>
      </Modal>

      <div data-testid="accent-color-committed" style={{ display: 'none' }}>
        {normalizeHex(committedColor)}
      </div>
    </div>
  );
}
