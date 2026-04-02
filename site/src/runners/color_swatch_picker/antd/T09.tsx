'use client';

/**
 * color_swatch_picker-antd-T09: Match Warning badge color to target sample
 *
 * Layout: settings_panel centered on the page.
 * A settings panel with multiple controls including a ColorPicker and a target reference.
 *
 * Initial state: Warning badge color is #f5222d (Red).
 * Success: Color matches "Target: Amber" (#faad14).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Checkbox, Select, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BRAND_SWATCHES, STATUS_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#faad14';

const presets = [
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Status',
    colors: [...STATUS_SWATCHES.map(s => s.color), '#fa8c16', '#fab005'],
    defaultOpen: true,
  },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [warningColor, setWarningColor] = useState<Color | string>('#f5222d');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [channel, setChannel] = useState('email');
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentHex = typeof warningColor === 'object' && 'toHexString' in warningColor
    ? warningColor.toHexString()
    : String(warningColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(currentHex, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [currentHex, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <div ref={containerRef}>
      <Card 
        title="Notifications" 
        style={{ width: 500 }}
        data-testid="notifications-panel"
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Checkbox checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)}>
            Email alerts
          </Checkbox>
          
          <Checkbox checked={pushAlerts} onChange={(e) => setPushAlerts(e.target.checked)}>
            Push alerts
          </Checkbox>
          
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Default channel</Text>
            <Select
              value={channel}
              onChange={setChannel}
              style={{ width: 200 }}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'push', label: 'Push notification' },
                { value: 'sms', label: 'SMS' },
              ]}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <Text>Warning badge color</Text>
            </div>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8 
              }}
            >
              <div
                data-testid="warning-target-amber"
                data-color={TARGET_COLOR}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: TARGET_COLOR,
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                }}
                title="Target: Amber"
              />
              <Text type="secondary" style={{ fontSize: 12 }}>Target: Amber</Text>
            </div>
            <div data-testid="warning-badge-color">
              <ColorPicker
                value={warningColor}
                onChange={setWarningColor}
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
          </div>
        </Space>
        <div data-testid="warning-badge-color-value" style={{ display: 'none' }}>
          {normalizeHex(currentHex)}
        </div>
      </Card>
    </div>
  );
}
