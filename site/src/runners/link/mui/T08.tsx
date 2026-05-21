'use client';

/**
 * link-mui-T08: Navigate to Security from sidebar in a dark dashboard (MUI)
 * 
 * setup_description:
 * A dark-themed dashboard layout fills the screen. A left sidebar titled "Navigation"
 * contains three Material UI Link items: "Profile", "Billing", and "Security". The main
 * content card includes a paragraph with an inline link also labeled "Security"
 * (help-article link), and the footer contains a small "Security" link as well.
 * 
 * Initial route: "/settings/profile" with the sidebar Profile link active
 * (aria-current="page"). The task requires using the sidebar instance of the Security
 * link (data-testid="sidebar-security").
 * 
 * success_trigger:
 * - The sidebar Security link (data-testid="sidebar-security") was activated.
 * - The current route pathname equals "/settings/security".
 * - The sidebar Security link has aria-current="page".
 */

import React, { useState } from 'react';
import { Link, Typography, Box, Card, CardHeader, CardContent, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

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
    if (testId === 'sidebar-security') {
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

  const handleFooterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Footer link is a distractor - does not trigger success
    if (!activated) {
      setRoute('/settings/security');
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        width: 700, 
        minHeight: 400,
        bgcolor: '#141414',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <Box 
        sx={{ 
          width: 180, 
          bgcolor: '#1e1e1e', 
          p: 2,
          borderRight: '1px solid #303030',
        }}
      >
        <Typography 
          variant="overline" 
          sx={{ color: '#888', display: 'block', mb: 2 }}
        >
          Navigation
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {navItems.map((item) => {
            const isActive = route === item.key;
            const testId = `sidebar-${item.label.toLowerCase()}`;
            return (
              <Link
                key={item.key}
                href={item.key}
                onClick={handleNavClick(item.key, testId)}
                data-testid={testId}
                aria-current={isActive ? 'page' : undefined}
                sx={{ 
                  color: isActive ? 'primary.main' : '#fff',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Card sx={{ bgcolor: '#262626', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardHeader 
            title="Getting started" 
            sx={{ color: '#fff', '& .MuiCardHeader-title': { color: '#fff' } }}
          />
          <CardContent sx={{ flex: 1 }}>
            <Typography sx={{ color: '#ddd', mb: 2 }}>
              Welcome to your account dashboard. Here you can manage your profile, 
              billing information, and security settings.
            </Typography>
            <Typography sx={{ color: '#ddd' }}>
              For enhanced protection, visit the{' '}
              <Link 
                href="#"
                onClick={handleInlineClick}
                data-testid="article-security"
                sx={{ cursor: 'pointer' }}
              >
                Security
              </Link>
              {' '}page to enable two-factor authentication and review your login history.
            </Typography>
          </CardContent>
          <Divider sx={{ bgcolor: '#404040' }} />
          <Box sx={{ p: 2 }}>
            <Link 
              href="#"
              onClick={handleFooterClick}
              data-testid="footer-security"
              sx={{ cursor: 'pointer', fontSize: '0.75rem' }}
            >
              Security
            </Link>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
