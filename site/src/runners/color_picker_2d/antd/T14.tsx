'use client';

/**
 * color_picker_2d-antd-T14: Dashboard toolbar: set Chart line color
 *
 * Layout: dashboard scene anchored top-left with multiple typical widgets (filters, metric cards, small chart preview).
 * The target control is in a dense toolbar above a chart preview. The ColorPicker uses a custom trigger: a small palette icon button labeled "Chart line color".
 * The trigger is compact and visually similar to adjacent icon buttons (download, refresh, settings), increasing acquisition difficulty.
 * Clicking the palette icon opens the AntD ColorPicker popover with the standard 2D panel and hue slider; presets are disabled.
 * Initial state: chart line color is a medium gray (#595959). The target is #2F54EB (indigo/blue).
 * Clutter: the dashboard contains many non-target buttons and inputs, but only the chart line ColorPicker state is checked.
 *
 * Success: Component value represents color RGBA(47, 84, 235, 1.0) within tolerance (rgba_max_abs_channel_error: 5, alpha_max_abs_error: 0.02).
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Button, Space, Statistic, Row, Col, Select } from 'antd';
import { DownloadOutlined, ReloadOutlined, SettingOutlined, BgColorsOutlined } from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

const TARGET_COLOR: RGBA = { r: 47, g: 84, b: 235, a: 1.0 };
const RGB_TOLERANCE = 5;
const ALPHA_TOLERANCE = 0.02;

export default function T14({ onSuccess }: TaskComponentProps) {
  const [chartColor, setChartColor] = useState<Color | string>('#595959');
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    let rgba: RGBA | null = null;
    
    if (typeof chartColor === 'string') {
      const hex = chartColor.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (chartColor && typeof chartColor === 'object' && 'toRgb' in chartColor) {
      const rgb = chartColor.toRgb();
      rgba = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.a ?? 1 };
    }

    if (rgba && isColorWithinTolerance(rgba, TARGET_COLOR, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      onSuccess();
    }
  }, [chartColor, onSuccess]);

  const getColorHex = (color: Color | string): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toHexString' in color) {
      return color.toHexString();
    }
    return '#595959';
  };

  return (
    <div style={{ width: 560 }}>
      {/* Filters row */}
      <Space style={{ marginBottom: 12 }}>
        <Select 
          size="small" 
          value={period} 
          onChange={setPeriod}
          style={{ width: 100 }}
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
          ]}
        />
        <Button size="small">Apply filters</Button>
      </Space>
      
      {/* Metric cards */}
      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Total visits" value={12450} />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Bounce rate" value="32%" />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small">
            <Statistic title="Avg. session" value="4:32" />
          </Card>
        </Col>
      </Row>
      
      {/* Chart card with toolbar */}
      <Card 
        size="small"
        title="Traffic Overview"
        extra={
          <Space size="small">
            <Button size="small" icon={<DownloadOutlined />} />
            <Button size="small" icon={<ReloadOutlined />} />
            <ColorPicker
              value={chartColor}
              onChange={setChartColor}
              size="small"
              data-testid="chart-line-color"
            >
              <Button 
                size="small" 
                icon={<BgColorsOutlined />} 
                title="Chart line color"
              />
            </ColorPicker>
            <Button size="small" icon={<SettingOutlined />} />
          </Space>
        }
      >
        {/* Mock chart */}
        <div style={{ 
          height: 120, 
          background: '#fafafa', 
          borderRadius: 4, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <svg width="100%" height="100%" viewBox="0 0 400 100">
            <polyline 
              points="0,80 50,60 100,70 150,40 200,50 250,30 300,45 350,20 400,35"
              fill="none"
              stroke={getColorHex(chartColor)}
              strokeWidth="2"
            />
          </svg>
        </div>
      </Card>
      
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Dashboard → Chart line color: #2F54EB
        </Text>
      </div>
    </div>
  );
}
