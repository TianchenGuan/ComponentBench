'use client';

/**
 * tree_select-antd-v2-T02: Table-cell rule row — scroll to final bug tag and save row
 *
 * Table with two expanded rows: "Gateway alert" (target) and "Billing alert" (non-target).
 * Each row has an "Issue tag" TreeSelect and a row-local "Save row" button.
 * The Bugs > UI subtree has many siblings; Z-Index sits near the bottom.
 *
 * Success: Gateway = tag-bugs-ui-z-index, Billing unchanged, Save row clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, TreeSelect, Button, Typography, Tag, Space, Table } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const tagTreeData = [
  {
    value: 'bugs', title: 'Bugs', selectable: false, children: [
      {
        value: 'bugs-api', title: 'API', selectable: false, children: [
          { value: 'tag-bugs-api-timeouts', title: 'Timeouts' },
          { value: 'tag-bugs-api-auth', title: 'Auth' },
          { value: 'tag-bugs-api-ratelimits', title: 'Rate Limits' },
        ],
      },
      {
        value: 'bugs-ui', title: 'UI', selectable: false, children: [
          { value: 'tag-bugs-ui-layout', title: 'Layout' },
          { value: 'tag-bugs-ui-typography', title: 'Typography' },
          { value: 'tag-bugs-ui-color', title: 'Color' },
          { value: 'tag-bugs-ui-overflow', title: 'Overflow' },
          { value: 'tag-bugs-ui-animation', title: 'Animation' },
          { value: 'tag-bugs-ui-responsive', title: 'Responsive' },
          { value: 'tag-bugs-ui-focus', title: 'Focus' },
          { value: 'tag-bugs-ui-z-index', title: 'Z-Index' },
        ],
      },
      {
        value: 'bugs-perf', title: 'Performance', selectable: false, children: [
          { value: 'tag-bugs-perf-memory', title: 'Memory' },
          { value: 'tag-bugs-perf-cpu', title: 'CPU' },
        ],
      },
    ],
  },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [gatewayTag, setGatewayTag] = useState<string | undefined>(undefined);
  const [billingTag] = useState<string>('tag-bugs-api-timeouts');
  const [gatewayCommitted, setGatewayCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (gatewayCommitted && gatewayTag === 'tag-bugs-ui-z-index' && billingTag === 'tag-bugs-api-timeouts') {
      successFired.current = true;
      onSuccess();
    }
  }, [gatewayCommitted, gatewayTag, billingTag, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 700, position: 'absolute', bottom: 40, left: 40 }}>
      <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 12 }}>Alert Rules</Text>
      <Card size="small">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12 }}>Alert</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12 }}>Severity</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12 }}>Issue tag</th>
              <th style={{ padding: '8px 12px', fontSize: 12 }} />
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '8px 12px' }}>
                <Text strong>Gateway alert</Text>
              </td>
              <td style={{ padding: '8px 12px' }}><Tag color="red">Critical</Tag></td>
              <td style={{ padding: '8px 12px', minWidth: 220 }}>
                <TreeSelect
                  size="small"
                  style={{ width: '100%' }}
                  value={gatewayTag}
                  onChange={(val) => { setGatewayTag(val); setGatewayCommitted(false); }}
                  treeData={tagTreeData}
                  placeholder="Select tag"
                  showSearch={false}
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                />
              </td>
              <td style={{ padding: '8px 12px' }}>
                <Button size="small" type="primary" onClick={() => setGatewayCommitted(true)}>Save row</Button>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 12px' }}>
                <Text strong>Billing alert</Text>
              </td>
              <td style={{ padding: '8px 12px' }}><Tag color="orange">Warning</Tag></td>
              <td style={{ padding: '8px 12px', minWidth: 220 }}>
                <TreeSelect
                  size="small"
                  style={{ width: '100%' }}
                  value={billingTag}
                  treeData={tagTreeData}
                  placeholder="Select tag"
                  showSearch={false}
                  disabled
                  dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                />
              </td>
              <td style={{ padding: '8px 12px' }}>
                <Button size="small" disabled>Save row</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
