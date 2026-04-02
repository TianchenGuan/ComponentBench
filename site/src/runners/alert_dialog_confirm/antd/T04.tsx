'use client';

/**
 * alert_dialog_confirm-antd-T04: Confirm removing a tag via Popconfirm in a form
 *
 * Form section layout centered in the viewport with a short "Edit task" form:
 * - Text input labeled "Title" (pre-filled, not required)
 * - Select labeled "Owner" (pre-selected, not required)
 * - Tag list labeled "Tags" containing two tags: "urgent" and "backend"
 *
 * Each tag has a tiny remove (×) affordance. Clicking the remove (×) on a tag opens an Ant Design Popconfirm bubble anchored to that tag.
 *
 * For the "urgent" tag, the Popconfirm shows:
 * - Title: "Remove tag?"
 * - Description: "This will unassign the tag."
 * - Buttons: "Cancel" and "OK" (default okText) inside the bubble.
 *
 * There is only one Popconfirm on screen at a time; it closes immediately after OK/Cancel.
 */

import React, { useRef } from 'react';
import { Card, Input, Select, Tag, Popconfirm, message, Form } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleConfirmUrgent = () => {
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'remove_tag_urgent',
      };
      message.info('Tag removed');
      onSuccess();
    }
  };

  const handleCancelUrgent = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_tag_urgent',
    };
  };

  const handleConfirmBackend = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'remove_tag_backend',
    };
    message.info('Tag removed');
  };

  const handleCancelBackend = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'remove_tag_backend',
    };
  };

  return (
    <Card title="Edit task" style={{ width: 400 }}>
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input defaultValue="Implement feature X" />
        </Form.Item>
        <Form.Item label="Owner">
          <Select defaultValue="alice" style={{ width: '100%' }}>
            <Select.Option value="alice">Alice</Select.Option>
            <Select.Option value="bob">Bob</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tags">
          <div style={{ display: 'flex', gap: 8 }}>
            <Popconfirm
              title="Remove tag?"
              description="This will unassign the tag."
              onConfirm={handleConfirmUrgent}
              onCancel={handleCancelUrgent}
              okText="OK"
              cancelText="Cancel"
              okButtonProps={{ 'data-testid': 'cb-confirm' } as any}
              cancelButtonProps={{ 'data-testid': 'cb-cancel' } as any}
            >
              <Tag
                closable
                onClose={(e) => e.preventDefault()}
                data-testid="tag-urgent"
                data-cb-instance="urgent"
              >
                urgent
              </Tag>
            </Popconfirm>
            <Popconfirm
              title="Remove tag?"
              description="This will unassign the tag."
              onConfirm={handleConfirmBackend}
              onCancel={handleCancelBackend}
              okText="OK"
              cancelText="Cancel"
            >
              <Tag
                closable
                onClose={(e) => e.preventDefault()}
                data-testid="tag-backend"
                data-cb-instance="backend"
              >
                backend
              </Tag>
            </Popconfirm>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
