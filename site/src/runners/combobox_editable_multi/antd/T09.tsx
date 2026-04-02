'use client';

/**
 * combobox_editable_multi-antd-T09: Edit notification tags in a modal and save
 *
 * Layout is a modal flow:
 * - On the base page (centered card "Notifications"), there is a button labeled "Edit notification tags".
 * - Clicking it opens an Ant Design Modal dialog.
 * Inside the modal:
 * - One Ant Design Select in tags mode labeled "Notification tags" (target).
 * - Initial selected tag: "Push"
 * - Options include: Email, SMS, Push, Slack.
 * - Modal footer has two buttons: "Cancel" and primary "Save changes".
 * Feedback:
 * - After clicking "Save changes", the modal closes and a small toast "Saved" appears (toast is not required for success, only helpful feedback).
 * Success requires both the correct tag set and that "Save changes" has been clicked.
 *
 * Success: Selected values equal {Email, SMS} AND "Save changes" clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Select, Typography, Button, Modal, message } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Push', label: 'Push' },
  { value: 'Slack', label: 'Slack' },
];

const TARGET_SET = ['Email', 'SMS'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState<string[]>(['Push']);
  const hasSucceeded = useRef(false);

  const handleSave = () => {
    if (setsEqual(value, TARGET_SET) && !hasSucceeded.current) {
      hasSucceeded.current = true;
      setIsModalOpen(false);
      message.success('Saved');
      onSuccess();
    } else {
      setIsModalOpen(false);
      message.info('Saved');
    }
  };

  return (
    <>
      <Card title="Notifications" style={{ width: 400 }}>
        <Text style={{ display: 'block', marginBottom: 16 }}>
          Configure how you receive notifications.
        </Text>
        <Button 
          data-testid="open-modal-button"
          type="primary" 
          onClick={() => setIsModalOpen(true)}
        >
          Edit notification tags
        </Button>
      </Card>

      <Modal
        title="Edit notification tags"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            data-testid="save-button"
            onClick={handleSave}
          >
            Save changes
          </Button>,
        ]}
      >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>Notification tags</Text>
        <Select
          data-testid="notification-tags"
          mode="tags"
          style={{ width: '100%' }}
          placeholder="Select notification methods"
          value={value}
          onChange={setValue}
          options={options}
        />
      </Modal>
    </>
  );
}
