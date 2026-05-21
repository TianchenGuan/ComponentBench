'use client';

/**
 * button-antd-T10: Confirm destructive action in Popconfirm (Yes, delete)
 * 
 * Centered card titled "Danger zone" with a danger Button "Delete token".
 * Clicking opens Popconfirm with "Cancel" and "Yes, delete" buttons.
 * Task: Click "Delete token" then "Yes, delete" in the confirmation.
 */

import React, { useState } from 'react';
import { Button, Card, Popconfirm } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [deleted, setDeleted] = useState(false);

  const handleConfirm = () => {
    setDeleted(true);
    onSuccess();
  };

  return (
    <Card title="Danger zone" style={{ width: 400 }}>
      <p style={{ marginBottom: 16, color: '#666' }}>
        Deleting the token will revoke all access. This action cannot be undone.
      </p>
      
      {deleted ? (
        <div style={{ color: '#52c41a' }}>Token deleted</div>
      ) : (
        <Popconfirm
          title="Delete token"
          description="Are you sure you want to delete this token? This action cannot be undone."
          onConfirm={handleConfirm}
          okText="Yes, delete"
          cancelText="Cancel"
          okButtonProps={{
            danger: true,
            'data-testid': 'antd-btn-popconfirm-yes-delete',
          } as any}
          cancelButtonProps={{
            'data-testid': 'antd-btn-popconfirm-cancel',
          } as any}
        >
          <Button danger data-testid="antd-btn-delete-token">
            Delete token
          </Button>
        </Popconfirm>
      )}
    </Card>
  );
}
