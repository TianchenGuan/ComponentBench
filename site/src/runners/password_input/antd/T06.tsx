'use client';

/**
 * password_input-antd-T06: Change password in a modal dialog
 * 
 * A security page shows a single button labeled "Change password". Clicking it opens an Ant Design
 * Modal titled "Change password".
 * Inside the modal is one Input.Password labeled "New password" (empty by default) and the standard
 * modal footer buttons "Cancel" and "OK". The password input includes the eye icon toggle.
 * A small helper text below the input says "Password will be saved when you click OK".
 * 
 * Success: In the modal, the Input.Password labeled "New password" equals exactly "Orbit#2026"
 * AND the modal "OK" button has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const successTriggeredRef = useRef(false);

  useEffect(() => {
    if (confirmed && password === 'Orbit#2026' && !successTriggeredRef.current) {
      successTriggeredRef.current = true;
      onSuccess();
    }
  }, [confirmed, password, onSuccess]);

  const handleOk = () => {
    setConfirmed(true);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ marginBottom: 16 }}>Security</h3>
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)}
        data-testid="open-change-password"
      >
        Change password
      </Button>

      <Modal
        title="Change password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        data-testid="change-password-modal"
      >
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="modal-new-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            New password
          </label>
          <Input.Password
            id="modal-new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="modal-new-password-input"
          />
          <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            Password will be saved when you click OK.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
