'use client';

/**
 * select_custom_multi-antd-T08: Pick 5 similar environments in compact dark UI
 *
 * Scene context: theme=dark, spacing=compact, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Theme: dark. Spacing: compact.
 * Layout: isolated card centered titled "Access control".
 * One Ant Design Select in tags/multi mode labeled "Environments".
 * Configuration highlights:
 * - Search is enabled inside the Select input; typing filters the dropdown options.
 * - maxTagCount is set to 2, so after more than two selections the input shows two tags plus a "+N" overflow indicator.
 * Dropdown options (28 total) include many similar names, for example:
 *   EU-Prod, EU-Prod (legacy), EU-Staging, EU-Staging (backup),
 *   US-Prod, US-Prod (legacy), US-Staging, US-Staging (backup),
 *   APAC-Prod, APAC-Staging, APAC-Prod (beta), APAC-Prod (legacy),
 *   and additional non-target environments (Dev, QA, Sandbox, Demo, Training, etc.).
 * Initial state: empty.
 * No other components are interactive.
 *
 * Success: The selected values are exactly: EU-Prod, EU-Staging, US-Prod, US-Staging, APAC-Prod (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const environments = [
  'EU-Prod', 'EU-Prod (legacy)', 'EU-Staging', 'EU-Staging (backup)',
  'US-Prod', 'US-Prod (legacy)', 'US-Staging', 'US-Staging (backup)',
  'APAC-Prod', 'APAC-Staging', 'APAC-Prod (beta)', 'APAC-Prod (legacy)',
  'Dev', 'Dev-2', 'Dev-3', 'QA', 'QA-2', 'Sandbox', 'Sandbox-2',
  'Demo', 'Demo-2', 'Training', 'Training-2', 'Test', 'Test-2',
  'Integration', 'Integration-2', 'Perf'
];

const options = environments.map(e => ({ label: e, value: e }));

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['EU-Prod', 'EU-Staging', 'US-Prod', 'US-Staging', 'APAC-Prod']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const cardContent = (
    <Card 
      title="Access control" 
      style={{ width: 450 }}
      styles={{ header: { background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #303030' }, body: { background: '#1f1f1f' } }}
    >
      <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Environments</Text>
      <Select
        mode="multiple"
        data-testid="environments-select"
        style={{ width: '100%' }}
        placeholder="Select environments"
        value={selected}
        onChange={setSelected}
        options={options}
        maxTagCount={2}
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      />
    </Card>
  );

  // Apply dark theme based on task scene_context
  if (task.scene_context.theme === 'dark') {
    return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        {cardContent}
      </ConfigProvider>
    );
  }

  return cardContent;
}
