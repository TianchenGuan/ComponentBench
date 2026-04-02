'use client';

/**
 * color_swatch_picker-antd-T12: Set Chart Series 2 color in settings panel
 *
 * Layout: settings_panel centered with 3 color pickers for chart series.
 * Must change Series 2 to Geek Blue while leaving others unchanged.
 *
 * Initial state: Series 1 = #52c41a, Series 2 = #1677ff, Series 3 = #fa8c16.
 * Success: Series 2 equals #2f54eb (Geek Blue).
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, ColorPicker, Typography, Checkbox, Divider, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { normalizeHex, hexMatches, BLUES_SWATCHES, BRAND_SWATCHES } from '../types';

const { Text } = Typography;

const TARGET_COLOR = '#2f54eb';

const presets = [
  {
    label: 'Blues',
    colors: BLUES_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
  {
    label: 'Brand',
    colors: BRAND_SWATCHES.map(s => s.color),
    defaultOpen: true,
  },
];

export default function T12({ task, onSuccess }: TaskComponentProps) {
  const [series1Color, setSeries1Color] = useState<Color | string>('#52c41a');
  const [series2Color, setSeries2Color] = useState<Color | string>('#1677ff');
  const [series3Color, setSeries3Color] = useState<Color | string>('#fa8c16');
  const [showGridlines, setShowGridlines] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const series2Hex = typeof series2Color === 'object' && 'toHexString' in series2Color
    ? series2Color.toHexString()
    : String(series2Color);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (hexMatches(series2Hex, TARGET_COLOR)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [series2Hex, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getSeriesHex = (color: Color | string) => {
    return typeof color === 'object' && 'toHexString' in color
      ? color.toHexString()
      : String(color);
  };

  return (
    <div ref={containerRef}>
      <Card 
        title="Chart Colors" 
        style={{ width: 550 }}
        data-testid="chart-colors-panel"
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <Space direction="vertical" size="middle" style={{ flex: 1 }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              data-testid="series-1-color"
            >
              <div 
                style={{ 
                  width: 16, height: 16, 
                  backgroundColor: getSeriesHex(series1Color),
                  borderRadius: 2,
                  border: '1px solid #d9d9d9',
                }} 
              />
              <Text style={{ width: 60 }}>Series 1</Text>
              <ColorPicker
                value={series1Color}
                onChange={setSeries1Color}
                showText
                size="small"
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
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              data-testid="series-2-color"
            >
              <div 
                style={{ 
                  width: 16, height: 16, 
                  backgroundColor: getSeriesHex(series2Color),
                  borderRadius: 2,
                  border: '1px solid #d9d9d9',
                }} 
              />
              <Text style={{ width: 60 }}>Series 2</Text>
              <ColorPicker
                value={series2Color}
                onChange={setSeries2Color}
                showText
                size="small"
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
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
              data-testid="series-3-color"
            >
              <div 
                style={{ 
                  width: 16, height: 16, 
                  backgroundColor: getSeriesHex(series3Color),
                  borderRadius: 2,
                  border: '1px solid #d9d9d9',
                }} 
              />
              <Text style={{ width: 60 }}>Series 3</Text>
              <ColorPicker
                value={series3Color}
                onChange={setSeries3Color}
                showText
                size="small"
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

            <Divider style={{ margin: '12px 0' }} />
            
            <Checkbox checked={showGridlines} onChange={(e) => setShowGridlines(e.target.checked)}>
              Show gridlines
            </Checkbox>
            <Checkbox checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)}>
              Show legend
            </Checkbox>
          </Space>
          
          <div style={{ width: 180, height: 120, background: '#fafafa', borderRadius: 8, padding: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Live preview</Text>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, height: 80, alignItems: 'flex-end' }}>
              <div style={{ width: 40, height: '60%', backgroundColor: getSeriesHex(series1Color), borderRadius: 2 }} />
              <div style={{ width: 40, height: '80%', backgroundColor: getSeriesHex(series2Color), borderRadius: 2 }} />
              <div style={{ width: 40, height: '40%', backgroundColor: getSeriesHex(series3Color), borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <div data-testid="series-2-color-value" style={{ display: 'none' }}>
          {normalizeHex(series2Hex)}
        </div>
      </Card>
    </div>
  );
}
