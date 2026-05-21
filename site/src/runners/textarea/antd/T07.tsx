'use client';

/**
 * textarea-antd-T07: Find the incident report box by scrolling
 *
 * A dashboard-style page (dashboard layout) is aligned toward the top-right of the viewport.
 * Contains several cards in a vertical column: "Overview", "Metrics", "Alerts", and near the bottom "Incident report".
 * - Light theme, comfortable spacing, default scale.
 * - The "Incident report" card is below the fold; it becomes visible only after scrolling the page.
 * - The target component is an Ant Design Input.TextArea labeled "Incident report", initially empty with 4 fixed rows.
 * - Other cards contain non-interactive charts and a few small buttons (distractors).
 *
 * Success: Value equals "Service outage lasted 12 minutes; users recovered after a restart."
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

const TARGET_VALUE = 'Service outage lasted 12 minutes; users recovered after a restart.';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ width: 450, maxHeight: '80vh', overflowY: 'auto' }}>
      {/* Overview Card */}
      <Card title="Overview" style={{ marginBottom: 16 }}>
        <div style={{ height: 120, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          [Chart placeholder]
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Button size="small">Refresh</Button>
          <Button size="small">Export</Button>
        </div>
      </Card>

      {/* Metrics Card */}
      <Card title="Metrics" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Requests</Text>
            <div style={{ fontSize: 24, fontWeight: 600 }}>14,523</div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Errors</Text>
            <div style={{ fontSize: 24, fontWeight: 600 }}>12</div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>Latency</Text>
            <div style={{ fontSize: 24, fontWeight: 600 }}>42ms</div>
          </div>
        </div>
      </Card>

      {/* Alerts Card */}
      <Card title="Alerts" style={{ marginBottom: 16 }}>
        <div style={{ padding: 16, background: '#fff7e6', borderRadius: 4, marginBottom: 8 }}>
          ⚠️ High memory usage detected
        </div>
        <div style={{ padding: 16, background: '#f6ffed', borderRadius: 4 }}>
          ✅ All services operational
        </div>
      </Card>

      {/* Incident Report Card - Target */}
      <Card title="Incident report" style={{ marginBottom: 16 }}>
        <div>
          <label htmlFor="incident-report" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Incident report
          </label>
          <TextArea
            id="incident-report"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            placeholder="Describe the incident..."
            data-testid="textarea-incident-report"
          />
        </div>
      </Card>
    </div>
  );
}
