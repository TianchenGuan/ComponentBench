'use client';

/**
 * button-antd-T03: Unsaved changes dialog (confirm discard)
 * 
 * The page loads with an Ant Design Modal already open.
 * Modal title: "Unsaved changes". Footer has "Cancel" and "Discard changes" buttons.
 * Task: Click "Discard changes" (not Cancel).
 */

import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(true);
  const [choice, setChoice] = useState<string | null>(null);

  const handleDiscard = () => {
    setChoice('discard');
    setModalOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setChoice('cancel');
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      {choice && (
        <div style={{ textAlign: 'center', color: '#666' }}>
          Choice recorded: {choice}
        </div>
      )}
      
      <Modal
        title="Unsaved changes"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} data-testid="antd-btn-cancel">
            Cancel
          </Button>,
          <Button
            key="discard"
            type="primary"
            danger
            onClick={handleDiscard}
            data-testid="antd-btn-discard"
          >
            Discard changes
          </Button>,
        ]}
        data-modal-id="antd-modal-unsaved"
      >
        <p>
          You have unsaved changes. Leaving now will lose all your edits.
          Are you sure you want to discard your changes?
        </p>
      </Modal>
    </div>
  );
}
