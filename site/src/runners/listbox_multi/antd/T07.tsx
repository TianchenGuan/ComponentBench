'use client';

/**
 * listbox_multi-antd-T07: Modal permissions with Save
 *
 * Layout: modal_flow. The main page shows a card titled "Team access" with a button labeled "Edit permissions".
 * When clicked, a centered Ant Design Modal opens titled "Edit team permissions".
 * Inside the modal is the target component: a Checkbox.Group listbox labeled "Team permissions".
 * Options (10): View dashboards, Edit dashboards, Export data, Manage users, Manage billing, View audit log, API access, Create projects, Delete projects, Manage webhooks.
 * Initial state inside the modal: "View dashboards" and "View audit log" are selected.
 * At the bottom right of the modal are two buttons: "Cancel" and a primary "Save changes".
 *
 * Success: The target listbox has exactly: View dashboards, Export data, Manage users. (require_confirm=true: only after Save)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Modal, Checkbox, Space, Typography, Button } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  'View dashboards',
  'Edit dashboards',
  'Export data',
  'Manage users',
  'Manage billing',
  'View audit log',
  'API access',
  'Create projects',
  'Delete projects',
  'Manage webhooks',
];

const targetSet = ['View dashboards', 'Export data', 'Manage users'];
const initialSelected = ['View dashboards', 'View audit log'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelected, setModalSelected] = useState<string[]>(initialSelected);
  const [savedPermissions, setSavedPermissions] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  // Only fire success after Save is pressed
  useEffect(() => {
    if (!successFired.current && setsEqual(savedPermissions, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [savedPermissions, onSuccess]);

  const handleOpenModal = () => {
    setModalSelected(savedPermissions);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setSavedPermissions([...modalSelected]);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card title="Team access" style={{ width: 400 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Team access: Edit permissions.
        </Text>
        <Button type="primary" onClick={handleOpenModal}>
          Edit permissions
        </Button>
        <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
          Permissions: {savedPermissions.join(', ') || 'None'}
        </Text>
      </Card>

      <Modal
        title="Edit team permissions"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save changes
          </Button>,
        ]}
        width={500}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Team permissions
        </Text>
        <Checkbox.Group
          data-testid="listbox-team-permissions"
          value={modalSelected}
          onChange={(values) => setModalSelected(values as string[])}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {options.map((opt) => (
              <Checkbox key={opt} value={opt} data-value={opt}>
                {opt}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Modal>
    </>
  );
}
