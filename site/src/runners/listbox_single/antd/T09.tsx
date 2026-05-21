'use client';

/**
 * listbox_single-antd-T09: Change role: open dialog, choose Editor, apply
 *
 * Scene: light theme, comfortable spacing, modal_flow layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered card titled "Team member" shows a summary row and a primary button "Change role". Clicking it opens
 * an AntD Modal dialog containing a standalone selectable Menu listbox labeled "Role" with items "Viewer", "Editor",
 * "Admin". Initial selection in the modal is "Viewer". Selection changes are only committed to the page after
 * clicking the modal primary button "Apply"; "Cancel" closes the modal without saving. On successful apply,
 * the modal closes and a small inline label under the button updates to the saved role.
 *
 * Success: Selected option value equals: editor (after clicking Apply)
 * require_confirm: true, confirm_control: Apply
 */

import React, { useState } from 'react';
import { Card, Menu, Button, Modal, Typography, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const roleOptions = [
  { key: 'viewer', label: 'Viewer' },
  { key: 'editor', label: 'Editor' },
  { key: 'admin', label: 'Admin' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [stagedRole, setStagedRole] = useState<string>('viewer');
  const [committedRole, setCommittedRole] = useState<string>('viewer');

  const handleOpenModal = () => {
    setStagedRole(committedRole);
    setModalOpen(true);
  };

  const handleSelect: MenuProps['onSelect'] = ({ key }) => {
    setStagedRole(key);
  };

  const handleApply = () => {
    setCommittedRole(stagedRole);
    setModalOpen(false);
    if (stagedRole === 'editor') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const roleLabel = roleOptions.find(r => r.key === committedRole)?.label || '';

  return (
    <>
      <Card title="Team member" style={{ width: 360 }}>
        <div style={{ marginBottom: 16 }}>
          <Text>John Smith</Text>
          <br />
          <Text type="secondary">john@example.com</Text>
        </div>
        
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="primary" onClick={handleOpenModal}>
            Change role
          </Button>
          <Text type="secondary">Current role: {roleLabel}</Text>
        </Space>
      </Card>

      <Modal
        title="Change role"
        open={modalOpen}
        onOk={handleApply}
        onCancel={handleCancel}
        okText="Apply"
        cancelText="Cancel"
      >
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Role</Text>
        <Menu
          data-cb-listbox-root
          data-cb-selected-value={stagedRole}
          data-cb-committed-value={committedRole}
          mode="inline"
          selectedKeys={[stagedRole]}
          onSelect={handleSelect}
          items={roleOptions.map(opt => ({
            key: opt.key,
            label: opt.label,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: '1px solid #e8e8e8', borderRadius: 4 }}
        />
      </Modal>
    </>
  );
}
