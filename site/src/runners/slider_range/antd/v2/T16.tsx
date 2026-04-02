'use client';

/**
 * slider_range-antd-v2-T16: Quality controls drawer — decimal 0–1 scale, ±0.01 tolerance
 *
 * Success: committed Quality within ±0.01 of 0.24–0.63; Safety 0.20–0.70; Save controls.
 */

import React, { useState, useEffect } from 'react';
import { Button, Drawer, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

function approxEq(a: number, b: number, eps = 0.0001) {
  return Math.abs(a - b) < eps;
}

export default function T16({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingQ, setPendingQ] = useState<[number, number]>([0.1, 0.8]);
  const [pendingS, setPendingS] = useState<[number, number]>([0.2, 0.7]);
  const [committedQ, setCommittedQ] = useState<[number, number]>([0.1, 0.8]);
  const [committedS, setCommittedS] = useState<[number, number]>([0.2, 0.7]);

  useEffect(() => {
    const qOk =
      committedQ[0] >= 0.23 &&
      committedQ[0] <= 0.25 &&
      committedQ[1] >= 0.62 &&
      committedQ[1] <= 0.64;
    const sOk = approxEq(committedS[0], 0.2) && approxEq(committedS[1], 0.7);
    if (qOk && sOk) {
      onSuccess();
    }
  }, [committedQ, committedS, onSuccess]);

  const openDrawer = () => {
    setPendingQ([...committedQ]);
    setPendingS([...committedS]);
    setOpen(true);
  };

  const save = () => {
    setCommittedQ(pendingQ);
    setCommittedS(pendingS);
    setOpen(false);
  };

  const cancel = () => {
    setPendingQ([0.1, 0.8]);
    setPendingS([0.2, 0.7]);
    setOpen(false);
  };

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div>
      <Button type="primary" onClick={openDrawer}>
        Quality controls
      </Button>

      <Drawer
        title="Quality controls"
        placement="right"
        width={420}
        styles={{ wrapper: { top: 48 } }}
        open={open}
        onClose={cancel}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={cancel}>Cancel</Button>
            <Button type="primary" onClick={save}>
              Save controls
            </Button>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Quality band
        </Text>
        <Slider
          range
          min={0}
          max={1}
          step={0.01}
          value={pendingQ}
          onChange={(v) => setPendingQ(v as [number, number])}
          data-testid="quality-band-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 20, fontSize: 12 }}>
          {fmt(pendingQ[0])} – {fmt(pendingQ[1])} (committed {fmt(committedQ[0])} – {fmt(committedQ[1])})
        </Text>

        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Safety band
        </Text>
        <Slider
          range
          min={0}
          max={1}
          step={0.01}
          value={pendingS}
          onChange={(v) => setPendingS(v as [number, number])}
          data-testid="safety-band-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          {fmt(pendingS[0])} – {fmt(pendingS[1])} (committed {fmt(committedS[0])} – {fmt(committedS[1])})
        </Text>
      </Drawer>
    </div>
  );
}
