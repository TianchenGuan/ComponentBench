'use client';

/**
 * password_input-antd-T05: Update the Admin console password (choose correct field)
 * 
 * A "User credentials" form section contains two Ant Design Input.Password components stacked vertically:
 * 1) "Login password" (for standard sign-in)
 * 2) "Admin console password" (for privileged admin access)
 * Both inputs start empty and both have the standard eye icon visibility toggle. A short help caption
 * under each label explains its purpose.
 * No Save/Apply button is present; success is based only on the correct field value.
 * 
 * Success: The Input.Password labeled "Admin console password" equals exactly "AdminGate-77!".
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [loginPassword, setLoginPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (adminPassword === 'AdminGate-77!') {
      onSuccess();
    }
  }, [adminPassword, onSuccess]);

  return (
    <Card title="User credentials" style={{ width: 400 }}>
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="login-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Login password
        </label>
        <Input.Password
          id="login-password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          data-testid="login-password-input"
          data-cb-instance="login"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Used for standard sign-in to your account.
        </Text>
      </div>
      
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="admin-password" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Admin console password
        </label>
        <Input.Password
          id="admin-password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
          data-testid="admin-password-input"
          data-cb-instance="admin"
        />
        <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          Required for privileged admin access.
        </Text>
      </div>
    </Card>
  );
}
