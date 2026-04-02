'use client';

/**
 * tabs-antd-T05: Modal settings: open Integrations tab
 *
 * Layout: modal_flow. The main page shows a centered button labeled "Project Settings".
 * Clicking the button opens an Ant Design Modal titled "Project Settings".
 * Inside the modal body is an Ant Design Tabs component (type=line) with tabs: "General", "Integrations", "Backups".
 * Initial state: the modal opens with "General" active.
 * Modal footer contains "Cancel" and "Save" buttons; neither is required for success.
 * Clutter: low—there is explanatory text inside each tab panel, but no required form interactions.
 * Success: Active tab is "Integrations" (value/key: integrations).
 */

import React, { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState('general');

  const handleChange = (key: string) => {
    setActiveKey(key);
    if (key === 'integrations') {
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Project Settings
      </Button>
      <Modal
        title="Project Settings"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>Cancel</Button>,
          <Button key="save" type="primary">Save</Button>,
        ]}
        width={550}
      >
        <Tabs
          activeKey={activeKey}
          onChange={handleChange}
          items={[
            { key: 'general', label: 'General', children: <p>General settings for your project. Configure basic options here.</p> },
            { key: 'integrations', label: 'Integrations', children: <p>Connect third-party services and APIs to your project.</p> },
            { key: 'backups', label: 'Backups', children: <p>Configure automated backups and data retention policies.</p> },
          ]}
        />
      </Modal>
    </div>
  );
}
