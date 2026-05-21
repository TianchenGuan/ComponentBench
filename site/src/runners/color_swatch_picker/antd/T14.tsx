'use client';

/**
 * color_swatch_picker-antd-T14: Set banner background and save in drawer
 *
 * Layout: drawer_flow with a button that opens a drawer.
 * The drawer contains two ColorPickers and requires clicking "Save" to commit.
 *
 * Initial state: Text color = #ffffff, Background color = #1677ff.
 * Success: Committed Background color equals #1d39c4 (Navy) after clicking Save.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Drawer, Button, Switch, Input, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BLUES_SWATCHES, NEUTRAL_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#1d39c4';

const presets = [
  {
    label: 'Blues',
    colors: BLUES_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Neutrals',
    colors: NEUTRAL_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T14({ task, onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [committedTextColor, setCommittedTextColor] = useState<string>('#ffffff');
  const [committedBgColor, setCommittedBgColor] = useState<string>('#1677ff');
  const [pendingTextColor, setPendingTextColor] = useState<Color | string>('#ffffff');
  const [pendingBgColor, setPendingBgColor] = useState<Color | string>('#1677ff');
  const [bannerTitle, setBannerTitle] = useState('Welcome!');
  const [showBanner, setShowBanner] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pendingBgHex = typeof pendingBgColor === 'object' && 'toHexString' in pendingBgColor
    ? pendingBgColor.toHexString()
    : String(pendingBgColor);

  const pendingTextHex = typeof pendingTextColor === 'object' && 'toHexString' in pendingTextColor
    ? pendingTextColor.toHexString()
    : String(pendingTextColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(committedBgColor, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [committedBgColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleOpen = () => {
    setPendingTextColor(committedTextColor);
    setPendingBgColor(committedBgColor);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    setCommittedTextColor(normalizeHex(pendingTextHex));
    setCommittedBgColor(normalizeHex(pendingBgHex));
    setIsDrawerOpen(false);
  };

  const handleCancel = () => {
    setPendingTextColor(committedTextColor);
    setPendingBgColor(committedBgColor);
    setIsDrawerOpen(false);
  };

  return (
    <div ref={containerRef}>
      <Card style={{ width: 450 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div 
            style={{ 
              padding: 16, 
              backgroundColor: committedBgColor, 
              color: committedTextColor,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <Text style={{ color: committedTextColor, fontSize: 16 }}>{bannerTitle}</Text>
          </div>
          <Button type="primary" onClick={handleOpen}>
            Edit banner
          </Button>
        </Space>
      </Card>

      <Drawer
        title="Edit banner"
        placement="right"
        open={isDrawerOpen}
        onClose={handleCancel}
        width={400}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave}>Save</Button>
          </div>
        }
        getContainer={() => containerRef.current || document.body}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text style={{ display: 'block', marginBottom: 4 }}>Banner title</Text>
            <Input value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text>Show banner</Text>
            <Switch checked={showBanner} onChange={setShowBanner} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Text color</Text>
            <ColorPicker
              value={pendingTextColor}
              onChange={setPendingTextColor}
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
          
          <div 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            data-testid="background-color"
          >
            <Text>Background color</Text>
            <ColorPicker
              value={pendingBgColor}
              onChange={setPendingBgColor}
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
          
          <Divider />
          
          <div 
            style={{ 
              padding: 16, 
              backgroundColor: pendingBgHex, 
              color: pendingTextHex,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <Text style={{ color: pendingTextHex }}>Preview: {bannerTitle}</Text>
          </div>
        </Space>
      </Drawer>

      <div data-testid="banner-bg-committed" style={{ display: 'none' }}>
        {normalizeHex(committedBgColor)}
      </div>
    </div>
  );
}
