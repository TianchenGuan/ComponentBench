'use client';

/**
 * link-mui-T06: Match a reference chip to choose the correct API link
 * 
 * setup_description:
 * A lightweight dashboard card titled "Developer Dashboard" shows a small reference chip
 * at the top reading "API Playground" with a distinct "BETA" badge. Below is a list of
 * five Material UI Link rows, each with a left icon, a main label, and an optional badge
 * chip on the right:
 * - API Playground (badge: BETA) <- target
 * - API Playground (badge: LEGACY)
 * - API Reference (no badge)
 * - API Status (no badge)
 * - API Changelog (badge: NEW)
 * 
 * The two "API Playground" options share the same main label, so the badge is necessary
 * to choose the correct one.
 * 
 * success_trigger:
 * - The link matching the reference chip (API Playground with BETA badge) was activated
 *   (data-testid="link-api-playground-beta").
 * - The current route pathname equals "/api/playground".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Link, Typography, Box, Chip, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import type { TaskComponentProps } from '../types';

interface ApiLink {
  key: string;
  label: string;
  badge: string | null;
  badgeColor: 'primary' | 'secondary' | 'success' | 'warning' | 'default';
  icon: React.ReactNode;
  path: string;
  testId: string;
}

const apiLinks: ApiLink[] = [
  { key: 'playground-beta', label: 'API Playground', badge: 'BETA', badgeColor: 'primary', icon: <PlayArrowIcon fontSize="small" />, path: '/api/playground', testId: 'link-api-playground-beta' },
  { key: 'playground-legacy', label: 'API Playground', badge: 'LEGACY', badgeColor: 'default', icon: <HistoryIcon fontSize="small" />, path: '/api/playground-legacy', testId: 'link-api-playground-legacy' },
  { key: 'reference', label: 'API Reference', badge: null, badgeColor: 'default', icon: <MenuBookIcon fontSize="small" />, path: '/api/reference', testId: 'link-api-reference' },
  { key: 'status', label: 'API Status', badge: null, badgeColor: 'default', icon: <MonitorHeartIcon fontSize="small" />, path: '/api/status', testId: 'link-api-status' },
  { key: 'changelog', label: 'API Changelog', badge: 'NEW', badgeColor: 'success', icon: <ListAltIcon fontSize="small" />, path: '/api/changelog', testId: 'link-api-changelog' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [route, setRoute] = useState('/api');
  const [activated, setActivated] = useState(false);

  const handleClick = (link: ApiLink) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activated) return;
    
    setRoute(link.path);
    if (link.key === 'playground-beta') {
      setActivated(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Developer Dashboard" />
      <CardContent>
        {/* Reference Chip */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Reference chip:
          </Typography>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 1,
              p: 1.5,
              bgcolor: 'grey.100',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'grey.400',
            }}
            data-reference="label:API Playground + badge:BETA"
          >
            <Typography variant="body2">API Playground</Typography>
            <Chip label="BETA" size="small" color="primary" />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select the link that matches the reference:
        </Typography>

        {/* Links List */}
        <Stack spacing={1.5}>
          {apiLinks.map((link) => (
            <Link
              key={link.key}
              href={link.path}
              onClick={handleClick(link)}
              data-testid={link.testId}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                cursor: 'pointer',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {link.icon}
              <Typography variant="body2" component="span">
                {link.label}
              </Typography>
              {link.badge && (
                <Chip label={link.badge} size="small" color={link.badgeColor} />
              )}
            </Link>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
