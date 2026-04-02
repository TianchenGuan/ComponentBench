'use client';

/**
 * accordion-antd-T01: FAQ: open Shipping & Returns (single-open)
 * 
 * Scene is an isolated card centered in the viewport. A single Ant Design Collapse 
 * component is configured with accordion=true so only one panel can be open at a time.
 * The card title is "FAQ". It contains 3 panels with headers: "Shipping & Returns", 
 * "Warranty", and "Technical specs". All panels start collapsed.
 * 
 * Success: expanded_item_ids equals exactly: [shipping_returns]
 */

import React, { useState, useEffect } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string | string[]>([]);

  useEffect(() => {
    if (activeKey === 'shipping_returns' || (Array.isArray(activeKey) && activeKey.includes('shipping_returns') && activeKey.length === 1)) {
      onSuccess();
    }
  }, [activeKey, onSuccess]);

  return (
    <Card title="FAQ" style={{ width: 500 }}>
      <Collapse
        accordion
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        data-testid="accordion-root"
        items={[
          {
            key: 'shipping_returns',
            label: 'Shipping & Returns',
            children: (
              <p>
                We offer free shipping on orders over $50. Returns are accepted within 30 days 
                of purchase with original receipt.
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
            key: 'technical_specs',
            label: 'Technical specs',
            children: (
              <p>
                Detailed technical specifications can be found on each product page under 
                the specifications tab.
              </p>
            ),
          },
        ]}
      />
    </Card>
  );
}
