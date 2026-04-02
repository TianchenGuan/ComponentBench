'use client';

/**
 * alert_dialog_confirm-antd-T08: Confirm the correct Popconfirm near the viewport edge (compact + small)
 *
 * Isolated-card layout anchored to the bottom-right of the viewport (non-centered placement). Spacing is set to compact and the card uses the small size tier.
 *
 * The card is titled "Maintenance" and contains two very small icon-only danger actions displayed inline:
 * - "Clear cache" (trash icon)
 * - "Clear logs" (trash icon, same style)
 *
 * Each icon triggers an Ant Design Popconfirm bubble with identical button labels "Cancel" and "OK". The only reliable textual difference is the Popconfirm title:
 * - "Clear cache?"
 * - "Clear logs?"
 *
 * Because the card is near the bottom-right edge, the Popconfirm may auto-shift placement and the bubble can appear slightly above/left of the trigger.
 */

import React, { useRef } from 'react';
import { Card, Button, Popconfirm, message, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  const handleConfirmLogs = () => {
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      window.__cbDialogState = {
        dialog_open: false,
        last_action: 'confirm',
        dialog_instance: 'clear_logs',
      };
      message.info('Action recorded');
      onSuccess();
    }
  };

  const handleCancelLogs = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'clear_logs',
    };
  };

  const handleConfirmCache = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'confirm',
      dialog_instance: 'clear_cache',
    };
    message.info('Action recorded');
  };

  const handleCancelCache = () => {
    window.__cbDialogState = {
      dialog_open: false,
      last_action: 'cancel',
      dialog_instance: 'clear_cache',
    };
  };

  return (
    <Card title="Maintenance" size="small" style={{ width: 200 }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Popconfirm
          title="Clear cache?"
          description="This will clear the application cache."
          onConfirm={handleConfirmCache}
          onCancel={handleCancelCache}
          okText="OK"
          cancelText="Cancel"
        >
          <Tooltip title="Clear cache">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              data-testid="cb-clear-cache"
              data-cb-instance="clear_cache"
            />
          </Tooltip>
        </Popconfirm>

        <Popconfirm
          title="Clear logs?"
          description="This will clear all server logs."
          onConfirm={handleConfirmLogs}
          onCancel={handleCancelLogs}
          okText="OK"
          cancelText="Cancel"
          okButtonProps={{ 'data-testid': 'cb-confirm' } as any}
          cancelButtonProps={{ 'data-testid': 'cb-cancel' } as any}
        >
          <Tooltip title="Clear logs">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              data-testid="cb-clear-logs"
              data-cb-instance="clear_logs"
            />
          </Tooltip>
        </Popconfirm>
      </div>
    </Card>
  );
}
