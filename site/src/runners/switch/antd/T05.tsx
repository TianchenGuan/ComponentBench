'use client';

/**
 * switch-antd-T05: Choose the correct toggle: Marketing emails
 *
 * Layout: isolated_card centered in the viewport titled "Email preferences".
 * The card contains two Ant Design Switch rows stacked vertically:
 *   1) "Marketing emails" (target)
 *   2) "Product updates" (distractor)
 * Each row has a short description line under the label, and each switch is aligned to the right.
 * Initial state: "Marketing emails" is ON; "Product updates" is OFF.
 * Feedback: toggling either switch updates immediately; there is no Save/Apply button.
 */

import React, { useState } from 'react';
import { Card, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [marketingChecked, setMarketingChecked] = useState(true);
  const [productChecked, setProductChecked] = useState(false);

  const handleMarketingChange = (newChecked: boolean) => {
    setMarketingChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  const handleProductChange = (newChecked: boolean) => {
    setProductChecked(newChecked);
  };

  return (
    <Card title="Email preferences" style={{ width: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div>Marketing emails</div>
          <div style={{ fontSize: 12, color: '#999' }}>Promotional offers and news</div>
        </div>
        <Switch
          checked={marketingChecked}
          onChange={handleMarketingChange}
          data-testid="marketing-emails-switch"
          data-instance="marketing-emails"
          aria-checked={marketingChecked}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div>Product updates</div>
          <div style={{ fontSize: 12, color: '#999' }}>New features and improvements</div>
        </div>
        <Switch
          checked={productChecked}
          onChange={handleProductChange}
          data-testid="product-updates-switch"
          data-instance="product-updates"
          aria-checked={productChecked}
        />
      </div>
    </Card>
  );
}
