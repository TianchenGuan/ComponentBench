'use client';

/**
 * breadcrumb-antd-T06: Match breadcrumb separator style
 * 
 * Target sample shows breadcrumb with arrow (>) separators.
 * Three options with different separators: slash, arrow, arrow symbol.
 * Click the one matching the target (arrow >).
 */

import React, { useState } from 'react';
import { Breadcrumb, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    if (selected) return;
    setSelected(id);
    if (id === 'arrow') {
      onSuccess();
    }
  };

  const BreadcrumbOption = ({
    separator,
    id,
    label,
  }: {
    separator: string;
    id: string;
    label: string;
  }) => (
    <div
      onClick={() => handleSelect(id)}
      data-testid={`antd-breadcrumb-${id}-sep`}
      style={{
        padding: '8px 16px',
        borderRadius: 4,
        border: selected === id ? '2px solid #1677ff' : '1px solid #d9d9d9',
        cursor: 'pointer',
        marginBottom: 8,
        background: selected === id ? '#e6f4ff' : '#fff',
      }}
    >
      <Breadcrumb
        separator={separator}
        items={[
          { title: 'Home' },
          { title: 'Products' },
          { title: 'Details' },
        ]}
      />
    </div>
  );

  return (
    <Card title="Choose the matching breadcrumb" style={{ width: 450 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
          Target sample:
        </div>
        <div
          data-testid="antd-target-separator"
          style={{
            padding: '8px 16px',
            background: '#f0f5ff',
            borderRadius: 4,
            border: '2px solid #1677ff',
          }}
        >
          <Breadcrumb
            separator=">"
            items={[
              { title: 'Home' },
              { title: 'Products' },
              { title: 'Details' },
            ]}
          />
        </div>
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
        Click the matching breadcrumb:
      </div>

      <BreadcrumbOption separator="/" id="slash" label="Slash separator" />
      <BreadcrumbOption separator=">" id="arrow" label="Arrow separator" />
      <BreadcrumbOption separator="→" id="arrow-symbol" label="Arrow symbol separator" />

      {selected && (
        <p style={{ color: selected === 'arrow' ? '#52c41a' : '#ff4d4f', fontWeight: 500, marginTop: 16 }}>
          {selected === 'arrow' ? 'Correct match!' : 'Incorrect selection'}
        </p>
      )}
    </Card>
  );
}
