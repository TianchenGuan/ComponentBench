'use client';

/**
 * dialog_modal-antd-T05: Open the correct dialog when two are available
 *
 * Layout: form_section centered in the viewport. The page shows a realistic "Account settings" form.
 *
 * In the form header there are two adjacent buttons that can open dialogs:
 * 1) "Profile details" with a small blue badge labeled "Primary"
 * 2) "Security settings" with a small orange badge labeled "Secondary"
 *
 * Each button opens its own Ant Design Modal instance.
 * Initial state: both modals are closed. Only one modal can be open at a time.
 * Success: The modal instance titled 'Security settings' is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Typography, Badge, Space, Input, Form } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text, Title } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenProfile = () => {
    setProfileOpen(true);
    setSecurityOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Profile details',
    };
  };

  const handleOpenSecurity = () => {
    setSecurityOpen(true);
    setProfileOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Security settings',
    };
    
    // Success when Security settings modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Profile details',
    };
  };

  const handleCloseSecurity = () => {
    setSecurityOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: 'Security settings',
    };
  };

  return (
    <>
      <Card style={{ width: 500 }}>
        <Title level={4}>Account settings</Title>
        
        <Space style={{ marginBottom: 24 }}>
          <Badge color="blue" text="Primary">
            <Button onClick={handleOpenProfile} data-testid="cb-open-profile">
              Profile details
            </Button>
          </Badge>
          <Badge color="orange" text="Secondary">
            <Button onClick={handleOpenSecurity} data-testid="cb-open-security">
              Security settings
            </Button>
          </Badge>
        </Space>

        <Form layout="vertical">
          <Form.Item label="Name">
            <Input value="John Doe" disabled />
          </Form.Item>
          <Form.Item label="Email">
            <Input value="john@example.com" disabled />
          </Form.Item>
          <Form.Item label="Time zone">
            <Input value="UTC-5 (Eastern)" disabled />
          </Form.Item>
        </Form>
        
        <Text type="secondary">
          Click the buttons above to modify your account settings.
        </Text>
      </Card>

      <Modal
        title="Profile details"
        open={profileOpen}
        onOk={handleCloseProfile}
        onCancel={handleCloseProfile}
        data-testid="modal-profile-details"
      >
        <Paragraph>
          Update your profile information including name, bio, and profile picture.
        </Paragraph>
      </Modal>

      <Modal
        title="Security settings"
        open={securityOpen}
        onOk={handleCloseSecurity}
        onCancel={handleCloseSecurity}
        data-testid="modal-security-settings"
      >
        <Paragraph>
          Manage your security preferences, including password and two-factor authentication.
        </Paragraph>
      </Modal>
    </>
  );
}
