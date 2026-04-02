'use client';

/**
 * slider_single-antd-T10: Scroll and set Noise reduction to 92 in a dashboard
 * 
 * Layout: dashboard with multiple cards, anchored toward the top-left of the viewport; the page requires vertical scrolling.
 * The dashboard contains charts, status pills, and four slider controls spread across different cards:
 *   - "Echo cancel" slider
 *   - "Gain" slider
 *   - "Compression" slider
 *   - "Noise reduction" slider (TARGET)
 * Clutter is high: there are non-required buttons (Export, Refresh), small sparklines, and a few toggles, but only sliders affect the checker.
 * The target slider is inside the "Audio Processing" card which is below the fold; the agent must scroll down to reach it.
 * Slider configuration for all four: range 0–100, step=1, no marks, tooltip shows value only while dragging.
 * Initial state: Noise reduction starts at 60.
 * There is no Apply/Cancel; the value is committed immediately when changed.
 * 
 * Success: The 'Noise reduction' slider value equals 92. The correct instance is required: only the slider labeled 'Noise reduction' counts.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Button, Space, Switch, Badge, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [echoCancel, setEchoCancel] = useState(45);
  const [gain, setGain] = useState(55);
  const [compression, setCompression] = useState(30);
  const [noiseReduction, setNoiseReduction] = useState(60);

  useEffect(() => {
    if (noiseReduction === 92) {
      onSuccess();
    }
  }, [noiseReduction, onSuccess]);

  const SparkLine = () => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 30 }}>
      {[30, 45, 65, 80, 55, 40, 70, 50, 60, 75].map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            background: '#1677ff',
            borderRadius: 2,
            minWidth: 4,
          }}
        />
      ))}
    </div>
  );

  return (
    <div style={{ width: 600, minHeight: 1200 }}>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Title level={4} style={{ margin: 0 }}>Audio Dashboard</Title>
        <Space>
          <Button>Export</Button>
          <Button type="primary">Refresh</Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]}>
        {/* KPI Cards */}
        <Col span={12}>
          <Card size="small">
            <Text type="secondary">Active Streams</Text>
            <Title level={3} style={{ margin: '8px 0' }}>128</Title>
            <Badge status="success" text="Online" />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Text type="secondary">Latency</Text>
            <Title level={3} style={{ margin: '8px 0' }}>24ms</Title>
            <Badge status="processing" text="Normal" />
          </Card>
        </Col>

        {/* Echo Cancel Card */}
        <Col span={12}>
          <Card title="Echo Settings" size="small">
            <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Enabled</Text>
              <Switch defaultChecked />
            </Space>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Echo cancel</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={echoCancel}
              onChange={setEchoCancel}
              data-testid="slider-echo-cancel"
            />
            <Text type="secondary">Current: {echoCancel}</Text>
          </Card>
        </Col>

        {/* Gain Card */}
        <Col span={12}>
          <Card title="Input Gain" size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Gain</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={gain}
              onChange={setGain}
              data-testid="slider-gain"
            />
            <Text type="secondary">Current: {gain}</Text>
            <SparkLine />
          </Card>
        </Col>

        {/* Compression Card */}
        <Col span={24}>
          <Card title="Dynamics" size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Compression</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={compression}
              onChange={setCompression}
              data-testid="slider-compression"
            />
            <Text type="secondary">Current: {compression}</Text>
          </Card>
        </Col>

        {/* Spacer for scroll */}
        <Col span={24}>
          <Card size="small">
            <Text type="secondary">Weekly Analytics</Text>
            <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SparkLine />
            </div>
          </Card>
        </Col>

        {/* Audio Processing Card - TARGET */}
        <Col span={24}>
          <Card title="Audio Processing" size="small">
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Noise reduction</Text>
            <Slider
              min={0}
              max={100}
              step={1}
              value={noiseReduction}
              onChange={setNoiseReduction}
              data-testid="slider-noise-reduction"
            />
            <Text type="secondary">Current: {noiseReduction}</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
