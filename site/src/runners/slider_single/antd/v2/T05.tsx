'use client';

/**
 * slider_single-antd-v2-T05: Vertical detection confidence in dark modal (±0.01 of 0.73)
 *
 * Background summary + log; "Detection threshold" opens dark Modal with vertical Slider 0–0.01 step.
 * Readout under slider updates on change complete. Save threshold / Cancel. Draft until Save.
 *
 * Success (committed): Detection confidence within ±0.01 of 0.73 after Save threshold.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal, Slider, Table, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const TARGET = 0.73;
const TOL = 0.01;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(0.5);
  const [display, setDisplay] = useState(0.5);
  const [committed, setCommitted] = useState(0.5);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (Math.abs(committed - TARGET) <= TOL) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <div style={{ padding: 12, maxWidth: 640 }}>
      <Card size="small" title="Detection summary" style={{ marginBottom: 12 }}>
        <Text type="secondary">Last run: OK · 1,204 frames</Text>
      </Card>
      <Table
        size="small"
        pagination={false}
        dataSource={[
          { key: '1', t: '10:02', m: 'motion' },
          { key: '2', t: '10:04', m: 'idle' },
        ]}
        columns={[
          { title: 'Time', dataIndex: 't', key: 't' },
          { title: 'Mode', dataIndex: 'm', key: 'm' },
        ]}
      />
      <Button type="primary" style={{ marginTop: 12 }} onClick={() => setOpen(true)}>
        Detection threshold
      </Button>

      <Modal
        title="Detection threshold"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={() => setCommitted(draft)}>
              Save threshold
            </Button>
          </div>
        }
        styles={{
          content: { background: '#141414' },
          header: { background: '#141414', color: '#fff', borderBottom: '1px solid #303030' },
          footer: { background: '#141414', borderTop: '1px solid #303030' },
        }}
      >
        <div style={{ color: '#fff' }}>
          <Text strong style={{ color: '#fff', display: 'block', marginBottom: 12 }}>
            Detection confidence
          </Text>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 16px' }}>
            <Slider
              vertical
              min={0}
              max={1}
              step={0.01}
              value={draft}
              onChange={setDraft}
              onChangeComplete={setDisplay}
              style={{ height: 220 }}
              data-testid="slider-detection-confidence"
            />
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            Current: {display.toFixed(2)}
          </Text>
        </div>
      </Modal>
    </div>
  );
}
