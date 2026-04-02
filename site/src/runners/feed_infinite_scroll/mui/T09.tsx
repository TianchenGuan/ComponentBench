'use client';

/**
 * feed_infinite_scroll-mui-T09: Dark chats: match reference avatar and select CHAT-118
 * 
 * Theme: dark.
 * Layout: dashboard with a left sidebar and a main panel containing the "Chats" card.
 * The Chats feed is an endless/virtualized list of conversations.
 * Above the feed is a small "Reference avatar" preview showing a colored circle with initials "RJ".
 * Each feed row shows an avatar circle with initials and a conversation title.
 * The matching conversation is not near the top and requires scrolling.
 * 
 * Success: matched_item_id equals CHAT-118 (which has matching avatar color and initials RJ)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { TaskComponentProps } from '../types';

// Avatar colors
const AVATAR_COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'];
const TARGET_COLOR = '#722ed1'; // Purple

// Initials options
const INITIALS_OPTIONS = ['AB', 'CD', 'EF', 'GH', 'RJ', 'KL', 'MN', 'OP', 'QR', 'ST'];

interface FeedItem {
  id: string;
  initials: string;
  avatarColor: string;
  title: string;
  isTarget: boolean;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateItems(start: number, count: number): FeedItem[] {
  const titles = [
    'Project discussion',
    'Team standup',
    'Client meeting',
    'Weekly sync',
    'Code review',
    'Design feedback',
    'Sprint planning',
    'Retrospective',
    'Onboarding',
    'General chat',
  ];

  const nonTargetInitials = INITIALS_OPTIONS.filter(i => i !== 'RJ');
  const nonTargetColors = AVATAR_COLORS.filter(c => c !== TARGET_COLOR);

  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `CHAT-${String(i).padStart(3, '0')}`;
    const isTarget = i === 118;

    let initials: string;
    let avatarColor: string;

    if (isTarget) {
      initials = 'RJ';
      avatarColor = TARGET_COLOR;
    } else {
      const r1 = seededRandom(i * 2);
      const r2 = seededRandom(i * 2 + 1);
      initials = nonTargetInitials[Math.floor(r1 * nonTargetInitials.length)];
      avatarColor = nonTargetColors[Math.floor(r2 * nonTargetColors.length)];
    }

    items.push({
      id,
      initials,
      avatarColor,
      title: titles[(i - 1) % titles.length],
      isTarget,
    });
  }
  return items;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [items, setItems] = useState<FeedItem[]>(() => generateItems(1, 30));
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (!successCalledRef.current && selectedId === 'CHAT-118') {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [selectedId, onSuccess]);

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !loading && items.length < 150) {
      setLoading(true);
      setTimeout(() => {
        setItems(prev => [...prev, ...generateItems(prev.length + 1, 20)]);
        setLoading(false);
      }, 500);
    }
  }, [loading, items.length]);

  return (
    <Box sx={{ display: 'flex', width: 800, height: 500 }}>
      {/* Sidebar */}
      <Box sx={{ 
        width: 60, 
        bgcolor: '#1f1f1f', 
        borderRight: '1px solid #303030',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 2,
      }}>
        <HomeIcon sx={{ color: '#888' }} />
        <ChatIcon sx={{ color: '#fff' }} />
        <PersonIcon sx={{ color: '#888' }} />
        <SettingsIcon sx={{ color: '#888' }} />
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, bgcolor: '#141414', p: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: '#1f1f1f', 
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ p: 2, color: '#fff', borderBottom: '1px solid #303030' }}>
            Chats
          </Typography>
          
          {/* Reference avatar */}
          <Box 
            data-reference-id="REF-AVATAR-RJ"
            sx={{ 
              p: 2, 
              borderBottom: '1px solid #303030',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: '#888' }}>
              Reference avatar:
            </Typography>
            <Avatar sx={{ bgcolor: TARGET_COLOR, width: 40, height: 40 }}>
              RJ
            </Avatar>
          </Box>

          <Box
            ref={containerRef}
            data-testid="feed-Chats"
            data-selected-item-id={selectedId}
            sx={{
              flex: 1,
              overflow: 'auto',
            }}
            onScroll={handleScroll}
          >
            <List disablePadding>
              {items.map((item) => (
                <ListItemButton
                  key={item.id}
                  data-item-id={item.id}
                  data-avatar={`${item.initials}|${item.avatarColor.replace('#', '')}`}
                  selected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                  sx={{ 
                    py: 1.5,
                    borderBottom: '1px solid #303030',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(114, 46, 209, 0.2)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: item.avatarColor }}>
                      {item.initials}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography fontSize={14} sx={{ color: '#fff' }}>
                        <strong>{item.id}</strong>
                      </Typography>
                    }
                    secondary={
                      <Typography fontSize={12} sx={{ color: '#888' }}>
                        {item.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#888' }} />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
