'use client';

/**
 * collapsible_disclosure-antd-T01: FAQ: expand Shipping details
 * 
 * You are on a simple FAQ page presented as a single centered card.
 * 
 * - Layout: isolated_card, centered in the viewport.
 * - Component: one Ant Design Collapse with 4 panels stacked vertically.
 * - Panel headers (top to bottom): "Shipping details", "Returns", "Warranty", "Contact".
 * - Initial state: all panels are collapsed (no content visible).
 * - Affordances: each header row is clickable and shows the standard AntD expand/collapse chevron.
 * - No other interactive elements are required for success; expanding the correct panel is sufficient.
 * 
 * Success: expanded_panel equals "Shipping details"
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>([]);

  useEffect(() => {
    const keys = Array.isArray(activeKey) ? activeKey : [activeKey];
    if (keys.includes('shipping_details')) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="FAQ" style={{ width: 500 }}>
      <Collapse
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="collapse-root"
        items={[
          {
            key: 'shipping_details',
            label: 'Shipping details',
            children: (
              <p>
                We offer free standard shipping on orders over $50. Express shipping is available 
                for an additional fee. Most orders are processed within 1-2 business days.
              </p>
            ),
            extra: <span data-testid="collapse-header-shipping-details" />,
          },
          {
            key: 'returns',
            label: 'Returns',
            children: (
              <p>
                Returns are accepted within 30 days of purchase. Items must be in original 
                condition with tags attached. Contact our support team to initiate a return.
              </p>
            ),
          },
          {
            key: 'warranty',
            label: 'Warranty',
            children: (
              <p>
                All products come with a 1-year manufacturer warranty covering defects in 
                materials and workmanship.
              </p>
            ),
          },
          {
            key: 'contact',
            label: 'Contact',
            children: (
              <p>
                Reach out to us via email at support@example.com or call 1-800-EXAMPLE 
                during business hours.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
