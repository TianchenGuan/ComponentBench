'use client';

/**
 * alert_dialog_confirm-antd-T07: Match a dialog to a visual preview and confirm
 *
 * Isolated-card layout centered in the viewport. Two side-by-side action cards are shown:
 * - Left card: "Deactivate user" with a button "Deactivate…"
 * - Right card: "Remove from team" with a button "Remove…"
 *
 * Each button opens an Ant Design Modal.confirm with similar structure (title, short warning text, Cancel/Confirm).
 * The titles differ:
 * - "Deactivate this user?"
 * - "Remove this user from the team?"
 *
 * On the right side of the page (same viewport), there is a "Preview" card that shows a small static image of the *target* confirmation dialog (a screenshot-like thumbnail). The preview is intentionally visual: it shows the dialog title and the confirm button style, but the browsergym instruction does NOT name which action to pick.
 *
 * The agent must visually match the preview to the dialog it opens, then click "Confirm". Only one dialog can be open at a time.
 *
 * Note: The preview target is "remove_from_team" dialog
 */

import React, { useRef } from 'react';
import { Card, Button, Modal, message, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const previewTarget = 'remove_from_team';

  const handleDeactivate = () => {
    Modal.confirm({
      title: 'Deactivate this user?',
      content: 'The user will no longer be able to access their account.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'confirm',
          dialog_instance: 'deactivate_user',
        };
        message.info('Action recorded');
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'deactivate_user',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'deactivate_user',
    };
  };

  const handleRemove = () => {
    Modal.confirm({
      title: 'Remove this user from the team?',
      content: 'They will lose access to all team resources.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          window.__cbDialogState = {
            dialog_open: false,
            last_action: 'confirm',
            dialog_instance: 'remove_from_team',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'remove_from_team',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'remove_from_team',
    };
  };

  // Store preview target for checker
  if (typeof window !== 'undefined') {
    (window as any).__cbPreviewTarget = previewTarget;
  }

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Action cards */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Card title="Deactivate user" style={{ width: 200 }}>
          <Button danger onClick={handleDeactivate} data-testid="cb-open-deactivate">
            Deactivate…
          </Button>
        </Card>
        <Card title="Remove from team" style={{ width: 200 }}>
          <Button danger onClick={handleRemove} data-testid="cb-open-remove">
            Remove…
          </Button>
        </Card>
      </div>

      {/* Preview card */}
      <Card
        title="Preview"
        style={{ width: 280 }}
        data-cb-preview-target="remove_from_team"
      >
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: 8,
            padding: 16,
            background: '#fafafa',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 16 }}>
            Remove this user from the team?
          </div>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 12 }}>
            They will lose access to all team resources.
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <div style={{ padding: '4px 12px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 12 }}>
              Cancel
            </div>
            <div style={{ padding: '4px 12px', background: '#ff4d4f', color: '#fff', borderRadius: 4, fontSize: 12 }}>
              Confirm
            </div>
          </div>
        </div>
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          Match this dialog to complete the task
        </Text>
      </Card>
    </div>
  );
}
