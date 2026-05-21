'use client';

/**
 * T02: Three editors — update Details only
 *
 * Dashboard panel with a "Release blurb" card containing three stacked editors:
 * "Summary", "Details", and "Internal notes". Clutter: KPI chips, activity table, timeline card.
 * Initial: Summary="Short summary goes here.", Details="", Internal notes="For staff only."
 * Success: Details matches target, others unchanged, "Apply section" clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import type { TaskComponentProps } from '../../types';
import { markdownMatches } from '../../types';

const INIT_SUMMARY = 'Short summary goes here.';
const INIT_DETAILS = '';
const INIT_INTERNAL = 'For staff only.';

const TARGET_DETAILS = `## Details
The release includes:
- API is stable
- UI polish pending`;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [summary, setSummary] = useState(INIT_SUMMARY);
  const [details, setDetails] = useState(INIT_DETAILS);
  const [internal, setInternal] = useState(INIT_INTERNAL);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      markdownMatches(details, TARGET_DETAILS) &&
      markdownMatches(summary, INIT_SUMMARY) &&
      markdownMatches(internal, INIT_INTERNAL)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, details, summary, internal, onSuccess]);

  const handleApply = () => setSaved(true);

  const editors: { label: string; value: string; setter: (v: string) => void }[] = [
    { label: 'Summary', value: summary, setter: setSummary },
    { label: 'Details', value: details, setter: setDetails },
    { label: 'Internal notes', value: internal, setter: setInternal },
  ];

  return (
    <div style={{ display: 'flex', gap: 20, width: 1000 }}>
      <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Uptime 99.9%', 'Deploys: 42', 'Alerts: 3'].map((label) => (
            <span
              key={label}
              style={{ padding: '3px 8px', background: '#f0f5ff', borderRadius: 10, fontSize: 11, color: '#1677ff' }}
            >
              {label}
            </span>
          ))}
        </div>
        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Activity</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td style={{ padding: '3px 0', color: '#666' }}>Deploy v2.4</td><td style={{ color: '#999' }}>10m ago</td></tr>
              <tr><td style={{ padding: '3px 0', color: '#666' }}>Config push</td><td style={{ color: '#999' }}>1h ago</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ padding: 12, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#999', marginBottom: 4 }}>Timeline</div>
          <div style={{ fontSize: 12, color: '#999' }}>v2.3 released Jan 15</div>
          <div style={{ fontSize: 12, color: '#999' }}>v2.4 staged Feb 01</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: 16, background: '#fff', borderRadius: 8, border: '1px solid #e8e8e8' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 16 }}>Release blurb</h3>
        {editors.map(({ label, value, setter }) => (
          <div key={label} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{label}</div>
            <MDEditor
              value={value}
              onChange={(val) => { setSaved(false); setter(val || ''); }}
              preview="live"
              height={120}
              data-color-mode="light"
            />
          </div>
        ))}
        <button
          onClick={handleApply}
          style={{ padding: '8px 20px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}
        >
          Apply section
        </button>
      </div>
    </div>
  );
}
