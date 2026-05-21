'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TagsInput, Text, Title, Card, Badge, Group, Box } from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const allSuggestions = [
  'community', 'newsletter', 'utm', 'launch', 'partner', 'webinar',
  'product', 'field', 'docs', 'internal', 'draft', 'archive',
  'release', 'qa', 'segment', 'funnel', 'retention', 'churn',
  'activation', 'onboarding', 'trial', 'conversion', 'upsell',
  'referral', 'organic', 'paid', 'social', 'email', 'outreach',
  'content', 'brand', 'growth', 'marketing', 'event', 'press',
  'podcast', 'video', 'design', 'research', 'analytics', 'data',
  'insights', 'cohort', 'health-score', 'risk', 'escalation',
  'budget', 'forecast', 'pipeline', 'territory', 'account',
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
  const [audienceTags, setAudienceTags] = useState<string[]>(['community']);
  const [campaignTags, setCampaignTags] = useState<string[]>(['draft']);
  const [analyticsTags, setAnalyticsTags] = useState<string[]>(['utm']);

  useEffect(() => {
    if (
      !hasSucceeded.current &&
      setsEqual(campaignTags, ['launch', 'partner', 'webinar']) &&
      setsEqual(audienceTags, ['community']) &&
      setsEqual(analyticsTags, ['utm'])
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [campaignTags, audienceTags, analyticsTags, onSuccess]);

  return (
    <Box p="md" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <Group mb="sm">
        <Badge>Q4</Badge>
        <Badge color="green">Active</Badge>
        <Badge color="orange">Priority</Badge>
      </Group>
      <Title order={4} mb="md">Campaign Setup</Title>

      <Group mb="md">
        <Card shadow="xs" p="sm" style={{ flex: 1 }}>
          <Text size="xs" fw={500}>Revenue</Text>
          <Text size="lg" fw={700}>$124k</Text>
        </Card>
        <Card shadow="xs" p="sm" style={{ flex: 1 }}>
          <Text size="xs" fw={500}>Leads</Text>
          <Text size="lg" fw={700}>3,204</Text>
        </Card>
      </Group>

      <div style={{ display: 'flex', gap: 12 }}>
        <Card shadow="xs" p="sm" style={{ flex: 1 }}>
          <TagsInput
            label="Audience tags"
            size="xs"
            data={allSuggestions}
            value={audienceTags}
            onChange={setAudienceTags}
          />
        </Card>
        <Card shadow="xs" p="sm" style={{ flex: 1 }}>
          <TagsInput
            label="Campaign tags"
            size="xs"
            data={allSuggestions}
            value={campaignTags}
            onChange={setCampaignTags}
          />
        </Card>
        <Card shadow="xs" p="sm" style={{ flex: 1 }}>
          <TagsInput
            label="Analytics tags"
            size="xs"
            data={allSuggestions}
            value={analyticsTags}
            onChange={setAnalyticsTags}
          />
        </Card>
      </div>
    </Box>
  );
}
