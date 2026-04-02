'use client';

/**
 * slider_single-antd-v2-T08: Popover irregular marks — Backoff budget = 8
 *
 * Backoff policy + "Advanced backoff" opens Popover with step=null marks 1,2,4,8,16.
 * Retry=4, Backoff=2. Cancel / Apply. Draft until Apply.
 *
 * Success (committed): Backoff budget === 8, Retry budget === 4.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Popover, Slider, Space, Switch, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title, Paragraph } = Typography;

const marks: Record<number, React.ReactNode> = {
  1: '1',
  2: '2',
  4: '4',
  8: '8',
  16: '16',
};

export default function T08({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftRetry, setDraftRetry] = useState(4);
  const [draftBackoff, setDraftBackoff] = useState(2);
  const [committedRetry, setCommittedRetry] = useState(4);
  const [committedBackoff, setCommittedBackoff] = useState(2);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedBackoff === 8 && committedRetry === 4) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBackoff, committedRetry, onSuccess]);

  const syncDraftFromCommitted = () => {
    setDraftRetry(committedRetry);
    setDraftBackoff(committedBackoff);
  };

  const content = (
    <div style={{ width: 320, padding: 4 }}>
      <div style={{ marginBottom: 20 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Retry budget
        </Text>
        <Slider
          min={1}
          max={16}
          step={null}
          marks={marks}
          value={draftRetry}
          onChange={setDraftRetry}
          data-testid="slider-retry-budget"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
          Backoff budget
        </Text>
        <Slider
          min={1}
          max={16}
          step={null}
          marks={marks}
          value={draftBackoff}
          onChange={setDraftBackoff}
          data-testid="slider-backoff-budget"
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          paddingTop: 12,
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Button
          onClick={() => {
            syncDraftFromCommitted();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setCommittedRetry(draftRetry);
            setCommittedBackoff(draftBackoff);
            setOpen(false);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 12, maxWidth: 560 }}>
      <Title level={5}>Backoff policy</Title>
      <Space wrap style={{ marginBottom: 12 }}>
        <Switch size="small" defaultChecked />
        <Tag>v2</Tag>
        <Tag color="geekblue">strict</Tag>
      </Space>
      <Paragraph type="secondary" style={{ marginBottom: '1em' }}>
        Configure retry and backoff budgets for downstream clients.
      </Paragraph>
      <Popover
        content={content}
        title="Advanced backoff"
        trigger="click"
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) syncDraftFromCommitted();
        }}
      >
        <Button type="primary">Advanced backoff</Button>
      </Popover>
    </div>
  );
}
