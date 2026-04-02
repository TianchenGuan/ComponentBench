'use client';

/**
 * checkbox_group-antd-T05: Select three categories in a modal and save
 *
 * Scene: light theme; comfortable spacing; a modal dialog flow centered in the viewport.
 * Light theme page with a centered card titled "Subscriptions". The card shows a short paragraph and a primary button labeled "Edit blog categories".
 * Clicking "Edit blog categories" opens an Ant Design modal dialog titled "Edit blog categories".
 * Inside the modal:
 * - There is one Checkbox.Group labeled "Categories".
 * - Options (all enabled): Technology, Science, Health, Travel, Finance, Sports.
 * - Initial state inside the modal: Technology is checked by default; the others are unchecked.
 * Modal footer: Primary button "Save", Secondary button "Cancel"
 * Success: The modal is submitted via Save with exactly Technology, Science, and Health checked.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Checkbox, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const options = ['Technology', 'Science', 'Health', 'Travel', 'Finance', 'Sports'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelection, setModalSelection] = useState<string[]>(['Technology']);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    const targetSet = new Set(['Technology', 'Science', 'Health']);
    const currentSet = new Set(modalSelection);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    // Reset to initial state on cancel
    setModalSelection(['Technology']);
  };

  return (
    <>
      <Card title="Subscriptions" style={{ width: 450 }}>
        <Paragraph>
          Manage your blog category subscriptions to receive relevant content updates.
        </Paragraph>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Edit blog categories
        </Button>
      </Card>

      <Modal
        title="Edit blog categories"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Categories</Text>
        <Checkbox.Group
          data-testid="cg-categories"
          value={modalSelection}
          onChange={(checkedValues) => setModalSelection(checkedValues as string[])}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(option => (
              <Checkbox key={option} value={option}>
                {option}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>
    </>
  );
}
