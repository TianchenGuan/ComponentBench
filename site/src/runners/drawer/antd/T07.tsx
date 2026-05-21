'use client';

/**
 * drawer-antd-T07: Discard changes when closing Profile editor (dark theme)
 *
 * Theme: DARK mode (dark background and light text). Layout remains an isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - An AntD Drawer titled "Profile editor" is OPEN on page load.
 * - The drawer contains a small form with one text input that has already been modified (dirty state). A visible tag near the title reads "Unsaved changes".
 *
 * Close behavior:
 * - Attempting to close the drawer (via the header X or the footer "Cancel" button) triggers an Ant Design confirmation dialog (modal) with:
 *   - Title: "Discard changes?"
 *   - Buttons: "Keep editing" (cancel) and "Discard" (confirm)
 *
 * Task requirement:
 * - The drawer must end up CLOSED, and the confirm choice must be "Discard".
 *
 * Distractors:
 * - The form fields are present but do not need to be edited for success.
 *
 * Feedback:
 * - After clicking "Discard", the dialog disappears and the drawer closes.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Input, Space, Modal, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(true); // Start open
  const [confirmOpen, setConfirmOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!drawerOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, onSuccess]);

  const handleCloseAttempt = () => {
    setConfirmOpen(true);
  };

  const handleDiscard = () => {
    setConfirmOpen(false);
    setDrawerOpen(false);
  };

  const handleKeepEditing = () => {
    setConfirmOpen(false);
  };

  return (
    <Card title="Account Settings" style={{ width: 350 }}>
      <Text>The Profile editor drawer is open with unsaved changes.</Text>

      <Drawer
        title={
          <Space>
            <span>Profile editor</span>
            <Tag color="warning">Unsaved changes</Tag>
          </Space>
        }
        placement="right"
        onClose={handleCloseAttempt}
        open={drawerOpen}
        data-testid="drawer-profile-editor"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong>Display Name</Text>
            <Input defaultValue="John Doe (modified)" />
          </div>
          <div>
            <Text strong>Bio</Text>
            <Input.TextArea defaultValue="Software developer..." rows={3} />
          </div>
          <Button onClick={handleCloseAttempt}>Cancel</Button>
        </Space>
      </Drawer>

      <Modal
        title="Discard changes?"
        open={confirmOpen}
        onCancel={handleKeepEditing}
        footer={
          <Space>
            <Button onClick={handleKeepEditing} data-testid="discard-cancel">
              Keep editing
            </Button>
            <Button
              type="primary"
              danger
              onClick={handleDiscard}
              data-testid="discard-confirm"
            >
              Discard
            </Button>
          </Space>
        }
      >
        <Text>You have unsaved changes. Are you sure you want to discard them?</Text>
      </Modal>
    </Card>
  );
}
