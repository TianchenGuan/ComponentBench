'use client';

/**
 * autocomplete_restricted-antd-v2-T02
 *
 * Drawer with a non-searchable Select holding 80 severity levels (Level 01–Level 80).
 * The dropdown is internally scrollable; Level 72 is offscreen initially.
 * Success: Severity level = Level 72, Apply policy clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, Select, Typography, Card, Switch, Space } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const severityOptions = Array.from({ length: 80 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { label: `Level ${n}`, value: `Level ${n}` };
});

export default function T02({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [severity, setSeverity] = useState<string | undefined>(undefined);
  const [applied, setApplied] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (applied && severity === 'Level 72') {
      successFired.current = true;
      onSuccess();
    }
  }, [applied, severity, onSuccess]);

  const handleApply = () => setApplied(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 24, minHeight: '80vh' }}>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>Escalation policy</Button>

      <Drawer
        title="Escalation policy"
        placement="right"
        width={380}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Card size="small" title="Summary" style={{ background: '#fafafa' }}>
            <Text type="secondary">Current escalation tier: none selected</Text>
          </Card>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 6 }}>Severity level</Text>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose severity"
              value={severity}
              onChange={(v) => { setSeverity(v); setApplied(false); }}
              showSearch={false}
              virtual={false}
              listHeight={220}
              options={severityOptions}
            />
          </div>

          <Switch defaultChecked /> <Text style={{ fontSize: 13 }}>Auto-acknowledge</Text>
          <br />
          <Switch /> <Text style={{ fontSize: 13 }}>Notify on resolve</Text>

          <Button type="primary" block onClick={handleApply} style={{ marginTop: 12 }}>
            Apply policy
          </Button>
        </Space>
      </Drawer>
    </div>
  );
}
