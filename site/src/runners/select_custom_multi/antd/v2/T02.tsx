'use client';

/**
 * select_custom_multi-antd-v2-T02: Table row environment field with responsive overflow
 *
 * Table cell layout, dark theme, compact spacing, small scale, off-center, high clutter.
 * "Project staffing" table with 3 rows (Team A, B, C). Only Team B has an editable
 * AntD Select (mode=multiple, showSearch, maxTagCount=responsive) in its Environments cell.
 * Team A/C are read-only.
 * Initial Team B: [EU-Prod-Legacy, US-Prod]. Target: [EU-Prod, EU-Staging, US-Prod, APAC-Prod].
 * Row-local "Save row" button commits only Team B.
 *
 * Success: Team B = {EU-Prod, EU-Staging, US-Prod, APAC-Prod}, Save row clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Select, Typography, Button, Space, ConfigProvider, theme as antTheme } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const setsEqual = (a: string[], b: string[]) => {
  const sa = new Set(a);
  const sb = new Set(b);
  return sa.size === sb.size && Array.from(sa).every(v => sb.has(v));
};

const envOptions = [
  'EU-Prod', 'EU-Prod-Legacy', 'EU-Staging', 'EU-Staging-DR',
  'US-Prod', 'US-Prod-Canary', 'US-Staging', 'APAC-Prod', 'APAC-Staging', 'Sandbox',
].map(v => ({ label: v, value: v }));

export default function T02({ onSuccess }: TaskComponentProps) {
  const [teamBEnvs, setTeamBEnvs] = useState<string[]>(['EU-Prod-Legacy', 'US-Prod']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(teamBEnvs, ['EU-Prod', 'EU-Staging', 'US-Prod', 'APAC-Prod'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, teamBEnvs, onSuccess]);

  const handleSaveRow = () => {
    setSaved(true);
  };

  const cellStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderBottom: '1px solid #303030',
    fontSize: 12,
  };

  return (
    <ConfigProvider theme={{ algorithm: antTheme.darkAlgorithm }}>
      <div style={{ padding: 16, background: '#141414', minHeight: '100vh', color: '#e0e0e0' }}>
        <Title level={5} style={{ color: '#e0e0e0' }}>Project staffing</Title>

        <Space style={{ marginBottom: 12 }}>
          <Text type="secondary" style={{ fontSize: 11 }}>Filter: Active teams</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>|</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>Sort: Name A-Z</Text>
        </Space>

        <div style={{ border: '1px solid #303030', borderRadius: 4, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#1a1a1a' }}>
                <th style={{ ...cellStyle, textAlign: 'left', width: 100 }}>Team</th>
                <th style={{ ...cellStyle, textAlign: 'left', width: 80 }}>Status</th>
                <th style={{ ...cellStyle, textAlign: 'left' }}>Environments</th>
                <th style={{ ...cellStyle, width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={cellStyle}><Text style={{ fontSize: 12, color: '#e0e0e0' }}>Team A</Text></td>
                <td style={cellStyle}><Text type="success" style={{ fontSize: 11 }}>● Active</Text></td>
                <td style={cellStyle}><Text style={{ fontSize: 12, color: '#aaa' }}>US-Prod, EU-Prod</Text></td>
                <td style={cellStyle}></td>
              </tr>
              <tr style={{ background: '#1a1a2e' }}>
                <td style={cellStyle}><Text strong style={{ fontSize: 12, color: '#e0e0e0' }}>Team B</Text></td>
                <td style={cellStyle}><Text type="warning" style={{ fontSize: 11 }}>● Review</Text></td>
                <td style={cellStyle}>
                  <Select
                    mode="multiple"
                    showSearch
                    maxTagCount="responsive"
                    size="small"
                    style={{ width: '100%' }}
                    value={teamBEnvs}
                    onChange={(v) => { setTeamBEnvs(v); setSaved(false); }}
                    options={envOptions}
                  />
                </td>
                <td style={{ ...cellStyle, textAlign: 'center' }}>
                  <Button size="small" type="primary" data-testid="save-row-team-b" onClick={handleSaveRow}>
                    Save row
                  </Button>
                </td>
              </tr>
              <tr>
                <td style={cellStyle}><Text style={{ fontSize: 12, color: '#e0e0e0' }}>Team C</Text></td>
                <td style={cellStyle}><Text type="success" style={{ fontSize: 11 }}>● Active</Text></td>
                <td style={cellStyle}><Text style={{ fontSize: 12, color: '#aaa' }}>APAC-Prod, APAC-Staging</Text></td>
                <td style={cellStyle}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </ConfigProvider>
  );
}
