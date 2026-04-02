'use client';

/**
 * radio_group-antd-T08: Charts: pick the style that matches the reference thumbnail (dark)
 *
 * A single isolated card titled "Charts" is centered in the viewport, using a dark theme (dark background with light text).
 * The card contains one Ant Design Radio.Group configured as button-style radios (optionType="button", buttonStyle="solid").
 * There are six compact options rendered as small button tiles, each with a tiny thumbnail icon and a short label:
 * - Line
 * - Area
 * - Stacked
 * - Grouped
 * - Scatter
 * - Table
 * Above the group is a non-interactive "Reference" thumbnail showing stacked bars (no text label).
 * Initial state: "Line" is selected.
 * When a choice is selected, a larger preview below updates immediately. No Apply button is present.
 *
 * Success: The selected value in the "Chart style" button-radio group equals "stacked" (label "Stacked").
 */

import React, { useState } from 'react';
import { Card, Radio, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { LineChartOutlined, AreaChartOutlined, BarChartOutlined, DotChartOutlined, TableOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const options = [
  { label: 'Line', value: 'line', icon: <LineChartOutlined /> },
  { label: 'Area', value: 'area', icon: <AreaChartOutlined /> },
  { label: 'Stacked', value: 'stacked', icon: <BarChartOutlined /> },
  { label: 'Grouped', value: 'grouped', icon: <BarChartOutlined style={{ transform: 'rotate(90deg)' }} /> },
  { label: 'Scatter', value: 'scatter', icon: <DotChartOutlined /> },
  { label: 'Table', value: 'table', icon: <TableOutlined /> },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('line');

  const handleChange = (e: RadioChangeEvent) => {
    const value = e.target.value;
    setSelected(value);
    if (value === 'stacked') {
      onSuccess();
    }
  };

  return (
    <Card 
      title={<span style={{ color: '#fff' }}>Charts</span>}
      style={{ 
        width: 480, 
        background: '#1f1f1f',
        border: '1px solid #424242'
      }}
      styles={{
        header: { borderBottom: '1px solid #424242', color: '#fff' },
        body: { background: '#1f1f1f' }
      }}
    >
      {/* Reference thumbnail */}
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: '#999', fontSize: 12, display: 'block', marginBottom: 8 }}>Reference</Text>
        <div style={{ 
          width: 80, 
          height: 50, 
          background: '#2a2a2a', 
          borderRadius: 4,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 4,
          padding: 8
        }}>
          {/* Stacked bars visual */}
          <div style={{ width: 12, background: 'linear-gradient(to top, #1890ff 50%, #52c41a 50%)', height: 32 }} />
          <div style={{ width: 12, background: 'linear-gradient(to top, #1890ff 40%, #52c41a 40%)', height: 24 }} />
          <div style={{ width: 12, background: 'linear-gradient(to top, #1890ff 60%, #52c41a 60%)', height: 40 }} />
          <div style={{ width: 12, background: 'linear-gradient(to top, #1890ff 45%, #52c41a 45%)', height: 28 }} />
        </div>
      </div>

      {/* Radio button group */}
      <Text style={{ color: '#ccc', display: 'block', marginBottom: 12 }}>Chart style</Text>
      <Radio.Group
        data-canonical-type="radio_group"
        data-selected-value={selected}
        value={selected}
        onChange={handleChange}
        optionType="button"
        buttonStyle="solid"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        {options.map(option => (
          <Radio.Button 
            key={option.value} 
            value={option.value}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              background: selected === option.value ? '#1890ff' : '#2a2a2a',
              borderColor: '#424242',
              color: '#fff'
            }}
          >
            {option.icon}
            <span style={{ marginLeft: 4 }}>{option.label}</span>
          </Radio.Button>
        ))}
      </Radio.Group>

      {/* Preview area */}
      <div style={{ 
        marginTop: 16, 
        height: 120, 
        background: '#2a2a2a', 
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}>
        <Text style={{ color: '#888' }}>Preview: {options.find(o => o.value === selected)?.label}</Text>
      </div>
    </Card>
  );
}
