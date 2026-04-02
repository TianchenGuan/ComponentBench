'use client';

/**
 * slider_single-antd-v2-T07: Max requests 873 ±1 with Burst cap preserved
 *
 * Rate limiting panel: Max requests 0–1000 step 1, coarse marks; Burst 0–100.
 * Readouts after release. Initial 500 / 40. Apply limits commits.
 *
 * Success (committed): Max requests within ±1 of 873; Burst cap === 40.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Select, Slider, Space, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const TARGET = 873;
const TOL = 1;

const maxMarks = {
  0: '0',
  250: '250',
  500: '500',
  750: '750',
  1000: '1000',
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [draftMax, setDraftMax] = useState(500);
  const [draftBurst, setDraftBurst] = useState(40);
  const [dispMax, setDispMax] = useState(500);
  const [dispBurst, setDispBurst] = useState(40);
  const [committedMax, setCommittedMax] = useState(500);
  const [committedBurst, setCommittedBurst] = useState(40);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const okMax = Math.abs(committedMax - TARGET) <= TOL;
    if (okMax && committedBurst === 40) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedMax, committedBurst, onSuccess]);

  return (
    <div style={{ padding: 12, maxWidth: 440 }}>
      <Card
        size="small"
        title="Rate limiting"
        extra={
          <Space size="middle">
            <Switch size="small" defaultChecked />
            <Select
              size="small"
              defaultValue="regional"
              style={{ width: 110 }}
              options={[{ value: 'regional', label: 'Regional' }]}
            />
          </Space>
        }
      >
        <div style={{ marginBottom: 20 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Max requests
          </Text>
          <Slider
            min={0}
            max={1000}
            step={1}
            marks={maxMarks}
            value={draftMax}
            onChange={setDraftMax}
            onChangeComplete={setDispMax}
            data-testid="slider-max-requests"
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Current: {dispMax}
          </Text>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Burst cap
          </Text>
          <Slider
            min={0}
            max={100}
            step={1}
            value={draftBurst}
            onChange={setDraftBurst}
            onChangeComplete={setDispBurst}
            data-testid="slider-burst-cap"
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Current: {dispBurst}
          </Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            type="primary"
            onClick={() => {
              setCommittedMax(draftMax);
              setCommittedBurst(draftBurst);
            }}
          >
            Apply limits
          </Button>
        </div>
      </Card>
    </div>
  );
}
