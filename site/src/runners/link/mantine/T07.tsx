'use client';

/**
 * link-mantine-T07: Navigate to Security via settings nav in dark theme (Mantine)
 * 
 * setup_description:
 * A dark-themed settings_panel fills the center of the screen. On the left side of the
 * panel, a vertical list titled "Settings navigation" contains three Mantine Anchor links:
 * "Profile", "Billing", and "Security". On the right, the main content area shows a small
 * help paragraph that includes an inline Anchor also labeled "Security" (distractor instance).
 * 
 * Initial route: "/settings/profile" with the Profile nav link marked active
 * (aria-current="page"). The task requires activating the "Security" link from the
 * Settings navigation list (data-testid="settings-nav-security"), not the inline help link.
 * 
 * success_trigger:
 * - The Settings navigation Security link (data-testid="settings-nav-security") was activated.
 * - The current route pathname equals "/settings/security".
 * - The nav Security link has aria-current="page".
 */

import React, { useState } from 'react';
import { Text, Anchor, Box, Card } from '@mantine/core';
import type { TaskComponentProps } from '../types';

type Route = '/settings/profile' | '/settings/billing' | '/settings/security';

const navItems: { key: Route; label: string }[] = [
  { key: '/settings/profile', label: 'Profile' },
  { key: '/settings/billing', label: 'Billing' },
  { key: '/settings/security', label: 'Security' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState<Route>('/settings/profile');
  const [activated, setActivated] = useState(false);

  const handleNavClick = (targetRoute: Route, testId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(targetRoute);
    if (testId === 'settings-nav-security') {
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
    <Box 
      style={{ 
        display: 'flex', 
        width: 650, 
        minHeight: 350,
        background: darkBg,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box 
        style={{ 
          width: 180, 
          background: sidebarBg, 
          padding: 16,
          borderRight: `1px solid ${borderColor}`,
        }}
      >
        <Text 
          size="xs" 
          tt="uppercase" 
          c={mutedText} 
          fw={500}
          mb="md"
        >
          Settings navigation
        </Text>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = route === item.key;
            const testId = `settings-nav-${item.label.toLowerCase()}`;
            return (
              <Anchor
                key={item.key}
                href={item.key}
                onClick={handleNavClick(item.key, testId)}
                data-testid={testId}
                aria-current={isActive ? 'page' : undefined}
                c={isActive ? 'blue' : textColor}
                fw={isActive ? 600 : 400}
              >
                {item.label}
              </Anchor>
            );
          })}
        </Box>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1, padding: 24 }}>
        <Card 
          style={{ 
            background: cardBg, 
            border: `1px solid ${borderColor}`,
          }}
          padding="lg"
        >
          <Text fw={500} size="lg" c={textColor} mb="md">
            Getting started
          </Text>
          <Text c={textColor} mb="md">
            Welcome to your settings panel. Here you can manage your profile, 
            billing information, and security settings.
          </Text>
          <Text c={textColor}>
            For enhanced protection, visit the{' '}
            <Anchor 
              href="#"
              onClick={handleInlineClick}
              data-testid="help-security"
            >
              Security
            </Anchor>
            {' '}page to enable two-factor authentication.
          </Text>
        </Card>
      </Box>
    </Box>
  );
}
