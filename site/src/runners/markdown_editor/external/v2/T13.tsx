'use client';

/**
 * T13: Auth row reviewer note with inline code
 *
 * Table with two expanded rows: "Auth" and "Billing". Each has a compact
 * "Reviewer note (Markdown)" editor and a row-local Save button.
 * Auth starts empty; target: `> Use \`tokenTTL\` from config.`
 * Billing: "Use billingProfile first." — must remain unchanged.
 * Success: Auth matches target, Billing unchanged, Auth row "Save" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT_AUTH = '';
const INIT_BILLING = 'Use billingProfile first.';
const TARGET_AUTH = '> Use `tokenTTL` from config.';

export default function T13({ onSuccess }: TaskComponentProps) {
  const [auth, setAuth] = useState(INIT_AUTH);
  const [billing, setBilling] = useState(INIT_BILLING);
  const [authSaved, setAuthSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      authSaved &&
      markdownMatches(auth, TARGET_AUTH) &&
      markdownMatches(billing, INIT_BILLING)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [authSaved, auth, billing, onSuccess]);

  const renderRow = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    onSave: () => void,
    saveId: string,
  ) => (
    <tr>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', fontWeight: 600, verticalAlign: 'top', width: 80 }}>
        {label}
      </td>
      <td style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#999', marginBottom: 6 }}>
          Reviewer note (Markdown)
        </div>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          height={80}
          data-color-mode="light"
        />
        <button
          data-testid={saveId}
          onClick={onSave}
          style={{
            marginTop: 8,
            padding: '4px 14px',
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Save
        </button>
      </td>
    </tr>
  );

  return (
    <div style={{ width: 620, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8', padding: 16 }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Services</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', color: '#999', fontSize: 12 }}>
              Service
            </th>
            <th style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left', color: '#999', fontSize: 12 }}>
              Reviewer note
            </th>
          </tr>
        </thead>
        <tbody>
          {renderRow(
            'Auth',
            auth,
            (v) => { setAuthSaved(false); setAuth(v); },
            () => setAuthSaved(true),
            'save-auth-row',
          )}
          {renderRow(
            'Billing',
            billing,
            setBilling,
            () => {},
            'save-billing-row',
          )}
        </tbody>
      </table>
    </div>
  );
}
