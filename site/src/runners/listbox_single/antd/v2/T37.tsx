'use client';

/**
 * listbox_single-antd-v2-T37: Modal labels: set Secondary label to Legal and finish
 *
 * A document-management page has a "Label settings" button. Modal contains two AntD Menu
 * listboxes: "Primary label" (Finance, Legal, Marketing, Sales — initial: Finance, must stay)
 * and "Secondary label" (same options, initial: Marketing). Footer: "Cancel" and "Done".
 * Committed chip on base page changes only after Done.
 *
 * Success: Secondary label = "legal", Primary label still "finance", "Done" clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Menu, Typography, Card, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const labelOptions = [
  { key: 'finance', label: 'Finance' },
  { key: 'legal', label: 'Legal' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'sales', label: 'Sales' },
];

export default function T37({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [primaryLabel, setPrimaryLabel] = useState<string>('finance');
  const [secondaryLabel, setSecondaryLabel] = useState<string>('marketing');
  const [done, setDone] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (done && secondaryLabel === 'legal' && primaryLabel === 'finance') {
      successFired.current = true;
      onSuccess();
    }
  }, [done, secondaryLabel, primaryLabel, onSuccess]);

  const handlePrimarySelect: MenuProps['onSelect'] = ({ key }) => {
    setPrimaryLabel(key);
    setDone(false);
  };

  const handleSecondarySelect: MenuProps['onSelect'] = ({ key }) => {
    setSecondaryLabel(key);
    setDone(false);
  };

  const handleDone = () => {
    setDone(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <div>
        <Card style={{ width: 400 }}>
          <Title level={4} style={{ margin: 0 }}>Document Management</Title>
          <Text type="secondary" style={{ display: 'block', marginTop: 4, marginBottom: 12 }}>
            Organize and tag documents
          </Text>
          <Space>
            <Tag color="blue">Primary: {labelOptions.find(o => o.key === primaryLabel)?.label}</Tag>
            <Tag color="green">Secondary: {labelOptions.find(o => o.key === secondaryLabel)?.label}</Tag>
          </Space>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => setModalOpen(true)}>Label settings</Button>
          </div>
        </Card>

        <Modal
          title="Label settings"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" onClick={handleDone}>Done</Button>
            </div>
          }
          width={480}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary label</Text>
              <Menu
                data-cb-listbox-root
                data-cb-instance="primary"
                data-cb-selected-value={primaryLabel}
                mode="inline"
                selectedKeys={[primaryLabel]}
                onSelect={handlePrimarySelect}
                items={labelOptions.map(opt => ({
                  key: opt.key,
                  label: opt.label,
                  'data-cb-option-value': opt.key,
                }))}
                style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>Secondary label</Text>
              <Menu
                data-cb-listbox-root
                data-cb-instance="secondary"
                data-cb-selected-value={secondaryLabel}
                mode="inline"
                selectedKeys={[secondaryLabel]}
                onSelect={handleSecondarySelect}
                items={labelOptions.map(opt => ({
                  key: opt.key,
                  label: opt.label,
                  'data-cb-option-value': opt.key,
                }))}
                style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}
              />
            </div>
          </Space>
        </Modal>
      </div>
    </div>
  );
}
