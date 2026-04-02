'use client';

/**
 * alpha_slider-antd-T10: Set Header overlay opacity to 88% in drawer and save
 *
 * A drawer-based flow (drawer opens from the right):
 * - Main page shows a button "Theme Tokens". Clicking it opens an AntD Drawer titled "Theme Tokens".
 * - Inside the drawer are two very similar sections, each with its own AntD ColorPicker control:
 *   1) "Header overlay" (target)
 *   2) "Sidebar overlay"
 * - Each ColorPicker opens its popup panel within the drawer and includes the Opacity slider labeled "Opacity" with a percent readout.
 * - The drawer footer contains two buttons: "Close" and a primary button "Save".
 * Initial state:
 * - Header overlay opacity = 95%.
 * - Sidebar overlay opacity = 60%.
 * Commit behavior:
 * - Adjustments are treated as draft while the drawer is open; the committed app state updates only after clicking "Save".
 * Clutter:
 * - The drawer also contains unrelated token inputs (border radius, font size) to increase distraction.
 *
 * Success: The committed 'Header overlay' alpha is set to 0.88 (88% opacity). Alpha must be within ±0.01 of the target value.
 * The drawer 'Save' button must be clicked to commit the value. The correct instance must be modified.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Button, Drawer, InputNumber, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text, Title } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  // Committed state
  const [committedHeaderColor, setCommittedHeaderColor] = useState<string>('rgba(22, 119, 255, 0.95)');
  const [committedSidebarColor, setCommittedSidebarColor] = useState<string>('rgba(82, 196, 26, 0.6)');
  
  // Draft state (in drawer)
  const [draftHeaderColor, setDraftHeaderColor] = useState<Color | string>('rgba(22, 119, 255, 0.95)');
  const [draftSidebarColor, setDraftSidebarColor] = useState<Color | string>('rgba(82, 196, 26, 0.6)');
  const [borderRadius, setBorderRadius] = useState(8);
  const [fontSize, setFontSize] = useState(14);
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const match = committedHeaderColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    const alpha = match ? parseFloat(match[1]) : 1;

    if (isAlphaWithinTolerance(alpha, 0.88, 0.01)) {
      onSuccess();
    }
  }, [committedHeaderColor, onSuccess]);

  const handleOpenDrawer = () => {
    setDraftHeaderColor(committedHeaderColor);
    setDraftSidebarColor(committedSidebarColor);
    setDrawerOpen(true);
  };

  const handleSave = () => {
    const headerStr = typeof draftHeaderColor === 'string'
      ? draftHeaderColor
      : draftHeaderColor && 'toRgbString' in draftHeaderColor
        ? draftHeaderColor.toRgbString()
        : committedHeaderColor;
    const sidebarStr = typeof draftSidebarColor === 'string'
      ? draftSidebarColor
      : draftSidebarColor && 'toRgbString' in draftSidebarColor
        ? draftSidebarColor.toRgbString()
        : committedSidebarColor;
    
    setCommittedHeaderColor(headerStr);
    setCommittedSidebarColor(sidebarStr);
    setDrawerOpen(false);
  };

  const handleClose = () => {
    setDrawerOpen(false);
  };

  const getAlphaPercent = (color: Color | string): number => {
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      return match ? Math.round(parseFloat(match[1]) * 100) : 100;
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      return Math.round((rgb.a ?? 1) * 100);
    }
    return 100;
  };

  return (
    <Card style={{ width: 400, textAlign: 'center' }}>
      <Text style={{ display: 'block', marginBottom: 24 }}>
        Configure your theme tokens
      </Text>

      <Button type="primary" onClick={handleOpenDrawer} data-testid="theme-tokens-button">
        Theme Tokens
      </Button>

      <Drawer
        title="Theme Tokens"
        placement="right"
        onClose={handleClose}
        open={drawerOpen}
        width={360}
        footer={
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Close</Button>
            <Button type="primary" onClick={handleSave} data-testid="save-button">
              Save
            </Button>
          </Space>
        }
      >
        {/* Header overlay section - TARGET */}
        <Title level={5} style={{ marginTop: 0 }}>Header overlay</Title>
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
          data-testid="header-overlay-section"
        >
          <Text>Color</Text>
          <ColorPicker
            value={draftHeaderColor}
            onChange={setDraftHeaderColor}
            showText={() => `${getAlphaPercent(draftHeaderColor)}%`}
            data-testid="header-overlay-picker"
          />
        </div>

        <Divider />

        {/* Sidebar overlay section */}
        <Title level={5}>Sidebar overlay</Title>
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
          data-testid="sidebar-overlay-section"
        >
          <Text>Color</Text>
          <ColorPicker
            value={draftSidebarColor}
            onChange={setDraftSidebarColor}
            showText={() => `${getAlphaPercent(draftSidebarColor)}%`}
            data-testid="sidebar-overlay-picker"
          />
        </div>

        <Divider />

        {/* Distractor controls */}
        <Title level={5}>Other tokens</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text>Border radius</Text>
          <InputNumber value={borderRadius} onChange={(v) => setBorderRadius(v ?? 8)} min={0} max={24} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Base font size</Text>
          <InputNumber value={fontSize} onChange={(v) => setFontSize(v ?? 14)} min={10} max={24} />
        </div>
      </Drawer>
    </Card>
  );
}
