'use client';

/**
 * accordion-antd-T10: Modal policy viewer: open Data retention section
 * 
 * Scene uses a modal_flow layout. The page shows a short policy summary card and a 
 * primary button labeled "View policy sections". Clicking that button opens an Ant Design 
 * Modal titled "Policy sections". Inside the modal is the target Ant Design Collapse 
 * accordion in accordion mode with 5 panels: "Overview", "Data collection", "Data retention", 
 * "Third-party sharing", "Contact". Initial state when the modal opens: "Overview" is 
 * expanded by default. The modal also contains secondary buttons ("Print", "Download PDF") 
 * above the accordion as distractors.
 * 
 * Success: expanded_item_ids equals exactly: [data_retention]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Button, Modal, Space } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | string[]>('overview');

  useEffect(() => {
    if (activeKey === 'data_retention' || (Array.isArray(activeKey) && activeKey.includes('data_retention') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setActiveKey('overview'); // Reset to initial state when modal opens
  };

  return (
    <>
      <Card title="Policy Summary" style={{ width: 400 }}>
        <p>
          Our privacy policy outlines how we collect, use, and protect your personal information.
          Click the button below to view detailed policy sections.
        </p>
        <Button type="primary" onClick={handleOpenModal}>
          View policy sections
        </Button>
      </Card>

      <Modal
        title="Policy sections"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
        data-testid="policy-modal"
      >
        {/* Distractor buttons */}
        <Space style={{ marginBottom: 16 }}>
          <Button disabled>Print</Button>
          <Button disabled>Download PDF</Button>
        </Space>

        {/* Accordion with policy sections */}
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          data-testid="accordion-root"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: <p>This privacy policy describes how we handle your personal data.</p>,
            },
            {
              key: 'data_collection',
              label: 'Data collection',
              children: <p>We collect data that you provide directly and through automated means.</p>,
            },
            {
              key: 'data_retention',
              label: 'Data retention',
              children: <p>We retain your data for as long as necessary to provide our services.</p>,
            },
            {
              key: 'third_party_sharing',
              label: 'Third-party sharing',
              children: <p>We may share data with trusted partners for specific purposes.</p>,
            },
            {
              key: 'contact',
              label: 'Contact',
              children: <p>For privacy inquiries, contact our data protection officer.</p>,
            },
          ]}
        />
      </Modal>
    </>
  );
}
