'use client';

/**
 * slider_range-antd-v2-T09: Advanced alerts modal — CPU usage band and apply
 *
 * Dark modal with two range sliders; main-page summary updates only on Apply.
 * Success: committed CPU 55–85 %, Memory 25–65 %, after Apply.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Slider, Space, Tag, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCpu, setPendingCpu] = useState<[number, number]>([30, 70]);
  const [pendingMem, setPendingMem] = useState<[number, number]>([25, 65]);
  const [committedCpu, setCommittedCpu] = useState<[number, number]>([30, 70]);
  const [committedMem, setCommittedMem] = useState<[number, number]>([25, 65]);

  useEffect(() => {
    if (
      committedCpu[0] === 55 &&
      committedCpu[1] === 85 &&
      committedMem[0] === 25 &&
      committedMem[1] === 65
    ) {
      onSuccess();
    }
  }, [committedCpu, committedMem, onSuccess]);

  const openModal = () => {
    setPendingCpu([...committedCpu]);
    setPendingMem([...committedMem]);
    setModalOpen(true);
  };

  const apply = () => {
    setCommittedCpu(pendingCpu);
    setCommittedMem(pendingMem);
    setModalOpen(false);
  };

  const cancel = () => {
    setPendingCpu([30, 70]);
    setPendingMem([25, 65]);
    setModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Tag color="blue">Alerts</Tag>
        <Tag color="default">SLO OK</Tag>
        <Tag color="orange">1 warning</Tag>
      </Space>
      <Card size="small" title="Monitoring" style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Applied CPU: {committedCpu[0]}–{committedCpu[1]}% · Applied Memory: {committedMem[0]}–{committedMem[1]}%
        </Text>
      </Card>
      <Button type="primary" onClick={openModal}>
        Advanced alerts
      </Button>

      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Modal
          title="Advanced alerts"
          open={modalOpen}
          onCancel={cancel}
          footer={[
            <Button key="cancel" onClick={cancel}>
              Cancel
            </Button>,
            <Button key="apply" type="primary" onClick={apply}>
              Apply
            </Button>,
          ]}
          styles={{
            content: { background: '#1f1f1f' },
            header: { background: '#1f1f1f', borderBottom: '1px solid #333' },
          }}
        >
          <div style={{ padding: '8px 0' }}>
            <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>
              CPU usage alert (%)
            </Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={pendingCpu}
              onChange={(v) => setPendingCpu(v as [number, number])}
              data-testid="cpu-usage-alert-range"
            />
            <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: 12 }}>
              Pending: {pendingCpu[0]} – {pendingCpu[1]}%
            </Text>

            <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>
              Memory usage alert (%)
            </Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={pendingMem}
              onChange={(v) => setPendingMem(v as [number, number])}
              data-testid="memory-usage-alert-range"
            />
            <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
              Pending: {pendingMem[0]} – {pendingMem[1]}%
            </Text>
          </div>
        </Modal>
      </ConfigProvider>
    </div>
  );
}
