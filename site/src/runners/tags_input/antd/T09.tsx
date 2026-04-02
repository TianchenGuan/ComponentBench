'use client';

/**
 * tags_input-antd-T09: Scroll the dropdown to find marketing tags in a dashboard
 *
 * The scene is a **dashboard** with three small cards arranged in a grid, anchored near the bottom-right of the viewport.
 * Each card contains one Ant Design Select in **tags** mode:
 * - "Product tags" (pre-filled)
 * - "Marketing tags" (target)
 * - "Support tags" (pre-filled)
 *
 * Target identification:
 * - The middle card is titled "Marketing" and the field label reads "Marketing tags".
 *
 * Component configuration:
 * - Each Select has `showSearch` enabled and a long shared option list (≈60 tags).
 * - The dropdown uses a scrollable menu; the needed options are near the bottom of the list.
 * - Selecting an option adds it as a chip; chips can wrap inside the narrow card.
 *
 * Initial state:
 * - Marketing tags starts with one incorrect chip: "internal".
 * - Product/Support fields contain other chips and should not be changed.
 *
 * Extra context (for mixed guidance):
 * - Above the grid is a static legend row showing badge examples for "campaign", "north-star", and "seo" (visual hint), but only the Marketing tags input is checked.
 *
 * Success: The target Tags Input component (Marketing tags) contains exactly these tags (order does not matter): campaign, north-star, seo.
 */

import React, { useRef, useEffect } from 'react';
import { Card, Select, Typography, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Long options list for scrollable dropdown
const tagOptions = [
  'acquisition', 'advertising', 'affiliate', 'analytics', 'automation',
  'awareness', 'b2b', 'b2c', 'benchmark', 'blog',
  'brand', 'budget', 'campaign', 'channel', 'community',
  'content', 'conversion', 'crm', 'customer', 'data',
  'demand', 'digital', 'email', 'engagement', 'events',
  'experience', 'feedback', 'funnel', 'growth', 'inbound',
  'influencer', 'innovation', 'insights', 'internal', 'journey',
  'leads', 'loyalty', 'market', 'messaging', 'mobile',
  'monetization', 'newsletter', 'north-star', 'organic', 'outbound',
  'partnership', 'performance', 'pipeline', 'podcast', 'pr',
  'promotion', 'referral', 'retention', 'revenue', 'sales',
  'segment', 'seo', 'social', 'strategy', 'targeting'
].map(t => ({ value: t, label: t }));

export default function T09({ onSuccess }: TaskComponentProps) {
  const [productTags, setProductTags] = React.useState<string[]>(['premium', 'beta']);
  const [marketingTags, setMarketingTags] = React.useState<string[]>(['internal']);
  const [supportTags, setSupportTags] = React.useState<string[]>(['priority', 'enterprise']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = marketingTags.map(t => t.toLowerCase().trim());
    const requiredTags = ['campaign', 'north-star', 'seo'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    if (isSuccess && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [marketingTags, onSuccess]);

  return (
    <div>
      {/* Visual hint legend */}
      <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 8 }}>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
          Target marketing tags:
        </Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag color="blue">campaign</Tag>
          <Tag color="blue">north-star</Tag>
          <Tag color="blue">seo</Tag>
        </div>
      </div>

      {/* Dashboard grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Card title="Product" size="small" style={{ width: 200 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Product tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={productTags}
            onChange={setProductTags}
            options={tagOptions}
            showSearch
            data-testid="product-tags-input"
          />
        </Card>

        <Card title="Marketing" size="small" style={{ width: 200 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Marketing tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={marketingTags}
            onChange={setMarketingTags}
            options={tagOptions}
            showSearch
            data-testid="marketing-tags-input"
            aria-label="Marketing tags"
          />
        </Card>

        <Card title="Support" size="small" style={{ width: 200 }}>
          <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Support tags</Text>
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={supportTags}
            onChange={setSupportTags}
            options={tagOptions}
            showSearch
            data-testid="support-tags-input"
          />
        </Card>
      </div>
    </div>
  );
}
