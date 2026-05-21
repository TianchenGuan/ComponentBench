'use client';

/**
 * T14: Four-editor high-contrast customer note
 *
 * High-contrast settings panel with four stacked editors: "Summary",
 * "Customer-facing note", "Rollback note", "Internal escalation".
 * Clutter: toggles, segmented controls, status chips above editors.
 * Only "Customer-facing note" should change (starts empty).
 * Success: Customer-facing note matches target, others unchanged, "Save panel" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT: Record<string, string> = {
  'Summary': 'Summary draft.',
  'Customer-facing note': '',
  'Rollback note': 'Rollback checklist.',
  'Internal escalation': 'Escalate only if paging.',
};

const TARGET_CUSTOMER = `## Customer note
Release postponed to Tuesday.
Please watch the status page.`;

export default function T14({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState(INIT);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      markdownMatches(values['Customer-facing note'], TARGET_CUSTOMER) &&
      markdownMatches(values['Summary'], INIT['Summary']) &&
      markdownMatches(values['Rollback note'], INIT['Rollback note']) &&
      markdownMatches(values['Internal escalation'], INIT['Internal escalation'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, values, onSuccess]);

  const updateEditor = (label: string, val: string) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [label]: val }));
  };

  return (
    <div style={{ width: 720, background: '#000', borderRadius: 8, border: '2px solid #fff', padding: 20, color: '#f0f0f0' }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Panel settings</h3>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <input type="checkbox" defaultChecked /> Auto-refresh
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <input type="checkbox" /> Compact view
        </label>
        <span style={{ padding: '3px 8px', background: '#333', borderRadius: 4, fontSize: 11, color: '#0f0' }}>
          ● Healthy
        </span>
        <span style={{ padding: '3px 8px', background: '#333', borderRadius: 4, fontSize: 11, color: '#fa0' }}>
          ● 2 Warnings
        </span>
        <select style={{ padding: '3px 6px', background: '#222', color: '#fff', border: '1px solid #555', borderRadius: 4, fontSize: 12 }}>
          <option>Region: US-East</option>
          <option>Region: EU-West</option>
        </select>
      </div>

      {Object.keys(INIT).map((label) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{label}</div>
          <div data-color-mode="dark">
            <MDEditor
              value={values[label]}
              onChange={(val) => updateEditor(label, val || '')}
              preview="live"
              height={100}
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => setSaved(true)}
        style={{
          marginTop: 8,
          padding: '8px 20px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Save panel
      </button>
    </div>
  );
}
