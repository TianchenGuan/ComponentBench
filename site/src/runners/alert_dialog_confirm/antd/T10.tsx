'use client';

/**
 * alert_dialog_confirm-antd-T10: Reset notification settings among similar reset actions (high clutter)
 *
 * Settings panel layout with high clutter: a realistic "Preferences" page shows multiple sections (Appearance, Shortcuts, Notifications, Privacy) each with several toggles and dropdowns (all distractors).
 *
 * In a "Reset" subsection near the bottom, there are TWO similarly styled reset buttons (two instances):
 * - "Reset notifications"
 * - "Reset appearance"
 *
 * Both buttons open an Ant Design Modal.confirm with nearly identical structure and the same footer labels "Cancel" and "Confirm". The modal title differs based on which reset was triggered:
 * - "Reset notifications?"
 * - "Reset appearance?"
 *
 * The task is to reset notifications only (not appearance) by confirming the correct dialog.
 */

import React, { useRef } from 'react';
import { Card, Button, Modal, Switch, Select, Typography, Divider, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleResetNotifications = () => {
    Modal.confirm({
      title: 'Reset notifications?',
      content: 'This will restore all notification settings to their defaults.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          window.__cbDialogState = {
            dialog_open: false,
            last_action: 'confirm',
            dialog_instance: 'reset_notifications',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'reset_notifications',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'reset_notifications',
    };
  };

  const handleResetAppearance = () => {
    Modal.confirm({
      title: 'Reset appearance?',
      content: 'This will restore all appearance settings to their defaults.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true } as any,
      onOk: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'confirm',
          dialog_instance: 'reset_appearance',
        };
        message.info('Action recorded');
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'reset_appearance',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'reset_appearance',
    };
  };

  return (
    <Card title="Preferences" style={{ width: 500 }}>
      {/* Appearance Section */}
      <Title level={5}>Appearance</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Theme</Text>
          <Select defaultValue="light" style={{ width: 120 }}>
            <Select.Option value="light">Light</Select.Option>
            <Select.Option value="dark">Dark</Select.Option>
          </Select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Compact mode</Text>
          <Switch />
        </div>
      </div>

      <Divider />

      {/* Shortcuts Section */}
      <Title level={5}>Shortcuts</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Enable shortcuts</Text>
          <Switch defaultChecked />
        </div>
      </div>

      <Divider />

      {/* Notifications Section */}
      <Title level={5}>Notifications</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Email notifications</Text>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Push notifications</Text>
          <Switch defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Sound</Text>
          <Switch />
        </div>
      </div>

      <Divider />

      {/* Privacy Section */}
      <Title level={5}>Privacy</Title>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Analytics</Text>
          <Switch />
        </div>
      </div>

      <Divider />

      {/* Reset Section */}
      <Title level={5} style={{ color: '#ff4d4f' }}>Reset</Title>
      <div style={{ display: 'flex', gap: 12 }}>
        <Button danger onClick={handleResetNotifications} data-testid="cb-open-reset-notifications">
          Reset notifications
        </Button>
        <Button danger onClick={handleResetAppearance} data-testid="cb-open-reset-appearance">
          Reset appearance
        </Button>
      </div>
    </Card>
  );
}
