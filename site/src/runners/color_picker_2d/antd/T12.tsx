'use client';

/**
 * color_picker_2d-antd-T12: Table cell: match Paused badge color
 *
 * Layout: table_cell scene. A small table titled "Status badge colors" is centered on the page.
 * The table has three rows: Active, Paused, Archived. Each row has a "Badge color" column containing an AntD ColorPicker trigger rendered as a small swatch (compact table cell).
 * Instances: 3 color pickers total (one per row). The target instance is the "Paused" row.
 * Guidance is mixed: in the Paused row, a small "Reference" column shows a solid reference swatch and a short caption (e.g., "Paused reference") next to it.
 * The ColorPicker popover uses the standard 2D panel + hue slider; preset colors are disabled to force matching.
 * Initial state: Paused badge color is intentionally incorrect (e.g., gray), while Active/Archived are already set.
 * Clutter: the table includes non-interactive columns (e.g., "Example badge") and a few unrelated filter chips above the table.
 *
 * Success: Paused badge color matches the on-page reference swatch 'paused-reference-swatch' within tolerance.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ColorPicker, Typography, Table, Tag, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps, RGBA } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text } = Typography;

// Reference color for Paused row
const PAUSED_REFERENCE: RGBA = { r: 250, g: 173, b: 20, a: 1.0 }; // #FAAD14 - Gold
const RGB_TOLERANCE = 10;
const ALPHA_TOLERANCE = 0.025;

interface RowData {
  key: string;
  status: string;
  color: Color | string;
  reference?: RGBA;
}

export default function T12({ onSuccess }: TaskComponentProps) {
  const [rows, setRows] = useState<RowData[]>([
    { key: 'active', status: 'Active', color: '#52C41A' },
    { key: 'paused', status: 'Paused', color: '#8C8C8C', reference: PAUSED_REFERENCE },
    { key: 'archived', status: 'Archived', color: '#595959' },
  ]);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current) return;

    const pausedRow = rows.find(r => r.key === 'paused');
    if (!pausedRow) return;

    let rgba: RGBA | null = null;
    const color = pausedRow.color;
    
    if (typeof color === 'string') {
      const hex = color.replace('#', '');
      if (hex.length >= 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      rgba = { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.a ?? 1 };
    }

    if (rgba && isColorWithinTolerance(rgba, PAUSED_REFERENCE, RGB_TOLERANCE, ALPHA_TOLERANCE)) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [rows, onSuccess]);

  const updateRowColor = (key: string, newColor: Color | string) => {
    setRows(prev => prev.map(row => 
      row.key === key ? { ...row, color: newColor } : row
    ));
  };

  const getColorHex = (color: Color | string): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toHexString' in color) {
      return color.toHexString();
    }
    return '#000';
  };

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Example badge',
      key: 'badge',
      width: 120,
      render: (_: unknown, record: RowData) => (
        <Tag color={getColorHex(record.color)}>{record.status}</Tag>
      ),
    },
    {
      title: 'Badge color',
      key: 'color',
      width: 80,
      render: (_: unknown, record: RowData) => (
        <ColorPicker
          value={record.color}
          onChange={(c) => updateRowColor(record.key, c)}
          size="small"
          data-testid={`row-${record.key}-color`}
        />
      ),
    },
    {
      title: 'Reference',
      key: 'reference',
      width: 100,
      render: (_: unknown, record: RowData) => record.reference ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div 
            data-testid="paused-reference-swatch"
            style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: `rgba(${record.reference.r}, ${record.reference.g}, ${record.reference.b}, ${record.reference.a})`,
              borderRadius: 4,
              border: '1px solid #d9d9d9',
            }} 
          />
          <Text type="secondary" style={{ fontSize: 11 }}>Target</Text>
        </div>
      ) : null,
    },
  ];

  return (
    <Card title="Status badge colors" style={{ width: 500 }}>
      <Space style={{ marginBottom: 12 }}>
        <Tag>All</Tag>
        <Tag>Active only</Tag>
        <Tag>Inactive</Tag>
      </Space>
      
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        size="small"
      />
      
      <div style={{ marginTop: 12 }}>
        <Text type="secondary" style={{ fontSize: 11 }}>
          Set the Paused badge color to match its reference swatch.
        </Text>
      </div>
    </Card>
  );
}
