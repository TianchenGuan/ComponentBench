'use client';

/**
 * tags_input-mantine-T08: Scroll a large suggestions dropdown in a cluttered dashboard
 *
 * The scene is a **dashboard** layout with a left sidebar, a header, and three metric cards across the top (clutter=high).
 * Under the metrics is a "Campaign setup" panel containing three Mantine TagsInput components:
 * - "Audience tags" (pre-filled)
 * - "Campaign tags" (target)
 * - "Analytics tags" (pre-filled)
 *
 * Component configuration:
 * - Each TagsInput has a large suggestions dataset (~100 options) and a constrained dropdown height (`maxDropdownHeight`), so the options list is scrollable.
 * - The required options are not all visible at once; at least one of {launch, partner, webinar} appears below the initial fold.
 * - Selecting a suggestion adds it as a pill; custom values are allowed but unnecessary.
 *
 * Initial state:
 * - Campaign tags contains one incorrect pill: "draft".
 * - The other two tag inputs contain their own pills and must not change.
 *
 * Guidance:
 * - A small inline help text in the panel lists the required tags in text, and a miniature badge preview shows them (mixed guidance).
 *
 * Success: The target Tags Input component (Campaign tags) contains exactly these tags (order does not matter): launch, partner, webinar.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Text, TagsInput, Badge, Group, SimpleGrid, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

// Large suggestions list
const tagSuggestions = [
  'acquisition', 'advertising', 'affiliate', 'analytics', 'automation',
  'awareness', 'b2b', 'b2c', 'benchmark', 'blog', 'brand', 'budget',
  'campaign', 'channel', 'community', 'content', 'conversion', 'crm',
  'customer', 'data', 'demand', 'digital', 'email', 'engagement',
  'events', 'experience', 'feedback', 'funnel', 'growth', 'inbound',
  'influencer', 'innovation', 'insights', 'internal', 'journey', 'launch',
  'leads', 'loyalty', 'market', 'messaging', 'mobile', 'monetization',
  'newsletter', 'organic', 'outbound', 'partner', 'partnership', 'performance',
  'pipeline', 'podcast', 'pr', 'promotion', 'referral', 'retention',
  'revenue', 'sales', 'segment', 'seo', 'social', 'strategy', 'targeting',
  'testing', 'tracking', 'traffic', 'trends', 'upsell', 'viral', 'webinar'
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [audienceTags, setAudienceTags] = React.useState<string[]>(['enterprise', 'mid-market']);
  const [campaignTags, setCampaignTags] = React.useState<string[]>(['draft']);
  const [analyticsTags, setAnalyticsTags] = React.useState<string[]>(['tracking', 'conversion']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = campaignTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['launch', 'partner', 'webinar'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [campaignTags, onSuccess]);

  return (
    <div style={{ width: 700 }}>
      {/* Metric cards as clutter */}
      <SimpleGrid cols={3} spacing="md" mb="md">
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text size="xs" c="dimmed">Total Leads</Text>
          <Text fw={700} size="xl">1,234</Text>
        </Card>
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text size="xs" c="dimmed">Conversion Rate</Text>
          <Text fw={700} size="xl">12.5%</Text>
        </Card>
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text size="xs" c="dimmed">Revenue</Text>
          <Text fw={700} size="xl">$45,678</Text>
        </Card>
      </SimpleGrid>

      {/* Campaign setup panel */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text fw={600} size="lg" mb="sm">Campaign setup</Text>
        
        {/* Mixed guidance */}
        <Box mb="md" p="xs" style={{ background: '#f8f9fa', borderRadius: 8 }}>
          <Text size="sm" c="dimmed" mb="xs">Required campaign tags:</Text>
          <Group gap="xs">
            <Badge size="sm" color="blue">launch</Badge>
            <Badge size="sm" color="blue">partner</Badge>
            <Badge size="sm" color="blue">webinar</Badge>
          </Group>
        </Box>

        <TagsInput
          label="Audience tags"
          placeholder="Select audience..."
          value={audienceTags}
          onChange={setAudienceTags}
          data={tagSuggestions}
          maxDropdownHeight={200}
          mb="md"
          data-testid="audience-tags-input"
        />

        <TagsInput
          label="Campaign tags"
          placeholder="Select campaign tags..."
          value={campaignTags}
          onChange={setCampaignTags}
          data={tagSuggestions}
          maxDropdownHeight={200}
          mb="md"
          data-testid="campaign-tags-input"
          aria-label="Campaign tags"
        />

        <TagsInput
          label="Analytics tags"
          placeholder="Select analytics..."
          value={analyticsTags}
          onChange={setAnalyticsTags}
          data={tagSuggestions}
          maxDropdownHeight={200}
          data-testid="analytics-tags-input"
        />
      </Card>
    </div>
  );
}
