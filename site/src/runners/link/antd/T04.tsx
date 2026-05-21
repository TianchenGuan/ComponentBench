'use client';

/**
 * link-antd-T04: Select the Invoices tab link
 * 
 * setup_description:
 * A centered isolated card titled "Account Tabs" contains a horizontal row of three
 * Ant Design Typography.Link elements acting as tab links: "Overview", "Usage", and
 * "Invoices". Only one is active at a time.
 * 
 * Initial state: "Overview" is active (aria-current="page" on the Overview link), and
 * the content panel below shows a heading "Overview". The three links are visually similar
 * (same font size), separated by small spacing, with the active one styled slightly
 * bolder/underlined. No additional links exist beyond these three (instances=3).
 * 
 * success_trigger:
 * - The "Invoices" tab link (data-testid="tab-invoices") was activated.
 * - The "Invoices" link has aria-current="page".
 * - The content panel heading reads "Invoices" (data-testid="panel-heading").
 */

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Title } = Typography;

type Tab = 'overview' | 'usage' | 'invoices';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleTabClick = (tab: Tab) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab(tab);
    if (tab === 'invoices') {
      onSuccess();
    }
  };

  const tabStyle = (tab: Tab) => ({
    fontWeight: activeTab === tab ? 600 : 400,
    textDecoration: activeTab === tab ? 'underline' : 'none',
    cursor: 'pointer',
  });

  const panelContent: Record<Tab, string> = {
    overview: 'Your account overview and summary statistics.',
    usage: 'Monthly usage breakdown and analytics.',
    invoices: 'View and download your invoices.',
  };

  return (
    <Card title="Account Tabs" style={{ width: 450 }}>
      <Space size="middle" style={{ marginBottom: 24 }}>
        <Link
          onClick={handleTabClick('overview')}
          data-testid="tab-overview"
          aria-current={activeTab === 'overview' ? 'page' : undefined}
          style={tabStyle('overview')}
        >
          Overview
        </Link>
        <span style={{ color: '#d9d9d9' }}>|</span>
        <Link
          onClick={handleTabClick('usage')}
          data-testid="tab-usage"
          aria-current={activeTab === 'usage' ? 'page' : undefined}
          style={tabStyle('usage')}
        >
          Usage
        </Link>
        <span style={{ color: '#d9d9d9' }}>|</span>
        <Link
          onClick={handleTabClick('invoices')}
          data-testid="tab-invoices"
          aria-current={activeTab === 'invoices' ? 'page' : undefined}
          style={tabStyle('invoices')}
        >
          Invoices
        </Link>
      </Space>
      
      <div style={{ padding: 16, background: '#fafafa', borderRadius: 4 }}>
        <Title level={4} data-testid="panel-heading" style={{ marginTop: 0 }}>
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Title>
        <p>{panelContent[activeTab]}</p>
      </div>
    </Card>
  );
}
