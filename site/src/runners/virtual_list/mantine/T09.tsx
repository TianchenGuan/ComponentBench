'use client';

/**
 * virtual_list-mantine-T09: Scroll to make a visually specified row visible (top-right placement)
 *
 * Layout: isolated_card titled "Avatar Gallery".
 * Visual guidance: a "Target tile" shows a unique avatar (color + initials).
 * 40 profiles, each with unique color + initials combo. Target is near the bottom.
 * Success: scroll until the target avatar row is visible (at least 60% in viewport).
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Text, Box, Avatar, Group, ScrollArea } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

interface AvatarItem {
  key: string;
  label: string;
  color: string;
  initials: string;
}

const avatars: AvatarItem[] = [
  { key: 'av-01', label: 'Profile #0001', color: 'red', initials: 'JD' },
  { key: 'av-02', label: 'Profile #0002', color: 'blue', initials: 'AK' },
  { key: 'av-03', label: 'Profile #0003', color: 'green', initials: 'TS' },
  { key: 'av-04', label: 'Profile #0004', color: 'orange', initials: 'ML' },
  { key: 'av-05', label: 'Profile #0005', color: 'purple', initials: 'CB' },
  { key: 'av-06', label: 'Profile #0006', color: 'cyan', initials: 'RJ' },
  { key: 'av-07', label: 'Profile #0007', color: 'pink', initials: 'QG' },
  { key: 'av-08', label: 'Profile #0008', color: 'teal', initials: 'PB' },
  { key: 'av-09', label: 'Profile #0009', color: 'grape', initials: 'DW' },
  { key: 'av-10', label: 'Profile #0010', color: 'lime', initials: 'KH' },
  { key: 'av-11', label: 'Profile #0011', color: 'red', initials: 'NR' },
  { key: 'av-12', label: 'Profile #0012', color: 'blue', initials: 'SM' },
  { key: 'av-13', label: 'Profile #0013', color: 'green', initials: 'LP' },
  { key: 'av-14', label: 'Profile #0014', color: 'orange', initials: 'EF' },
  { key: 'av-15', label: 'Profile #0015', color: 'purple', initials: 'HV' },
  { key: 'av-16', label: 'Profile #0016', color: 'cyan', initials: 'BT' },
  { key: 'av-17', label: 'Profile #0017', color: 'pink', initials: 'WC' },
  { key: 'av-18', label: 'Profile #0018', color: 'teal', initials: 'FG' },
  { key: 'av-19', label: 'Profile #0019', color: 'grape', initials: 'OZ' },
  { key: 'av-20', label: 'Profile #0020', color: 'lime', initials: 'IR' },
  { key: 'av-21', label: 'Profile #0021', color: 'red', initials: 'YL' },
  { key: 'av-22', label: 'Profile #0022', color: 'blue', initials: 'GN' },
  { key: 'av-23', label: 'Profile #0023', color: 'green', initials: 'UB' },
  { key: 'av-24', label: 'Profile #0024', color: 'orange', initials: 'XD' },
  { key: 'av-25', label: 'Profile #0025', color: 'purple', initials: 'JW' },
  { key: 'av-26', label: 'Profile #0026', color: 'cyan', initials: 'AE' },
  { key: 'av-27', label: 'Profile #0027', color: 'pink', initials: 'TK' },
  { key: 'av-28', label: 'Profile #0028', color: 'teal', initials: 'MQ' },
  { key: 'av-29', label: 'Profile #0029', color: 'grape', initials: 'CJ' },
  { key: 'av-30', label: 'Profile #0030', color: 'lime', initials: 'RH' },
  { key: 'av-31', label: 'Profile #0031', color: 'red', initials: 'DP' },
  { key: 'av-32', label: 'Profile #0032', color: 'blue', initials: 'KS' },
  { key: 'av-33', label: 'Profile #0033', color: 'green', initials: 'VF' },
  { key: 'av-34', label: 'Profile #0034', color: 'orange', initials: 'AM' },
  { key: 'av-35', label: 'Profile #0035', color: 'purple', initials: 'ZN' },
  { key: 'av-36', label: 'Profile #0036', color: 'cyan', initials: 'EB' },
  { key: 'av-37', label: 'Profile #0037', color: 'pink', initials: 'HW' },
  { key: 'av-38', label: 'Profile #0038', color: 'teal', initials: 'AM' },
  { key: 'av-39', label: 'Profile #0039', color: 'grape', initials: 'SL' },
  { key: 'av-40', label: 'Profile #0040', color: 'lime', initials: 'PN' },
];

const TARGET_KEY = 'av-34';
const targetAvatar = avatars.find(a => a.key === TARGET_KEY)!;

export default function T09({ onSuccess }: TaskComponentProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkVisibility = useCallback(() => {
    if (hasCompleted || !listRef.current) return;

    const targetEl = listRef.current.querySelector(`[data-item-key="${TARGET_KEY}"]`);
    if (!targetEl) return;

    const itemRect = targetEl.getBoundingClientRect();
    const containerRect = listRef.current.getBoundingClientRect();

    const visibleTop = Math.max(itemRect.top, containerRect.top);
    const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const itemHeight = itemRect.height;

    if (itemHeight > 0 && visibleHeight / itemHeight >= 0.6) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [hasCompleted, onSuccess]);

  useEffect(() => {
    const interval = setInterval(checkVisibility, 150);
    return () => clearInterval(interval);
  }, [checkVisibility]);

  return (
    <Paper shadow="sm" p="md" withBorder style={{ width: 380 }} data-testid="vl-primary">
      <Text fw={600} size="lg" mb="sm">Avatar Gallery</Text>

      <Paper withBorder p="sm" mb="md" bg="gray.0">
        <Group gap="sm">
          <Text size="sm" c="dimmed">Target tile:</Text>
          <Avatar color={targetAvatar.color} radius="xl">{targetAvatar.initials}</Avatar>
        </Group>
      </Paper>

      <Box
        ref={listRef}
        onScroll={checkVisibility}
        style={{ height: 320, overflow: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}
      >
        {avatars.map(item => (
          <Box
            key={item.key}
            data-item-key={item.key}
            style={{
              padding: '8px 16px',
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Avatar color={item.color} radius="xl" size="sm">{item.initials}</Avatar>
            <Text size="sm">{item.label}</Text>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
