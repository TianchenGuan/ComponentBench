'use client';

/**
 * tags_input-antd-T08: Edit tags inside a modal and click Apply
 *
 * The page uses a **dark theme** and shows a centered card titled "Article".
 *
 * Main card content (clutter=low):
 * - A read-only title line ("Weekly update").
 * - A button labeled "Edit keywords" (this opens the target modal).
 *
 * Modal flow:
 * - Clicking "Edit keywords" opens an Ant Design Modal centered on the screen.
 * - Inside the modal is a single form field labeled "Tags", implemented with Ant Design Select in **tags** mode.
 * - The modal footer contains two buttons: "Cancel" and a primary "Apply".
 *
 * Initial state:
 * - The Tags field inside the modal starts with one chip: "draft".
 *
 * Feedback/commit:
 * - Changes to chips are visible immediately inside the modal, but the page only considers the edit "final" after clicking **Apply**.
 * - Closing via Cancel (or the modal close icon) should not count as success.
 *
 * Success: The target Tags Input component contains exactly these tags (order does not matter): release, notes.
 * The change is committed by clicking **Apply**.
 */

import React, { useRef, useState } from 'react';
import { Card, Button, Modal, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(['draft']);
  const [pendingTags, setPendingTags] = useState<string[]>(['draft']);
  const hasSucceeded = useRef(false);

  const handleOpenModal = () => {
    setPendingTags([...tags]);
    setIsModalOpen(true);
  };

  const handleApply = () => {
    setTags(pendingTags);
    setIsModalOpen(false);
    
    const normalizedTags = pendingTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['release', 'notes'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  const handleCancel = () => {
    setPendingTags([...tags]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card title="Article" style={{ width: 400 }}>
        <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Weekly update</Title>
        <Button onClick={handleOpenModal} data-testid="edit-keywords-button">
          Edit keywords
        </Button>
      </Card>

      <Modal
        title="Edit keywords"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply} data-testid="apply-button">
            Apply
          </Button>,
        ]}
        data-testid="keywords-modal"
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Tags</Text>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags..."
            value={pendingTags}
            onChange={setPendingTags}
            data-testid="modal-tags-input"
            open={false}
          />
        </div>
      </Modal>
    </>
  );
}
