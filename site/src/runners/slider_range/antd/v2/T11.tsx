'use client';

/**
 * slider_range-antd-v2-T11: Schedule tuning drawer — Quiet hours (draggable track) + Noise window
 *
 * Success: committed Quiet hours 30–50, Noise 10–25, after Save schedule.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Drawer, Slider, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T11({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [pendingQuiet, setPendingQuiet] = useState<[number, number]>([20, 40]);
  const [pendingNoise, setPendingNoise] = useState<[number, number]>([10, 25]);
  const [committedQuiet, setCommittedQuiet] = useState<[number, number]>([20, 40]);
  const [committedNoise, setCommittedNoise] = useState<[number, number]>([10, 25]);

  useEffect(() => {
    if (
      committedQuiet[0] === 30 &&
      committedQuiet[1] === 50 &&
      committedNoise[0] === 10 &&
      committedNoise[1] === 25
    ) {
      onSuccess();
    }
  }, [committedQuiet, committedNoise, onSuccess]);

  const openDrawer = () => {
    setPendingQuiet([...committedQuiet]);
    setPendingNoise([...committedNoise]);
    setOpen(true);
  };

  const save = () => {
    setCommittedQuiet(pendingQuiet);
    setCommittedNoise(pendingNoise);
    setOpen(false);
  };

  const cancel = () => {
    setPendingQuiet([20, 40]);
    setPendingNoise([10, 25]);
    setOpen(false);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <Card size="small" style={{ marginBottom: 12 }} title="Calendar">
        <Text type="secondary" style={{ fontSize: 12 }}>
          Week view · 6 events · maintenance Tue
        </Text>
      </Card>
      <Card size="small" style={{ marginBottom: 12 }} title="Alert timeline">
        <div style={{ height: 48, background: 'linear-gradient(90deg,#f5f5f5,#e6f4ff,#f5f5f5)', borderRadius: 4 }} />
      </Card>
      <Button type="primary" onClick={openDrawer}>
        Schedule tuning
      </Button>

      <Drawer
        title="Schedule tuning"
        placement="bottom"
        height={420}
        open={open}
        onClose={cancel}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={cancel}>Cancel</Button>
            <Button type="primary" onClick={save}>
              Save schedule
            </Button>
          </div>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Quiet hours
        </Text>
        <Slider
          range={{ draggableTrack: true }}
          min={0}
          max={100}
          step={1}
          value={pendingQuiet}
          onChange={(v: number | number[]) => setPendingQuiet(v as [number, number])}
          data-testid="quiet-hours-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, marginBottom: 4, fontSize: 12 }}>
          Pending: {pendingQuiet[0]} – {pendingQuiet[1]} (width {pendingQuiet[1] - pendingQuiet[0]})
        </Text>
        <Text type="secondary" style={{ display: 'block', marginBottom: 20, fontSize: 12, fontStyle: 'italic' }}>
          Drag the selected window or move both handles until the width stays 20.
        </Text>

        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Noise window
        </Text>
        <Slider
          range
          min={0}
          max={100}
          step={1}
          value={pendingNoise}
          onChange={(v: number | number[]) => setPendingNoise(v as [number, number])}
          data-testid="noise-window-range"
        />
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Pending: {pendingNoise[0]} – {pendingNoise[1]}
        </Text>
      </Drawer>
    </div>
  );
}
