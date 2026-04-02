'use client';

/**
 * autocomplete_freeform-antd-T09: Edit tags in a modal and confirm
 *
 * setup_description:
 * The main page shows a small card titled "Issue" with a single button labeled "Edit labels". Clicking it opens an Ant Design Modal dialog.
 *
 * Inside the modal, there is one Ant Design Select configured with mode="tags" and labeled "Labels". The input shows existing tags as pills. The modal footer contains two buttons: "Cancel" and a primary "OK".
 *
 * Initial state inside the modal: one tag pill "backend" is already selected. Suggested tags in the dropdown include "urgent" and "needs-review", but the component accepts free custom tags as well. Tags are committed by pressing Enter after typing, or by selecting from the dropdown.
 *
 * Distractors: a short paragraph above the input explains labels are used for triage; it is non-interactive. Feedback: tags appear as pills immediately, but the changes are considered committed only after pressing the modal "OK" button.
 *
 * Success: The "Labels" tags Select has selected tags exactly {backend, urgent, needs-review} (order does not matter; trim whitespace). The modal "OK" button has been pressed to confirm/commit the selection.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Select, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const suggestions = [
  { value: 'backend', label: 'backend' },
  { value: 'urgent', label: 'urgent' },
  { value: 'needs-review', label: 'needs-review' },
  { value: 'frontend', label: 'frontend' },
  { value: 'bug', label: 'bug' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['backend']);
  const successFired = useRef(false);

  const handleOk = () => {
    // Normalize and check for exact set match
    const normalizedTags = tags.map(t => t.trim().toLowerCase());
    const targetTags = ['backend', 'urgent', 'needs-review'];
    
    const isMatch = normalizedTags.length === targetTags.length &&
      normalizedTags.every(t => targetTags.includes(t)) &&
      targetTags.every(t => normalizedTags.includes(t));
    
    if (!successFired.current && isMatch) {
      successFired.current = true;
      setIsModalOpen(false);
      onSuccess();
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card title="Issue" style={{ width: 300 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Edit labels
        </Button>
      </Card>

      <Modal
        title="Edit labels"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        okButtonProps={{ 'data-testid': 'labels-ok' } as any}
        cancelButtonProps={{ 'data-testid': 'labels-cancel' } as any}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph type="secondary">
            Labels are used for triage and organization of issues.
          </Paragraph>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Labels</Text>
            <Select
              data-testid="labels-tags"
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Add labels"
              value={tags}
              onChange={(newTags) => setTags(newTags)}
              options={suggestions}
              tokenSeparators={[',']}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
