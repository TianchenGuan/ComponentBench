'use client';

/**
 * listbox_multi-antd-v2-T02: Data exports modal exact-subset recovery
 *
 * Modal with one Checkbox.Group labeled "Data exports" (14 options).
 * Initial: JSON, Audit log, Billing summary selected.
 * Target: CSV, PDF, Audit log, Invoices.
 * Confirm via "Save exports". Dark theme.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Checkbox, Modal, Space, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const exportOptions = [
  'CSV', 'PDF', 'JSON', 'Raw events', 'Audit log', 'Invoices',
  'Billing summary', 'PII bundle', 'Webhooks', 'Refund details',
  'Support tickets', 'Session logs', 'Usage metrics', 'Access logs',
];

const targetSet = ['CSV', 'PDF', 'Audit log', 'Invoices'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['JSON', 'Audit log', 'Billing summary']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  const handleSave = () => {
    setSaved(true);
    setModalOpen(false);
  };

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ padding: 24, background: '#141414', minHeight: '100vh' }}>
        <Card style={{ maxWidth: 480 }}>
          <Title level={4} style={{ margin: 0 }}>Report Center</Title>
          <Text type="secondary" style={{ display: 'block', marginTop: 4, marginBottom: 16 }}>
            Manage data export formats and schedules
          </Text>
          <Button type="primary" onClick={() => { setModalOpen(true); setSaved(false); }}>
            Customize exports
          </Button>
        </Card>

        <Modal
          title="Customize exports"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>Save exports</Button>
            </div>
          }
        >
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Data exports</Text>
          <Checkbox.Group
            value={selected}
            onChange={(vals) => { setSelected(vals as string[]); setSaved(false); }}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {exportOptions.map(opt => (
                <Checkbox key={opt} value={opt}>{opt}</Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
