'use client';

/**
 * hover_card-mui-T03: Match an avatar preview (mixed guidance, 2 instances)
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 *
 * The card shows:
 * - A "Target Preview" box with a small avatar preview (colored circle with initials).
 * - Two user entries side-by-side, each rendered as a hoverable avatar chip with initials and a small caption:
 *   * "User: AK" (initials "AK")
 *   * "User: LM" (initials "LM")
 *
 * Each avatar has its own hover card (MUI Tooltip/Popper with card content).
 * - The hover card shows the full name and email.
 * - Both cards are structurally identical; only the user identity differs.
 *
 * Instances: 2 hover cards (one per avatar).
 * Initial state: both closed.
 * Guidance: mixed — the agent can use the visual avatar preview and/or read the initials caption.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Avatar } from '@mui/material';
import type { TaskComponentProps } from '../types';

const users = [
  { initials: 'AK', name: 'Alex Kim', email: 'alex.kim@example.com', color: '#1976d2' },
  { initials: 'LM', name: 'Lisa Moore', email: 'lisa.moore@example.com', color: '#9c27b0' },
];

// Target is LM (purple avatar)
const TARGET_USER = 'LM';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeUser === TARGET_USER && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeUser, onSuccess]);

  const createHoverCardContent = (user: typeof users[0]) => (
    <Card 
      sx={{ minWidth: 200, boxShadow: 3 }}
      data-testid={`hover-card-${user.initials}`}
      data-cb-instance={`User: ${user.initials}`}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar sx={{ bgcolor: user.color, width: 36, height: 36 }}>
            {user.initials}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const targetUser = users.find(u => u.initials === TARGET_USER)!;

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      {/* Target Preview */}
      <Card sx={{ width: 140 }} data-testid="target-preview" id="target-preview">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Target Preview
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: targetUser.color, width: 48, height: 48 }}>
              {targetUser.initials}
            </Avatar>
          </Box>
        </CardContent>
      </Card>

      {/* Users */}
      <Card sx={{ width: 280 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Users</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {users.map((user) => (
              <Tooltip
                key={user.initials}
                title={createHoverCardContent(user)}
                onOpen={() => setActiveUser(user.initials)}
                onClose={() => setActiveUser(null)}
                arrow={false}
                placement="bottom"
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'transparent',
                      p: 0,
                      maxWidth: 'none'
                    }
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  data-testid={`user-${user.initials}-trigger`}
                  data-cb-instance={`User: ${user.initials}`}
                >
                  <Avatar sx={{ bgcolor: user.color, width: 40, height: 40, mb: 0.5 }}>
                    {user.initials}
                  </Avatar>
                  <Typography variant="caption">User: {user.initials}</Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
