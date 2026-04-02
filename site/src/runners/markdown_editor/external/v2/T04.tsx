'use client';

/**
 * T04: Gateway row runbook owner edit
 *
 * Dark-themed service table with two expanded rows: "Gateway" and "Billing".
 * Each row has an inline "Runbook (Markdown)" editor and a row-local Save button.
 * Task: In Gateway row, change `- owner: TBD` to `- owner: SRE`. Leave Billing unchanged.
 * Success: Gateway matches target, Billing unchanged, Gateway "Save" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT_GATEWAY = `## Runbook
- owner: TBD
- channel: #ops`;

const TARGET_GATEWAY = `## Runbook
- owner: SRE
- channel: #ops`;

const INIT_BILLING = `## Runbook
- owner: FinOps
- channel: #billing-ops`;

export default function T04({ onSuccess }: TaskComponentProps) {
  const [gateway, setGateway] = useState(INIT_GATEWAY);
  const [billing, setBilling] = useState(INIT_BILLING);
  const [gatewaySaved, setGatewaySaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      gatewaySaved &&
      markdownMatches(gateway, TARGET_GATEWAY) &&
      markdownMatches(billing, INIT_BILLING)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [gatewaySaved, gateway, billing, onSuccess]);

  const border = '1px solid #444';
  const textColor = '#e0e0e0';

  const renderRow = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    onSave: () => void,
    saveId: string,
  ) => (
    <tr>
      <td style={{ padding: '12px 16px', borderBottom: border, color: textColor, fontWeight: 600, verticalAlign: 'top', width: 100 }}>
        {label}
      </td>
      <td style={{ padding: '12px 16px', borderBottom: border }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#aaa', marginBottom: 6 }}>
          Runbook (Markdown)
        </div>
        <div data-color-mode="dark">
          <MDEditor value={value} onChange={(val) => onChange(val || '')} preview="edit" height={100} />
        </div>
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
    <div style={{ width: 700, background: '#1f1f1f', borderRadius: 8, border, padding: 16, color: textColor }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Services</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px 16px', borderBottom: '1px solid #555', textAlign: 'left', color: '#aaa', fontSize: 12 }}>Service</th>
            <th style={{ padding: '8px 16px', borderBottom: '1px solid #555', textAlign: 'left', color: '#aaa', fontSize: 12 }}>Runbook</th>
          </tr>
        </thead>
        <tbody>
          {renderRow(
            'Gateway',
            gateway,
            (v) => { setGatewaySaved(false); setGateway(v); },
            () => setGatewaySaved(true),
            'save-gateway-row',
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
