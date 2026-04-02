'use client';

/**
 * combobox_editable_multi-antd-v2-T01
 *
 * Settings panel with two tags fields: "Incident tags" (target) and "Archive tags" (distractor).
 * High clutter surrounds the inputs. autoClearSearchValue=false.
 * Success: Incident tags = {canary, prod-hotfix, rollback}, Archive tags = {legacy}, Apply clicked.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Typography, Input, Checkbox, Tag, Button, Space, Divider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const incidentSuggestions = [
  { value: 'prod', label: 'prod' },
  { value: 'production', label: 'production' },
  { value: 'prod-hotfix', label: 'prod-hotfix' },
  { value: 'rollback', label: 'rollback' },
  { value: 'preprod', label: 'preprod' },
];

const archiveSuggestions = [
  { value: 'legacy', label: 'legacy' },
  { value: 'archived', label: 'archived' },
  { value: 'deprecated', label: 'deprecated' },
];

const TARGET_SET = ['canary', 'prod-hotfix', 'rollback'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [incidentTags, setIncidentTags] = useState<string[]>(['canary']);
  const [archiveTags, setArchiveTags] = useState<string[]>(['legacy']);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (saved && setsEqual(incidentTags, TARGET_SET) && setsEqual(archiveTags, ['legacy'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, incidentTags, archiveTags, onSuccess]);

  const handleApply = () => setSaved(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '24px 48px' }}>
      <Card title="Incident settings" style={{ width: 480 }} size="small">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Checkbox defaultChecked>Auto-assign on-call</Checkbox>
          <Checkbox>Notify Slack channel</Checkbox>
          <Input size="small" placeholder="Webhook URL" defaultValue="https://hooks.example.com/inc" style={{ width: '70%' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <Tag color="red">Active</Tag>
            <Tag color="blue">Monitored</Tag>
            <Tag>v3.1.0</Tag>
          </div>
          <Divider style={{ margin: '8px 0' }} />

          <Text strong style={{ fontSize: 13 }}>Incident tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            placeholder="Add incident tags"
            value={incidentTags}
            onChange={(v) => { setIncidentTags(v); setSaved(false); }}
            options={incidentSuggestions}
            autoClearSearchValue={false}
          />

          <Text strong style={{ fontSize: 13 }}>Archive tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            placeholder="Add archive tags"
            value={archiveTags}
            onChange={(v) => { setArchiveTags(v); setSaved(false); }}
            options={archiveSuggestions}
            autoClearSearchValue={false}
          />

          <Button type="primary" size="small" onClick={handleApply} style={{ marginTop: 8 }}>
            Apply incident tags
          </Button>
        </Space>
      </Card>
    </div>
  );
}
