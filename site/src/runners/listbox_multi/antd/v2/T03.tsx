'use client';

/**
 * listbox_multi-antd-v2-T03: Dashboard filters match reference segments
 *
 * Dashboard panel with 3 Checkbox.Group lists (Regions, Customer segments, Plan tiers).
 * A reference chip row above Customer segments shows: Enterprise, SMB, Education, Non-profit.
 * Customer segments is the TARGET; Regions and Plan tiers start empty and must remain unchanged.
 * Target: Enterprise, SMB, Education, Non-profit. Confirm via "Apply filters".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Checkbox, Space, Typography, Tag, Divider } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const regionOptions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East'];
const segmentOptions = ['Enterprise', 'SMB', 'Mid-market', 'Education', 'Non-profit', 'Government', 'Startups', 'NGO'];
const tierOptions = ['Free', 'Starter', 'Pro', 'Enterprise', 'Custom'];

const referenceChips = ['Enterprise', 'SMB', 'Education', 'Non-profit'];
const targetSet = ['Enterprise', 'SMB', 'Education', 'Non-profit'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [regions, setRegions] = useState<string[]>([]);
  const [segments, setSegments] = useState<string[]>([]);
  const [tiers, setTiers] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      saved &&
      setsEqual(segments, targetSet) &&
      setsEqual(regions, []) &&
      setsEqual(tiers, [])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, segments, regions, tiers, onSuccess]);

  const handleApply = () => setSaved(true);
  const resetSaved = () => setSaved(false);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 24 }}>
      <Card style={{ width: 280, flexShrink: 0 }}>
        <Title level={5} style={{ margin: 0, marginBottom: 12 }}>Filters</Title>

        <Text strong style={{ display: 'block', marginBottom: 8 }}>Regions</Text>
        <Checkbox.Group
          value={regions}
          onChange={(vals) => { setRegions(vals as string[]); resetSaved(); }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {regionOptions.map(opt => <Checkbox key={opt} value={opt}>{opt}</Checkbox>)}
          </Space>
        </Checkbox.Group>

        <Divider style={{ margin: '12px 0' }} />

        <Text type="secondary" style={{ display: 'block', marginBottom: 6, fontSize: 12 }}>
          Reference segments
        </Text>
        <div style={{ marginBottom: 12 }}>
          {referenceChips.map(c => <Tag key={c} color="blue" style={{ marginBottom: 4 }}>{c}</Tag>)}
        </div>

        <Text strong style={{ display: 'block', marginBottom: 8 }}>Customer segments</Text>
        <Checkbox.Group
          value={segments}
          onChange={(vals) => { setSegments(vals as string[]); resetSaved(); }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {segmentOptions.map(opt => <Checkbox key={opt} value={opt}>{opt}</Checkbox>)}
          </Space>
        </Checkbox.Group>

        <Divider style={{ margin: '12px 0' }} />

        <Text strong style={{ display: 'block', marginBottom: 8 }}>Plan tiers</Text>
        <Checkbox.Group
          value={tiers}
          onChange={(vals) => { setTiers(vals as string[]); resetSaved(); }}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {tierOptions.map(opt => <Checkbox key={opt} value={opt}>{opt}</Checkbox>)}
          </Space>
        </Checkbox.Group>

        <Divider style={{ margin: '12px 0' }} />

        <Button type="primary" block onClick={handleApply}>Apply filters</Button>
      </Card>

      <Card style={{ flex: 1 }}>
        <Title level={4} style={{ margin: 0 }}>Customer Analytics</Title>
        <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
          Revenue breakdown by segment and region
        </Text>
        <div style={{ marginTop: 24, padding: 40, textAlign: 'center', background: '#fafafa', borderRadius: 6 }}>
          <Text type="secondary">Chart area</Text>
        </div>
      </Card>
    </div>
  );
}
