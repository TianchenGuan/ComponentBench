'use client';

/**
 * slider_single-antd-v2-T04: Nested scroll — Smoothing = 7
 *
 * Outer page scroll + inner settings panel scroll. Sharpening=6, Contrast=5, Smoothing=4 below fold.
 * 0–10 integer sliders, row readout. Auto-apply (no Save).
 *
 * Success: Smoothing === 7; Sharpening === 6; Contrast === 5; require_confirm: false.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title, Paragraph } = Typography;

function SliderRow({
  label,
  value,
  onChange,
  testId,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  testId: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text strong>{label}</Text>
        <Text type="secondary" style={{ fontSize: 12, minWidth: 48, textAlign: 'right' }}>
          {value}
        </Text>
      </div>
      <Slider min={0} max={10} step={1} value={value} onChange={onChange} data-testid={testId} />
    </div>
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [sharpening, setSharpening] = useState(6);
  const [contrast, setContrast] = useState(5);
  const [smoothing, setSmoothing] = useState(4);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (smoothing === 7 && sharpening === 6 && contrast === 5) {
      successFired.current = true;
      onSuccess();
    }
  }, [smoothing, sharpening, contrast, onSuccess]);

  return (
    <div
      style={{
        height: 420,
        overflow: 'auto',
        padding: 12,
        background: '#fafafa',
        borderRadius: 8,
      }}
    >
      <Title level={5}>Workspace</Title>
      <Paragraph type="secondary" style={{ marginBottom: '1em' }}>
        Scroll down for the settings panel. The panel has its own scroll region for advanced controls.
      </Paragraph>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} size="small" style={{ marginBottom: 8 }} title={`Section ${i + 1}`}>
          <Text type="secondary">Placeholder content to drive outer scroll.</Text>
        </Card>
      ))}

      <Card size="small" title="Image settings" style={{ marginBottom: 24, maxWidth: 400 }}>
        <div
          style={{
            maxHeight: 200,
            overflow: 'auto',
            paddingRight: 4,
            border: '1px solid #f0f0f0',
            borderRadius: 6,
            padding: 12,
          }}
        >
          <SliderRow
            label="Sharpening"
            value={sharpening}
            onChange={setSharpening}
            testId="slider-sharpening"
          />
          <SliderRow label="Contrast" value={contrast} onChange={setContrast} testId="slider-contrast" />
          <div style={{ height: 120, color: '#ccc', fontSize: 12, paddingTop: 8 }}>
            … scroll within the panel …
          </div>
          <Title level={5} style={{ fontSize: 14, marginTop: 8 }}>
            Advanced processing
          </Title>
          <SliderRow
            label="Smoothing"
            value={smoothing}
            onChange={setSmoothing}
            testId="slider-smoothing"
          />
        </div>
      </Card>
    </div>
  );
}
