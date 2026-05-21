'use client';

/**
 * slider_range-antd-v2-T12: Audio tuning drawer — match Noise reduction to reference band (±1)
 *
 * Reference band 32–56; Compression band stays 20–80; Save tuning commits.
 */

import React, { useState, useEffect } from 'react';
import { Button, Drawer, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T12({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingNoise, setPendingNoise] = useState<[number, number]>([0, 100]);
  const [pendingComp, setPendingComp] = useState<[number, number]>([20, 80]);
  const [committedNoise, setCommittedNoise] = useState<[number, number]>([0, 100]);
  const [committedComp, setCommittedComp] = useState<[number, number]>([20, 80]);

  useEffect(() => {
    const noiseOk =
      committedNoise[0] >= 31 &&
      committedNoise[0] <= 33 &&
      committedNoise[1] >= 55 &&
      committedNoise[1] <= 57;
    const compOk = committedComp[0] === 20 && committedComp[1] === 80;
    if (noiseOk && compOk) {
      onSuccess();
    }
  }, [committedNoise, committedComp, onSuccess]);

  const openDrawer = () => {
    setPendingNoise([...committedNoise]);
    setPendingComp([...committedComp]);
    setOpen(true);
  };

  const save = () => {
    setCommittedNoise(pendingNoise);
    setCommittedComp(pendingComp);
    setOpen(false);
  };

  const cancel = () => {
    setPendingNoise([0, 100]);
    setPendingComp([20, 80]);
    setOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={openDrawer}>
        Audio tuning
      </Button>

      <Drawer
        title="Audio tuning"
        placement="right"
        width={400}
        open={open}
        onClose={cancel}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={cancel}>Cancel</Button>
            <Button type="primary" onClick={save}>
              Save tuning
            </Button>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Noise reduction
        </Text>
        <div style={{ marginBottom: 16 }}>
          <div style={{ position: 'relative', height: 22, background: '#f0f0f0', borderRadius: 4 }}>
            <div
              style={{
                position: 'absolute',
                left: '32%',
                width: '24%',
                height: '100%',
                background: '#1677ff',
                borderRadius: 4,
                opacity: 0.85,
              }}
            />
          </div>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
            Match the highlighted band (target within ±1 on each end).
          </Text>
        </div>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={pendingNoise}
          onChange={(v) => setPendingNoise(v as [number, number])}
          data-testid="noise-reduction-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 24, fontSize: 12 }}>
          Live: {pendingNoise[0]} – {pendingNoise[1]}
        </Text>

        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Compression band
        </Text>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={pendingComp}
          onChange={(v) => setPendingComp(v as [number, number])}
          data-testid="compression-band-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Live: {pendingComp[0]} – {pendingComp[1]}
        </Text>
      </Drawer>
    </div>
  );
}
