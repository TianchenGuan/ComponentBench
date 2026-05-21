'use client';

/**
 * checkbox-antd-T09: Find and enable audit logging (scroll to checkbox)
 *
 * Layout: form section titled "Security settings".
 * The section is long enough that not all content fits in the viewport. It contains three AntD Checkboxes in total:
 *   - "Send login alerts" (initially unchecked) near the top
 *   - "Require 2-step verification" (initially checked) in the middle
 *   - "Enable audit logging" (initially unchecked) near the bottom, initially off-screen below the fold
 * You may need to scroll the page to reveal the bottom checkbox. There is no Save/Apply button; the checkbox state is committed immediately.
 * Clutter: additional non-checkbox form fields (text input, select) appear between checkbox rows but do not affect success.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Input, Select, Divider } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [loginAlerts, setLoginAlerts] = useState(false);
  const [twoStep, setTwoStep] = useState(true);
  const [auditLogging, setAuditLogging] = useState(false);

  const handleAuditLoggingChange = (e: { target: { checked: boolean } }) => {
    const newChecked = e.target.checked;
    setAuditLogging(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Security settings" style={{ width: 500 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* First checkbox */}
        <Checkbox
          checked={loginAlerts}
          onChange={(e) => setLoginAlerts(e.target.checked)}
          data-testid="cb-login-alerts"
        >
          Send login alerts
        </Checkbox>

        {/* Some form fields as clutter */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Session timeout</div>
          <Select
            defaultValue="30"
            style={{ width: 200 }}
            options={[
              { value: '15', label: '15 minutes' },
              { value: '30', label: '30 minutes' },
              { value: '60', label: '1 hour' },
            ]}
          />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Second checkbox */}
        <Checkbox
          checked={twoStep}
          onChange={(e) => setTwoStep(e.target.checked)}
          data-testid="cb-two-step-verification"
        >
          Require 2-step verification
        </Checkbox>

        {/* More form fields as clutter */}
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Backup email</div>
          <Input placeholder="Enter backup email" style={{ width: 300 }} />
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Recovery phone</div>
          <Input placeholder="Enter recovery phone" style={{ width: 300 }} />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Additional spacing to push the target below fold */}
        <div style={{ height: 100 }} />

        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>Allowed IP ranges</div>
          <Input.TextArea placeholder="Enter IP ranges, one per line" rows={3} style={{ width: 400 }} />
        </div>

        <div style={{ height: 100 }} />

        {/* Target checkbox - near the bottom */}
        <Checkbox
          checked={auditLogging}
          onChange={handleAuditLoggingChange}
          data-testid="cb-audit-logging"
        >
          Enable audit logging
        </Checkbox>
        <div style={{ fontSize: 12, color: '#999', marginTop: -12 }}>
          Keep detailed logs of all security-related events.
        </div>
      </div>
    </Card>
  );
}
