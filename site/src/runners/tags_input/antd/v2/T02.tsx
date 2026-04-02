'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Card, Select, Typography, Space, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

const allSuggestions = [
  'internal', 'community', 'newsletter', 'faq', 'handoff', 'marketing',
  'growth', 'brand', 'paid', 'organic', 'campaign', 'north-star', 'seo',
  'referral', 'partner', 'product', 'launch', 'webinar', 'event',
  'content', 'social', 'email', 'outreach', 'press', 'blog',
  'podcast', 'video', 'design', 'research', 'analytics', 'data',
  'insights', 'segment', 'cohort', 'funnel', 'retention', 'churn',
  'activation', 'onboarding', 'trial', 'conversion', 'upsell',
  'cross-sell', 'renewal', 'expansion', 'contraction', 'support',
  'success', 'feedback', 'nps', 'csat', 'health-score', 'risk',
  'escalation', 'ticket', 'bug', 'feature-request', 'roadmap',
  'sprint', 'backlog', 'release', 'hotfix', 'rollback', 'deploy',
  'staging', 'production', 'monitoring', 'alert', 'incident',
  'postmortem', 'sla', 'uptime', 'latency', 'throughput', 'capacity',
  'cost', 'budget', 'forecast', 'pipeline', 'quota', 'territory',
  'account', 'lead', 'opportunity', 'deal', 'contract', 'invoice',
];

function setsEqual(a: string[], b: string[]): boolean {
  const sa = new Set(a.map(s => s.toLowerCase().trim()));
  const sb = new Set(b.map(s => s.toLowerCase().trim()));
  if (sa.size !== sb.size) return false;
  const arr = Array.from(sa);
  for (let i = 0; i < arr.length; i++) {
    if (!sb.has(arr[i])) return false;
  }
  return true;
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const hasSucceeded = useRef(false);
  const [audienceTags, setAudienceTags] = useState<string[]>(['community', 'newsletter']);
  const [campaignTags, setCampaignTags] = useState<string[]>(['internal']);
  const [supportTags, setSupportTags] = useState<string[]>(['faq', 'handoff']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(campaignTags, ['campaign', 'north-star', 'seo']) &&
      setsEqual(audienceTags, ['community', 'newsletter']) &&
      setsEqual(supportTags, ['faq', 'handoff'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [campaignTags, audienceTags, supportTags, onSuccess]);

  const options = allSuggestions.map(s => ({ label: s, value: s }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ width: 200, background: '#001529', padding: 16 }}>
        <Text style={{ color: '#fff' }}>Sidebar</Text>
      </div>
      <div style={{ flex: 1, padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Space>
            <Tag color="blue">Q4</Tag>
            <Tag color="green">Active</Tag>
            <Tag>Marketing</Tag>
            <Tag color="orange">Priority</Tag>
          </Space>
        </div>
        <Title level={4}>Marketing Dashboard</Title>
        <div style={{ display: 'flex', gap: 12 }}>
          <Card size="small" title="Audience tags" style={{ flex: 1 }}>
            <Select
              mode="tags"
              size="small"
              style={{ width: '100%' }}
              placeholder="Select audience tags"
              value={audienceTags}
              onChange={setAudienceTags}
              options={options}
            />
          </Card>
          <Card size="small" title="Campaign tags" style={{ flex: 1 }}>
            <Select
              mode="tags"
              size="small"
              style={{ width: '100%' }}
              placeholder="Select campaign tags"
              value={campaignTags}
              onChange={setCampaignTags}
              options={options}
            />
          </Card>
          <Card size="small" title="Support tags" style={{ flex: 1 }}>
            <Select
              mode="tags"
              size="small"
              style={{ width: '100%' }}
              placeholder="Select support tags"
              value={supportTags}
              onChange={setSupportTags}
              options={options}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
