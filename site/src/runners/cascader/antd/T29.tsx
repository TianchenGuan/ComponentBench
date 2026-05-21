'use client';

/**
 * cascader-antd-T29: Drawer flow: set Default assignee group to Customer Success / Enterprise / Onboarding
 *
 * Layout: drawer flow.
 * Clutter: low — a settings page with a single "Assignment settings" button that opens a right-side drawer.
 * Entry point: click the button labeled "Assignment settings" to open a drawer.
 * Inside the drawer:
 *   - Header with a close (×) button
 *   - A few toggles (e.g., "Auto-assign new tickets")
 *   - Target AntD Cascader labeled "Default assignee group"
 * Cascader options: Department → Segment → Team:
 *   - Customer Success → SMB → Renewals
 *   - Customer Success → Enterprise → Onboarding (target), Escalations
 *   - Support → Tier 1 → General
 *   - Support → Tier 2 → Identity
 * Initial state: Default assignee group is set to "Support / Tier 1 / General".
 * Interaction nuance: the drawer may constrain available space, and the cascader dropdown must render on top.
 *
 * Success: path_labels equal [Customer Success, Enterprise, Onboarding], path_values equal ['cs','ent','onboarding']
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Drawer, Switch, Cascader } from 'antd';
import type { TaskComponentProps } from '../types';
import { pathEquals } from '../types';

const options = [
  {
    value: 'cs',
    label: 'Customer Success',
    children: [
      {
        value: 'smb',
        label: 'SMB',
        children: [
          { value: 'renewals', label: 'Renewals' },
        ],
      },
      {
        value: 'ent',
        label: 'Enterprise',
        children: [
          { value: 'onboarding', label: 'Onboarding' },
          { value: 'escalations', label: 'Escalations' },
        ],
      },
    ],
  },
  {
    value: 'support',
    label: 'Support',
    children: [
      {
        value: 't1',
        label: 'Tier 1',
        children: [
          { value: 'general', label: 'General' },
        ],
      },
      {
        value: 't2',
        label: 'Tier 2',
        children: [
          { value: 'identity', label: 'Identity' },
        ],
      },
    ],
  },
];

const INITIAL_VALUE = ['support', 't1', 'general'];
const TARGET_PATH = ['cs', 'ent', 'onboarding'];

export default function T29({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState<string[]>(INITIAL_VALUE);
  const [autoAssign] = useState(true);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && pathEquals(value, TARGET_PATH)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Ticket Settings" style={{ width: 400 }}>
      <p style={{ marginBottom: 16, color: '#666' }}>
        Configure how tickets are assigned to team members.
      </p>
      <Button type="primary" onClick={() => setDrawerOpen(true)}>
        Assignment settings
      </Button>

      <Drawer
        title="Assignment Settings"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
        data-testid="assignment-settings-drawer"
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500 }}>Auto-assign new tickets</div>
              <div style={{ fontSize: 12, color: '#888' }}>Automatically assign incoming tickets</div>
            </div>
            <Switch checked={autoAssign} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Default assignee group
          </label>
          <Cascader
            data-testid="default-assignee-group-cascader"
            style={{ width: '100%' }}
            options={options}
            value={value}
            onChange={(val) => setValue(val as string[])}
            placeholder="Select group"
          />
        </div>
      </Drawer>
    </Card>
  );
}
