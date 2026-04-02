'use client';

/**
 * link-antd-T08: Navigate to Security via the sidebar link (dark dashboard)
 * 
 * setup_description:
 * A dashboard layout in dark theme fills the viewport. On the left, a vertical sidebar
 * labeled "Account navigation" contains three Ant Design Typography.Link items: "Profile",
 * "Billing", and "Security". The main content area shows a card titled "Getting started"
 * with a short help article that also includes an inline Typography.Link labeled "Security"
 * inside a sentence (a distractor link).
 * 
 * Initial route: "/settings/profile" with the sidebar "Profile" link marked active
 * (aria-current="page"). Goal requires clicking the sidebar instance of the "Security"
 * link—not the inline article link.
 * 
 * success_trigger:
 * - The sidebar "Security" link (data-testid="nav-security") was activated.
 * - The current route pathname equals "/settings/security".
 * - The sidebar "Security" link has aria-current="page".
 */

import React, { useState } from 'react';
import { Typography, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const { Link, Title, Paragraph } = Typography;

type Route = '/settings/profile' | '/settings/billing' | '/settings/security';

const navItems: { key: Route; label: string }[] = [
  { key: '/settings/profile', label: 'Profile' },
  { key: '/settings/billing', label: 'Billing' },
  { key: '/settings/security', label: 'Security' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState<Route>('/settings/profile');
  const [activated, setActivated] = useState(false);

  const handleNavClick = (targetRoute: Route, testId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(targetRoute);
    if (testId === 'nav-security') {
      setActivated(true);
      onSuccess();
    }
  };

  const handleInlineClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Inline link is a distractor - does not trigger success
    if (!activated) {
      setRoute('/settings/security');
    }
  };

  // Dark theme colors
  const darkBg = '#141414';
  const sidebarBg = '#1f1f1f';
  const cardBg = '#262626';
  const borderColor = '#303030';
  const textColor = '#fff';
  const mutedText = '#999';

  return (
    <div style={{ 
      display: 'flex', 
      width: 700, 
      minHeight: 400,
      background: darkBg,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {/* Sidebar */}
      <div style={{ 
        width: 200, 
        background: sidebarBg, 
        padding: 16,
        borderRight: `1px solid ${borderColor}`,
      }}>
        <div style={{ 
          color: mutedText, 
          fontSize: 12, 
          marginBottom: 16, 
          textTransform: 'uppercase',
          fontWeight: 500,
        }}>
          Account navigation
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = route === item.key;
            const testId = `nav-${item.label.toLowerCase()}`;
            return (
              <Link
                key={item.key}
                onClick={handleNavClick(item.key, testId)}
                data-testid={testId}
                aria-current={isActive ? 'page' : undefined}
                style={{ 
                  color: isActive ? '#1890ff' : textColor,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 24 }}>
        <Card 
          style={{ 
            background: cardBg, 
            borderColor: borderColor,
          }}
          styles={{ 
            header: { color: textColor, borderColor: borderColor },
            body: { color: textColor },
          }}
          title="Getting started"
        >
          <Paragraph style={{ color: textColor }}>
            Welcome to your account dashboard. Here you can manage your profile, 
            billing information, and security settings.
          </Paragraph>
          <Paragraph style={{ color: textColor }}>
            For enhanced protection, visit the{' '}
            <Link 
              onClick={handleInlineClick}
              data-testid="article-security"
              style={{ cursor: 'pointer' }}
            >
              Security
            </Link>
            {' '}page to enable two-factor authentication and review your login history.
          </Paragraph>
        </Card>
      </div>
    </div>
  );
}
