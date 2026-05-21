'use client';

/**
 * checkbox-antd-T08: Enable beta renderer inside modal
 *
 * Layout: modal flow.
 * The main page shows an isolated card titled "Rendering" with a primary button labeled "Advanced options…".
 * Clicking the button opens an Ant Design Modal dialog titled "Advanced options" (overlay centered on the screen).
 * Inside the modal body there is one AntD Checkbox labeled "Enable beta renderer" (initially unchecked) with a short description.
 * The modal footer contains "Cancel" and "OK" buttons. The checkbox change is only committed when "OK" is clicked.
 * Closing via "Cancel" or the modal close icon discards changes and leaves the checkbox unchecked.
 * Distractors: none besides the Cancel button.
 */

import React, { useState } from 'react';
import { Card, Button, Modal, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempChecked, setTempChecked] = useState(false);
  const [committed, setCommitted] = useState(false);

  const handleOpenModal = () => {
    setTempChecked(false); // Reset temp state
    setModalOpen(true);
  };

  const handleOk = () => {
    if (tempChecked && !committed) {
      setCommitted(true);
      setModalOpen(false);
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempChecked(false);
    setModalOpen(false);
  };

  return (
    <>
      <Card title="Rendering" style={{ width: 400 }}>
        <p style={{ marginBottom: 16, color: '#666' }}>
          Configure advanced rendering options for better performance.
        </p>
        <Button 
          type="primary" 
          onClick={handleOpenModal}
          data-testid="btn-advanced-options"
        >
          Advanced options…
        </Button>
      </Card>

      <Modal
        title="Advanced options"
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        data-testid="modal-advanced-options"
      >
        <div style={{ padding: '16px 0' }}>
          <Checkbox
            checked={tempChecked}
            onChange={(e) => setTempChecked(e.target.checked)}
            data-testid="cb-beta-renderer"
          >
            Enable beta renderer
          </Checkbox>
          <div style={{ marginTop: 8, fontSize: 12, color: '#999', paddingLeft: 24 }}>
            Use the experimental rendering engine for improved graphics quality.
          </div>
        </div>
      </Modal>
    </>
  );
}
