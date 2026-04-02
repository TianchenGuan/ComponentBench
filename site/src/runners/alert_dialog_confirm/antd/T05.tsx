'use client';

/**
 * alert_dialog_confirm-antd-T05: Confirm the correct danger action among two (settings panel)
 *
 * Settings panel layout centered in the viewport with a left navigation rail (non-interactive for this task) and a main "Security" panel.
 *
 * The "Security" panel contains a "Danger Zone" section with TWO destructive action rows (two instances of the same canonical confirm-dialog pattern):
 * 1) "Revoke API token" with a button labeled "Revoke token"
 * 2) "Delete workspace" with a button labeled "Delete workspace"
 *
 * Clicking either button opens an Ant Design Modal.confirm dialog with matching title/body and a red confirm button.
 * - Revoke token dialog title: "Revoke API token?"
 * - Delete workspace dialog title: "Delete this workspace?"
 *
 * Both dialogs have footer buttons "Cancel" and "Confirm", plus an × close icon. Only one dialog can be open at a time.
 */

import React, { useRef } from 'react';
import { Card, Button, Modal, message, Typography, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleRevokeToken = () => {
    Modal.confirm({
      title: 'Revoke API token?',
      content: 'This will invalidate the current token. You will need to generate a new one.',
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
            dialog_instance: 'revoke_api_token',
          };
          message.info('Action recorded');
          onSuccess();
        }
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'revoke_api_token',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'revoke_api_token',
    };
  };

  const handleDeleteWorkspace = () => {
    Modal.confirm({
      title: 'Delete this workspace?',
      content: 'All data will be permanently removed. This cannot be undone.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: { danger: true, 'data-testid': 'cb-confirm' } as any,
      cancelButtonProps: { 'data-testid': 'cb-cancel' } as any,
      onOk: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'confirm',
          dialog_instance: 'delete_workspace',
        };
        message.info('Action recorded');
      },
      onCancel: () => {
        window.__cbDialogState = {
          dialog_open: false,
          last_action: 'cancel',
          dialog_instance: 'delete_workspace',
        };
      },
    });

    window.__cbDialogState = {
      dialog_open: true,
      last_action: null,
      dialog_instance: 'delete_workspace',
    };
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Nav rail (non-interactive) */}
      <div style={{ width: 180, background: '#fafafa', borderRadius: 8, padding: 16 }}>
        <div style={{ padding: '8px 12px', background: '#e6f4ff', borderRadius: 4, marginBottom: 8 }}>Security</div>
        <div style={{ padding: '8px 12px', color: '#999' }}>General</div>
        <div style={{ padding: '8px 12px', color: '#999' }}>Notifications</div>
      </div>

      {/* Main panel */}
      <Card title="Security" style={{ flex: 1, minWidth: 400 }}>
        <div style={{ marginBottom: 24 }}>
          <Text>Manage your security settings and access tokens.</Text>
        </div>

        <Divider />

        <div>
          <Title level={5} style={{ color: '#ff4d4f' }}>Danger Zone</Title>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #ffccc7', borderRadius: 8 }}>
              <div>
                <Text strong>Revoke API token</Text>
                <div><Text type="secondary">Invalidate the current API token</Text></div>
              </div>
              <Button danger onClick={handleRevokeToken} data-testid="cb-open-revoke-token">
                Revoke token
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, border: '1px solid #ffccc7', borderRadius: 8 }}>
              <div>
                <Text strong>Delete workspace</Text>
                <div><Text type="secondary">Permanently delete this workspace</Text></div>
              </div>
              <Button danger onClick={handleDeleteWorkspace} data-testid="cb-open-delete-workspace">
                Delete workspace
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
