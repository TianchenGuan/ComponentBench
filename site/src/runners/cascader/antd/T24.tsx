'use client';

/**
 * cascader-antd-T24: Multiple mode (visual): match the two Target selections chips
 *
 * Layout: isolated card centered on the page.
 * Component: one AntD Cascader labeled "Teams included" in multiple=true mode.
 * Guidance element: a "Target selections" box above the cascader shows exactly two styled chips,
 * each chip displaying a breadcrumb path (visual reference).
 * Options: Department → Team → Squad:
 *   - Engineering → Backend → Payments (one target)
 *   - Engineering → Frontend → Web Platform
 *   - Marketing → Events → Conferences (one target)
 *   - Marketing → Content → Blog
 * Initial state: no selections.
 * Distractors: other non-target squads exist under the same departments.
 * Important: the prompt does not list the paths; the agent must copy them from the on-page Target selections reference.
 *
 * Success: selected paths equal [Engineering/Backend/Payments] and [Marketing/Events/Conferences] (order-insensitive)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathSetsEqual } from '../types';

const { SHOW_CHILD } = Cascader;

const options = [
  {
    value: 'eng',
    label: 'Engineering',
    children: [
      {
        value: 'be',
        label: 'Backend',
        children: [
          { value: 'payments', label: 'Payments' },
          { value: 'data', label: 'Data' },
        ],
      },
      {
        value: 'fe',
        label: 'Frontend',
        children: [
          { value: 'web-platform', label: 'Web Platform' },
        ],
      },
    ],
  },
  {
    value: 'mkt',
    label: 'Marketing',
    children: [
      {
        value: 'events',
        label: 'Events',
        children: [
          { value: 'conferences', label: 'Conferences' },
          { value: 'webinars', label: 'Webinars' },
        ],
      },
      {
        value: 'content',
        label: 'Content',
        children: [
          { value: 'blog', label: 'Blog' },
        ],
      },
    ],
  },
];

const TARGET_PATHS = [
  ['eng', 'be', 'payments'],
  ['mkt', 'events', 'conferences'],
];

export default function T24({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[][]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathSetsEqual(value, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Team Assignment" style={{ width: 500 }}>
      <div
        data-testid="target-selections-chips"
        style={{
          marginBottom: 16,
          padding: 12,
          background: '#f5f5f5',
          borderRadius: 6,
          border: '1px solid #e8e8e8',
        }}
      >
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Target selections:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Engineering</span>
            <span style={{ color: '#999', fontSize: 12 }}>›</span>
            <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Backend</span>
            <span style={{ color: '#999', fontSize: 12 }}>›</span>
            <span style={{ background: '#e6f7ff', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Payments</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: '#fff7e6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Marketing</span>
            <span style={{ color: '#999', fontSize: 12 }}>›</span>
            <span style={{ background: '#fff7e6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Events</span>
            <span style={{ color: '#999', fontSize: 12 }}>›</span>
            <span style={{ background: '#fff7e6', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>Conferences</span>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Teams included
        </label>
        <Cascader
          data-testid="teams-included-cascader"
          style={{ width: '100%' }}
          options={options}
          value={value}
          onChange={(val) => setValue(val as string[][])}
          placeholder="Select teams"
          multiple
          showCheckedStrategy={SHOW_CHILD}
          maxTagCount="responsive"
        />
      </div>
    </Card>
  );
}
