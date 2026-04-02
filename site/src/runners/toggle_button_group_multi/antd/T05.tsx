'use client';

/**
 * toggle_button_group_multi-antd-T05: Edit channels in modal and apply
 *
 * Layout: modal_flow centered in the viewport.
 *
 * The page shows a settings card titled "Notifications" with a primary button labeled 
 * "Edit notification channels".
 *
 * Interaction flow:
 * - Clicking "Edit notification channels" opens an Ant Design Modal titled 
 *   "Edit notification channels".
 * - Inside the modal, there is a labeled section "Channels" containing a multi-select 
 *   toggle group (checkbox group styled as buttons).
 *
 * Channels options (left to right):
 * - Email
 * - SMS
 * - In-app
 * - Slack
 *
 * Initial state in the modal:
 * - Email and In-app are selected.
 * - SMS and Slack are not selected.
 *
 * Additional (non-blocking) modal content for realism (clutter=low):
 * - A short description paragraph under the title.
 * - A separate "Quiet hours" switch (not part of success).
 *
 * Footer controls:
 * - "Cancel" (left) and "Apply" (primary, right). Selection changes are considered 
 *   committed only after clicking Apply.
 *
 * Success: Selected options equal exactly: Email, Slack (require_confirm: true, confirm_control: Apply)
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Checkbox, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Paragraph } = Typography;

const CHANNELS = ['Email', 'SMS', 'In-app', 'Slack'];
const TARGET_SET = new Set(['Email', 'Slack']);

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(['Email', 'In-app']);
  const [quietHours, setQuietHours] = useState(false);

  const handleApply = () => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      setModalOpen(false);
      onSuccess();
    } else {
      setModalOpen(false);
    }
  };

  return (
    <>
      <Card title="Notifications" style={{ width: 400 }}>
        <Paragraph>Configure how you receive notifications.</Paragraph>
        <Button type="primary" onClick={() => setModalOpen(true)} data-testid="edit-channels-button">
          Edit notification channels
        </Button>
      </Card>

      <Modal
        title="Edit notification channels"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply} data-testid="apply-button">
            Apply
          </Button>,
        ]}
        data-testid="channels-modal"
      >
        <Paragraph type="secondary">
          Choose which channels you want to receive notifications through.
        </Paragraph>
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>Channels</Text>
          <div style={{ marginTop: 8 }}>
            <Checkbox.Group
              value={selected}
              onChange={(values) => setSelected(values as string[])}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
              data-testid="channels-group"
            >
              {CHANNELS.map(channel => (
                <Checkbox
                  key={channel}
                  value={channel}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    background: selected.includes(channel) ? '#1677ff' : '#fff',
                    color: selected.includes(channel) ? '#fff' : '#333',
                  }}
                  data-testid={`channel-${channel.toLowerCase().replace('-', '')}`}
                >
                  {channel}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch checked={quietHours} onChange={setQuietHours} />
          <Text>Quiet hours</Text>
        </div>
      </Modal>
    </>
  );
}
