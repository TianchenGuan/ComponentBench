'use client';

/**
 * slider_range-antd-v2-T15: Release window on irregular marks — crowded dashboard
 *
 * Release window: step=null, marks only; other sliders must stay unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Card, Slider, Typography, Row, Col } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const releaseMarks = {
  5: '5',
  15: '15',
  25: '25',
  35: '35',
  70: '70',
  80: '80',
  90: '90',
};

export default function T15({ onSuccess }: TaskComponentProps) {
  const [release, setRelease] = useState<[number, number]>([5, 90]);
  const [latency, setLatency] = useState<[number, number]>([10, 40]);
  const [throughput, setThroughput] = useState<[number, number]>([15, 85]);
  const [budget, setBudget] = useState<[number, number]>([5, 95]);

  useEffect(() => {
    if (
      release[0] === 35 &&
      release[1] === 80 &&
      latency[0] === 10 &&
      latency[1] === 40 &&
      throughput[0] === 15 &&
      throughput[1] === 85 &&
      budget[0] === 5 &&
      budget[1] === 95
    ) {
      onSuccess();
    }
  }, [release, latency, throughput, budget, onSuccess]);

  return (
    <div style={{ maxWidth: 760 }}>
      <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 16 }}>
        Dashboard
      </Text>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12}>
          <Card size="small" title="Release controls">
            <Text style={{ display: 'block', marginBottom: 8 }}>Release window</Text>
            <Slider
              range
              min={0}
              max={100}
              step={null}
              marks={releaseMarks}
              value={release}
              onChange={(v) => setRelease(v as [number, number])}
              data-testid="release-window-range"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Selected: {release[0]} – {release[1]}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small" title="Latency envelope">
            <Text style={{ display: 'block', marginBottom: 8 }}>p50–p99 (ms)</Text>
            <Slider
              range
              min={0}
              max={100}
              step={5}
              value={latency}
              onChange={(v) => setLatency(v as [number, number])}
              data-testid="latency-envelope-range"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {latency[0]} – {latency[1]}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small" title="Throughput guard">
            <Text style={{ display: 'block', marginBottom: 8 }}>RPS band</Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={throughput}
              onChange={(v) => setThroughput(v as [number, number])}
              data-testid="throughput-guard-range"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {throughput[0]} – {throughput[1]}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card size="small" title="SRE budget">
            <Text style={{ display: 'block', marginBottom: 8 }}>Error budget window</Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={budget}
              onChange={(v) => setBudget(v as [number, number])}
              data-testid="error-budget-range"
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {budget[0]} – {budget[1]}
            </Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
