'use client';

/**
 * collapsible_disclosure-antd-T06: Modal: open dialog then expand Push notifications
 * 
 * A notifications settings page includes a modal flow.
 * 
 * - Layout: modal_flow (an overlay dialog must be opened).
 * - Trigger: a primary button labeled "Edit notification categories" opens an AntD Modal dialog.
 * - Inside the modal: one AntD Collapse in accordion mode with 3 panels:
 *   - "Email notifications" (expanded by default),
 *   - "Push notifications" (collapsed),
 *   - "SMS notifications" (collapsed).
 * - The modal footer has "Cancel" and "OK" buttons, but they are NOT required for success; success is based only on the Collapse state inside the modal.
 * 
 * Success: Modal is open AND expanded_panels equals ["Push notifications"]
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal, Collapse } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<string | string[]>('email');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when modal is open and Push notifications is expanded
    const key = Array.isArray(activeKey) ? activeKey[0] : activeKey;
    if (modalOpen && key === 'push' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [modalOpen, activeKey, onSuccess]);

  return (
    <Card title="Notifications" style={{ width: 500 }}>
      <p style={{ marginBottom: 16 }}>
        Manage your notification preferences by clicking the button below.
      </p>
      <Button 
        type="primary" 
        onClick={() => setModalOpen(true)}
        data-testid="open-modal-button"
      >
        Edit notification categories
      </Button>

      <Modal
        title="Edit notification categories"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        data-testid="notification-modal"
      >
        <Collapse
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
          data-testid="modal-collapse"
          items={[
            {
              key: 'email',
              label: 'Email notifications',
              children: (
                <p>
                  Configure which email notifications you receive and how often.
                </p>
              ),
            },
            {
              key: 'push',
              label: 'Push notifications',
              children: (
                <p>
                  Manage push notifications for mobile and desktop devices.
                </p>
              ),
            },
            {
              key: 'sms',
              label: 'SMS notifications',
              children: (
                <p>
                  Set up text message alerts for critical notifications.
                </p>
              ),
            },
          ]}
        />
      </Modal>
    </Card>
  );
}
