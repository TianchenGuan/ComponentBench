'use client';

/**
 * cascader-antd-T07: Match the Target breadcrumb for Selected service
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Selected service".
 * Guidance element: a non-interactive "Target path" preview box above the cascader showing a styled breadcrumb
 * with the desired path (e.g., Services › Consulting › Security Review).
 * Options tree: Service line → Offering → Package:
 *   - Services → Consulting → Security Review (target)
 *   - Services → Consulting → Architecture Review
 *   - Services → Support → Priority Support
 * Initial state: Selected service is blank.
 * Distractors: an extra note that explains the breadcrumb is the target reference.
 *
 * Success: path_labels equal [Services, Consulting, Security Review], path_values equal ['services','consulting','security-review']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'services',
    label: 'Services',
    children: [
      {
        value: 'consulting',
        label: 'Consulting',
        children: [
          { value: 'security-review', label: 'Security Review' },
          { value: 'architecture-review', label: 'Architecture Review' },
        ],
      },
      {
        value: 'support',
        label: 'Support',
        children: [
          { value: 'priority-support', label: 'Priority Support' },
        ],
      },
    ],
  },
];

const TARGET_PATH = ['services', 'consulting', 'security-review'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Service Selection" style={{ width: 450 }}>
      <div
        data-testid="target-path-breadcrumb"
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 6,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Target path:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Services</span>
          <span style={{ color: '#999' }}>›</span>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Consulting</span>
          <span style={{ color: '#999' }}>›</span>
          <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>Security Review</span>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Selected service
        </label>
        <Cascader
          data-testid="selected-service-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[])}
          placeholder="Please select"
        />
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          The breadcrumb above shows the target path you need to match.
        </div>
      </div>
    </Card>
  );
}
