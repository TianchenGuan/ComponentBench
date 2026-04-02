'use client';

/**
 * accordion-antd-T09: Match reference badge to open the correct plan section
 * 
 * Placement is top_right: the content card is anchored toward the upper-right quadrant.
 * A single card titled "Plan details" contains (1) a small "Reference badge" display row 
 * and (2) the target Ant Design Collapse accordion beneath it. The reference badge is a 
 * small square chip with a unique color + icon (e.g., a purple square with a star).
 * The accordion has 8 panels, each header includes a similar small square badge followed 
 * by a short plan name. Panel names are intentionally generic (e.g., "Plan A", "Plan B", …).
 * Initial state: all panels collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [plan_target]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card, Typography } from 'antd';
import { StarOutlined, HeartOutlined, ThunderboltOutlined, TrophyOutlined, RocketOutlined, CrownOutlined, GiftOutlined, FireOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Badge configurations for the 8 plans
const badges = [
  { key: 'plan_a', color: '#ff4d4f', icon: HeartOutlined, label: 'Plan A' },
  { key: 'plan_b', color: '#1890ff', icon: ThunderboltOutlined, label: 'Plan B' },
  { key: 'plan_c', color: '#52c41a', icon: TrophyOutlined, label: 'Plan C' },
  { key: 'plan_target', color: '#722ed1', icon: StarOutlined, label: 'Plan D' }, // This is the target
  { key: 'plan_e', color: '#fa8c16', icon: RocketOutlined, label: 'Plan E' },
  { key: 'plan_f', color: '#eb2f96', icon: CrownOutlined, label: 'Plan F' },
  { key: 'plan_g', color: '#13c2c2', icon: GiftOutlined, label: 'Plan G' },
  { key: 'plan_h', color: '#faad14', icon: FireOutlined, label: 'Plan H' },
];

// The target badge (Plan D with purple star)
const targetBadge = badges[3];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>([]);

  useEffect(() => {
    if (activeKey === 'plan_target' || (Array.isArray(activeKey) && activeKey.includes('plan_target') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  const BadgeIcon = ({ color, Icon }: { color: string; Icon: React.ComponentType<{ style?: React.CSSProperties }> }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        backgroundColor: color,
        borderRadius: 4,
        marginRight: 8,
      }}
    >
      <Icon style={{ color: '#fff', fontSize: 14 }} />
    </span>
  );

  return (
    <Card title="Plan details" style={{ width: 400 }}>
      {/* Reference badge display */}
      <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Reference badge:</Text>
        <BadgeIcon color={targetBadge.color} Icon={targetBadge.icon} />
      </div>

      {/* Accordion with 8 plans */}
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="accordion-root"
        items={badges.map((badge) => ({
          key: badge.key,
          label: (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <BadgeIcon color={badge.color} Icon={badge.icon} />
              {badge.label}
            </span>
          ),
          children: <p>Details for {badge.label}. Includes features and pricing information.</p>,
        }))}
      />
    </Card>
  );
}
