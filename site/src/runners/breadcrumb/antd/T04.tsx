'use client';

/**
 * breadcrumb-antd-T04: Expand collapsed breadcrumb (ellipsis)
 * 
 * Centered isolated card titled "Deep Page".
 * The ellipsis (...) represents collapsed/hidden items.
 * Clicking it opens a dropdown showing the hidden items.
 */

import React, { useState } from 'react';
import { Breadcrumb, Card, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (expanded) return;
    setExpanded(true);
    onSuccess();
  };

  const hiddenItems: MenuProps['items'] = [
    { key: 'products', label: 'Products' },
    { key: 'electronics', label: 'Electronics' },
    { key: 'phones', label: 'Phones' },
  ];

  return (
    <Card title="Deep Page" style={{ width: 450 }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            title: <span data-testid="antd-breadcrumb-home">Home</span>,
          },
          {
            title: (
              <Dropdown
                menu={{ items: hiddenItems }}
                trigger={['click']}
                open={expanded}
                onOpenChange={(open) => {
                  if (open) handleExpand();
                }}
                overlayStyle={{ minWidth: 120 }}
              >
                <a
                  onClick={(e) => e.preventDefault()}
                  data-testid="antd-breadcrumb-ellipsis"
                  data-overlay-id="antd-breadcrumb-collapsed-dropdown"
                  style={{ cursor: 'pointer' }}
                >
                  <EllipsisOutlined />
                </a>
              </Dropdown>
            ),
          },
          {
            title: <span data-testid="antd-breadcrumb-settings">Settings</span>,
          },
          {
            title: <span data-testid="antd-breadcrumb-profile">Profile</span>,
          },
        ]}
      />
      {expanded ? (
        <p style={{ color: '#52c41a', fontWeight: 500 }}>
          Hidden items revealed: Products, Electronics, Phones
        </p>
      ) : (
        <p>
          Click the ellipsis (...) to see the hidden breadcrumb items.
        </p>
      )}
    </Card>
  );
}
