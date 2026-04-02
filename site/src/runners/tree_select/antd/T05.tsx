'use client';

/**
 * tree_select-antd-T05: Select VPN policy page (deep path)
 *
 * Layout: isolated_card anchored near the top-right of the viewport (requires attention to non-center placement).
 * Target component: one AntD TreeSelect labeled "Policy page"; initial value empty.
 * Tree data (documentation hierarchy, depth=4):
 *   - Handbook
 *     - Security
 *       - Access → (VPN, SSH keys)
 *       - Data handling
 *     - IT → Devices
 *   - Templates → Onboarding
 * Configuration: search is disabled; user must expand intermediate nodes. Only leaf nodes are selectable.
 *
 * Success: The Policy page TreeSelect's committed selection is exactly the leaf with
 * canonical path [Handbook, Security, Access, VPN] with value 'kb_handbook_security_access_vpn'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'handbook',
    title: 'Handbook',
    selectable: false,
    children: [
      {
        value: 'handbook_security',
        title: 'Security',
        selectable: false,
        children: [
          {
            value: 'handbook_security_access',
            title: 'Access',
            selectable: false,
            children: [
              { value: 'kb_handbook_security_access_vpn', title: 'VPN' },
              { value: 'kb_handbook_security_access_ssh', title: 'SSH keys' },
            ],
          },
          { value: 'kb_handbook_security_datahandling', title: 'Data handling' },
        ],
      },
      {
        value: 'handbook_it',
        title: 'IT',
        selectable: false,
        children: [
          { value: 'kb_handbook_it_devices', title: 'Devices' },
        ],
      },
    ],
  },
  {
    value: 'templates',
    title: 'Templates',
    selectable: false,
    children: [
      { value: 'kb_templates_onboarding', title: 'Onboarding' },
    ],
  },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'kb_handbook_security_access_vpn') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Policy page" style={{ width: 400 }} data-testid="tree-select-card">
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="policy-page-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Policy page
        </label>
        <TreeSelect
          id="policy-page-select"
          data-testid="tree-select-policy-page"
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => setValue(val)}
          treeData={treeData}
          placeholder="Select a policy page"
          showSearch={false}
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </div>
      <Text type="secondary">Link to internal documentation.</Text>
    </Card>
  );
}
