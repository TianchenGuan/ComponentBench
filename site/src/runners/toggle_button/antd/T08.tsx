'use client';

/**
 * toggle_button-antd-T08: Toggle inside modal with Save (dark theme)
 *
 * Layout: modal_flow. The page shows a centered card with a single primary button labeled "Open Preferences".
 * Theme is dark; spacing is comfortable; component scale is default.
 *
 * Interaction flow:
 * 1) Clicking "Open Preferences" opens an AntD Modal dialog titled "Preferences".
 * 2) Inside the modal body there is one toggle-style AntD Button labeled "Auto-archive".
 *    - Off = default/outline button; On = filled/primary button.
 *    - aria-pressed reflects the state.
 * 3) The modal footer has two buttons: "Cancel" and "Save".
 *
 * Commit behavior:
 * - Changing the toggle updates the UI immediately inside the modal, but it is not considered committed until "Save" is clicked.
 * - If "Cancel" is clicked or the modal is closed, changes are discarded (toggle returns to Off when reopened).
 *
 * Initial state when modal first opens: Auto-archive is Off.
 */

import React, { useState } from 'react';
import { Card, Button, Modal } from 'antd';
import { CheckOutlined, FolderOutlined, SettingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempPressed, setTempPressed] = useState(false);
  const [committedPressed, setCommittedPressed] = useState(false);

  const openModal = () => {
    setTempPressed(committedPressed); // Reset to committed state
    setModalOpen(true);
  };

  const handleCancel = () => {
    setTempPressed(committedPressed); // Discard changes
    setModalOpen(false);
  };

  const handleSave = () => {
    setCommittedPressed(tempPressed);
    setModalOpen(false);
    if (tempPressed) {
      onSuccess();
    }
  };

  const handleToggle = () => {
    setTempPressed(!tempPressed);
  };

  return (
    <>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={openModal}
          data-testid="open-preferences-button"
        >
          Open Preferences
        </Button>
        <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
          Auto-archive: {committedPressed ? 'On' : 'Off'} (committed)
        </div>
      </Card>

      <Modal
        title="Preferences"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave} data-testid="save-button">
            Save
          </Button>,
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Auto-archive</div>
              <div style={{ fontSize: 12, color: '#999' }}>
                Automatically archive old messages
              </div>
            </div>
            <Button
              type={tempPressed ? 'primary' : 'default'}
              icon={tempPressed ? <CheckOutlined /> : <FolderOutlined />}
              onClick={handleToggle}
              aria-pressed={tempPressed}
              data-testid="auto-archive-toggle"
            >
              {tempPressed ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
