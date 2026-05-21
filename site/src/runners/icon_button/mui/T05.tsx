'use client';

/**
 * icon_button-mui-T05: Match the reference icon (4 IconButtons)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Pick the matching icon" shows a Target icon reference box 
 * and four MUI IconButtons in a single row.
 * 
 * Success: The correct IconButton (matching the target icon) has data-cb-activated="true".
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { TaskComponentProps } from '../types';

const ICONS = [
  { key: 'notification', icon: <NotificationsIcon /> },
  { key: 'bookmark', icon: <BookmarkIcon /> },
  { key: 'star', icon: <StarIcon /> },
  { key: 'favorite', icon: <FavoriteIcon /> },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const targetKey = useMemo(() => 'star', []);
  const [activatedKey, setActivatedKey] = useState<string | null>(null);

  const handleClick = (key: string) => {
    if (activatedKey) return;
    setActivatedKey(key);
    if (key === targetKey) {
      onSuccess();
    }
  };

  const targetIcon = ICONS.find(i => i.key === targetKey)?.icon;

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Pick the matching icon
        </Typography>

        {/* Target reference */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Target icon:
          </Typography>
          <Box 
            sx={{ 
              width: 48, 
              height: 48, 
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}
          >
            {targetIcon}
          </Box>
        </Box>

        {/* Options */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Options:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {ICONS.map((item, index) => (
            <IconButton
              key={item.key}
              onClick={() => handleClick(item.key)}
              aria-label={`Option ${String.fromCharCode(65 + index)}`}
              data-cb-activated={activatedKey === item.key ? 'true' : 'false'}
              sx={{ 
                border: 1, 
                borderColor: activatedKey === item.key ? 'primary.main' : 'divider',
                bgcolor: activatedKey === item.key ? 'primary.light' : undefined,
              }}
            >
              {item.icon}
            </IconButton>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
