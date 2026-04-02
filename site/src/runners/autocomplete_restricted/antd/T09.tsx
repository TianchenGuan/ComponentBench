'use client';

/**
 * autocomplete_restricted-antd-T09: Match plan tier from a badge (dark theme)
 *
 * setup_description:
 * The UI is a dark-themed "Billing" card (dark background with light text) centered on the page.
 *
 * The card shows:
 * - A read-only **membership badge** on the right with a prominent pill that reads **GOLD** (this is the reference).
 * - Two Ant Design Select components (same canonical type) on the left:
 *   1) **Notification tier** (Select) — already set to "Silver"
 *   2) **Subscription plan** (Select) — currently empty (placeholder "Choose plan")  ← target
 *
 * Component details:
 * - Theme: **dark**; spacing: comfortable; size: default.
 * - Each Select is options-only (restricted).
 * - Options include similar tier labels: Bronze, Silver, Gold, Platinum.
 * - Selecting an option immediately updates the field; no Save button.
 *
 * The agent must (a) read the badge to infer the target tier and (b) apply it to the correct Select instance (Subscription plan).
 *
 * Success: The "Subscription plan" Select has selected value "Gold" (matching the reference badge).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Typography, Space, ConfigProvider, theme, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const tiers = [
  { label: 'Bronze', value: 'Bronze' },
  { label: 'Silver', value: 'Silver' },
  { label: 'Gold', value: 'Gold' },
  { label: 'Platinum', value: 'Platinum' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [notificationTier, setNotificationTier] = useState<string>('Silver');
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && subscriptionPlan === 'Gold') {
      successFired.current = true;
      onSuccess();
    }
  }, [subscriptionPlan, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card
        title="Billing"
        style={{ width: 500, background: '#1f1f1f' }}
        styles={{ header: { color: '#fff' }, body: { background: '#1f1f1f' } }}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left side: Selects */}
          <Space direction="vertical" style={{ flex: 1 }} size="middle">
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Notification tier</Text>
              <Select
                data-testid="notification-tier-select"
                style={{ width: '100%' }}
                value={notificationTier}
                onChange={(newValue) => setNotificationTier(newValue)}
                options={tiers}
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8, color: '#fff' }}>Subscription plan</Text>
              <Select
                data-testid="subscription-plan-select"
                style={{ width: '100%' }}
                placeholder="Choose plan"
                value={subscriptionPlan}
                onChange={(newValue) => setSubscriptionPlan(newValue)}
                options={tiers}
              />
            </div>
          </Space>

          {/* Right side: Membership badge */}
          <div
            style={{
              background: '#2a2a2a',
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 120,
            }}
          >
            <Text style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Membership</Text>
            <Tag
              data-testid="membership-badge.plan-pill"
              color="gold"
              style={{ fontSize: 16, padding: '4px 12px', fontWeight: 'bold' }}
            >
              GOLD
            </Tag>
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
}
