'use client';

/**
 * checkbox_tristate-antd-T08: Modal: set folder access to Partial and confirm
 *
 * Layout: modal_flow.
 * On the base page (centered card) there is a primary button labeled "Edit folder permissions".
 * Clicking it opens an Ant Design Modal titled "Folder permissions".
 * Inside the modal body is one Ant Design tri-state checkbox labeled "Folder access"
 * with helper text ("Allow access for some subfolders").
 * Initial state when the modal opens: Checked.
 * 
 * Modal footer contains two buttons: "Cancel" and "OK" (commits the change).
 * The page only commits/saves the permission state when OK is clicked.
 * If the modal is closed with Cancel or the close (×), the checkbox state reverts.
 * 
 * Success: checkbox is Indeterminate AND OK is clicked.
 */

import React, { useState } from 'react';
import { Card, Button, Modal, Checkbox } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [savedState, setSavedState] = useState<TristateValue>('checked');
  const [tempState, setTempState] = useState<TristateValue>('checked');

  const handleOpenModal = () => {
    setTempState(savedState);
    setModalOpen(true);
  };

  const handleClick = () => {
    setTempState(cycleTristateValue(tempState));
  };

  const handleOk = () => {
    setSavedState(tempState);
    setModalOpen(false);
    if (tempState === 'indeterminate') {
      onSuccess();
    }
  };

  const handleCancel = () => {
    setTempState(savedState);
    setModalOpen(false);
  };

  return (
    <>
      <Card style={{ width: 400 }}>
        <p style={{ marginBottom: 16, color: '#666' }}>
          Manage folder access permissions for your team.
        </p>
        <Button
          type="primary"
          onClick={handleOpenModal}
          data-testid="edit-folder-permissions-btn"
        >
          Edit folder permissions
        </Button>
      </Card>

      <Modal
        title="Folder permissions"
        open={modalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
      >
        <div style={{ padding: '16px 0' }}>
          <div onClick={handleClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={tempState === 'checked'}
              indeterminate={tempState === 'indeterminate'}
              data-testid="folder-access-checkbox"
            >
              Folder access
            </Checkbox>
          </div>
          <div style={{ marginTop: 8, marginLeft: 24, fontSize: 12, color: '#999' }}>
            Allow access for some subfolders
          </div>
        </div>
      </Modal>
    </>
  );
}
