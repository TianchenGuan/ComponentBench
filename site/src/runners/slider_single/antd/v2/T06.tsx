'use client';

/**
 * slider_single-antd-v2-T06: Reverse Risk appetite + always-on tooltips in drawer
 *
 * Risk controls drawer: Throughput bias (normal) 55, Risk appetite (reverse) 70.
 * tooltips open while drawer open. Save controls / Cancel. Draft until Save.
 *
 * Success (committed): Risk appetite === 30, Throughput bias === 55.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Drawer, Slider, Space, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const tooltipOpen = { open: true as const };

export default function T06({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftThroughput, setDraftThroughput] = useState(55);
  const [draftRisk, setDraftRisk] = useState(70);
  const [committedThroughput, setCommittedThroughput] = useState(55);
  const [committedRisk, setCommittedRisk] = useState(70);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedRisk === 30 && committedThroughput === 55) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedRisk, committedThroughput, onSuccess]);

  return (
    <div style={{ padding: 12, maxWidth: 720 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Tag>Portfolio</Tag>
        <Tag color="orange">Review</Tag>
      </Space>
      <Title level={5}>Risk desk</Title>
      <Card size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary">Intraday exposure within band. Adjust controls from the drawer.</Text>
      </Card>
      <Button type="primary" onClick={() => setOpen(true)}>
        Risk controls
      </Button>

      <Drawer
        title="Risk controls"
        placement="right"
        width={420}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => {
                setCommittedThroughput(draftThroughput);
                setCommittedRisk(draftRisk);
              }}
            >
              Save controls
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 28 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Throughput bias
          </Text>
          <Slider
            min={0}
            max={100}
            step={1}
            value={draftThroughput}
            onChange={setDraftThroughput}
            tooltip={tooltipOpen}
            data-testid="slider-throughput-bias"
          />
        </div>
        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Risk appetite
          </Text>
          <Slider
            reverse
            min={0}
            max={100}
            step={1}
            value={draftRisk}
            onChange={setDraftRisk}
            tooltip={tooltipOpen}
            data-testid="slider-risk-appetite"
          />
        </div>
      </Drawer>
    </div>
  );
}
