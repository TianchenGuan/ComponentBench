'use client';

/**
 * autocomplete_freeform-antd-v2-T04: Reference-card employee match in modal invite flow
 *
 * Review dashboard with a reference card showing "Olivia Chen" / "Platform".
 * Click "Add reviewer" to open a modal. AutoComplete has avatar-rendered options
 * with near-duplicate names. Select `Olivia Chen — Platform` and click "Invite reviewer".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AutoComplete, Avatar, Button, Card, Modal, Space, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const reviewerOptions = [
  { value: 'Olivia Chen — Platform', label: 'Olivia Chen — Platform' },
  { value: 'Olivia Cheng — Platform', label: 'Olivia Cheng — Platform' },
  { value: 'Oliver Chen — Platform', label: 'Oliver Chen — Platform' },
  { value: 'Olivia Chen — Design', label: 'Olivia Chen — Design' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewer, setReviewer] = useState('');
  const [fromSuggestion, setFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleInvite = useCallback(() => {
    setSaved(true);
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (reviewer === 'Olivia Chen — Platform' && fromSuggestion) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, reviewer, fromSuggestion, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card title="Review Dashboard" style={{ maxWidth: 520 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Text type="secondary">Pending reviews: 4 | Completed today: 12</Text>

          <Card
            size="small"
            data-testid="next-reviewer-card"
            style={{ background: '#fafafa' }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Next reviewer</Text>
            <Space>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              <div>
                <Text strong>Olivia Chen</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>Platform</Text>
              </div>
            </Space>
          </Card>

          <Button type="primary" onClick={() => setModalOpen(true)}>Add reviewer</Button>
        </Space>
      </Card>

      <Modal
        title="Add reviewer"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleInvite}>Invite reviewer</Button>
          </Space>
        }
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Reviewer</Text>
        <AutoComplete
          data-testid="reviewer-autocomplete"
          style={{ width: '100%' }}
          value={reviewer}
          onChange={(val) => { setReviewer(val); setFromSuggestion(false); }}
          onSelect={(val) => { setReviewer(val); setFromSuggestion(true); }}
          placeholder="Search reviewer"
          filterOption={(input, option) =>
            option!.value.toLowerCase().includes(input.toLowerCase())
          }
          options={reviewerOptions.map(opt => ({
            value: opt.value,
            label: (
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span>{opt.label}</span>
              </Space>
            ),
          }))}
        />
      </Modal>
    </div>
  );
}
