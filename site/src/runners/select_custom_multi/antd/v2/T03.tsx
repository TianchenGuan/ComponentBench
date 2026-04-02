'use client';

/**
 * select_custom_multi-antd-v2-T03: Release tags modal with one custom value
 *
 * Modal flow, compact spacing, medium clutter. "Edit release tags" opens a centered AntD Modal.
 * One Select field labeled "Release tags" in tags mode (allows creating new values).
 * Suggestions: urgent, backend, frontend, postmortem, postmortem-draft, customer-facing, release-blocker.
 * Initial: [urgent, internal-only]. Target: [urgent, backend, postmortem-required].
 * "postmortem-required" must be created as a new tag (not in suggestions).
 * Modal footer: Cancel / Apply tags.
 *
 * Success: Release tags = {urgent, backend, postmortem-required}, Apply tags clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Select, Typography, Space, Modal, Divider, Tag } from 'antd';
import { RocketOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const tagSuggestions = [
  'urgent', 'backend', 'frontend', 'postmortem', 'postmortem-draft',
  'customer-facing', 'release-blocker',
].map(v => ({ label: v, value: v }));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [releaseTags, setReleaseTags] = useState<string[]>(['urgent', 'internal-only']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed && setsEqual(releaseTags, ['urgent', 'backend', 'postmortem-required'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, releaseTags, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 16 }}>
      <Title level={4}><RocketOutlined /> Release Checklist</Title>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Deployment: <Tag color="blue">v3.14.2</Tag></Text>
          <Text type="secondary">Status: Pre-release review pending</Text>
          <Divider style={{ margin: '8px 0' }} />
          <Text type="secondary">Summary: 14 commits, 3 migrations, 1 breaking change</Text>
        </Space>
      </Card>

      <Button type="primary" onClick={() => setModalOpen(true)}>Edit release tags</Button>

      <Modal
        title="Edit Release Tags"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>Apply tags</Button>
          </Space>
        }
      >
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>Release tags</Text>
          <Select
            mode="tags"
            showSearch
            style={{ width: '100%' }}
            value={releaseTags}
            onChange={(v) => { setReleaseTags(v); setCommitted(false); }}
            options={tagSuggestions}
            placeholder="Add release tags"
          />
        </div>
      </Modal>
    </div>
  );
}
