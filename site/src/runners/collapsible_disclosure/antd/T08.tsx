'use client';

/**
 * collapsible_disclosure-antd-T08: Disambiguation: open Audit log in Admin settings (top-right)
 * 
 * The settings dashboard is anchored toward the top-right of the viewport.
 * 
 * - Layout: isolated_card (a single container region), placement: top_right.
 * - Instances: 3 separate AntD Collapse accordions stacked with clear titles:
 *   - "User settings"
 *   - "Team settings"
 *   - "Admin settings"  ← TARGET INSTANCE
 * - Each instance is configured as an accordion (only one panel open per instance).
 * - Panel titles are similar across instances (e.g., "Access", "Roles", "Logs"), but only Admin settings contains a panel titled exactly "Audit log".
 * - Initial state:
 *   - User settings: "Profile" expanded
 *   - Team settings: all collapsed
 *   - Admin settings: all collapsed
 * - No other page elements are interactive for success.
 * 
 * Success: In "Admin settings", expanded_panel equals "Audit log"
 */

import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Card } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [userActiveKey, setUserActiveKey] = useState<string | string[]>('profile');
  const [teamActiveKey, setTeamActiveKey] = useState<string | string[]>([]);
  const [adminActiveKey, setAdminActiveKey] = useState<string | string[]>([]);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    // Success when Admin settings has "Audit log" expanded
    // and other instances remain in their initial states
    const adminKey = Array.isArray(adminActiveKey) ? adminActiveKey[0] : adminActiveKey;
    const userKey = Array.isArray(userActiveKey) ? userActiveKey[0] : userActiveKey;
    const teamKeys = Array.isArray(teamActiveKey) ? teamActiveKey : [teamActiveKey].filter(Boolean);
    
    if (
      adminKey === 'audit_log' && 
      userKey === 'profile' && 
      teamKeys.length === 0 &&
      !hasSucceeded.current
    ) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [adminActiveKey, userActiveKey, teamActiveKey, onSuccess]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 450 }}>
      <Card title="User settings" size="small" data-testid="accordion-user-settings">
        <Collapse
          accordion
          activeKey={userActiveKey}
          onChange={(key) => setUserActiveKey(key)}
          size="small"
          items={[
            {
              key: 'profile',
              label: 'Profile',
              children: <p>Your personal profile settings.</p>,
            },
            {
              key: 'preferences',
              label: 'Preferences',
              children: <p>User preferences and display options.</p>,
            },
            {
              key: 'access',
              label: 'Access',
              children: <p>Your access permissions and roles.</p>,
            },
          ]}
        />
      </Card>

      <Card title="Team settings" size="small" data-testid="accordion-team-settings">
        <Collapse
          accordion
          activeKey={teamActiveKey}
          onChange={(key) => setTeamActiveKey(key)}
          size="small"
          items={[
            {
              key: 'members',
              label: 'Members',
              children: <p>Team member management.</p>,
            },
            {
              key: 'roles',
              label: 'Roles',
              children: <p>Team role definitions.</p>,
            },
            {
              key: 'logs',
              label: 'Logs',
              children: <p>Team activity logs.</p>,
            },
          ]}
        />
      </Card>

      <Card title="Admin settings" size="small" data-testid="accordion-admin-settings">
        <Collapse
          accordion
          activeKey={adminActiveKey}
          onChange={(key) => setAdminActiveKey(key)}
          size="small"
          items={[
            {
              key: 'system',
              label: 'System',
              children: <p>System-wide configuration.</p>,
            },
            {
              key: 'audit_log',
              label: 'Audit log',
              children: <p>View and export audit logs for compliance.</p>,
            },
            {
              key: 'security',
              label: 'Security',
              children: <p>Advanced security settings.</p>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
