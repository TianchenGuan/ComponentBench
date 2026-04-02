'use client';

/**
 * hover_card-mui-T09: Pin the Secondary owner hover card (3 instances)
 *
 * Layout: isolated_card positioned in the top-right of the viewport (light theme, comfortable spacing).
 *
 * The card is titled "Workspace owners" and shows three avatar rows:
 * 1) Primary owner
 * 2) Secondary owner
 * 3) Billing owner
 *
 * Each avatar row has its own hover card implemented with MUI Tooltip/Popper (three instances).
 * - Hover card contains profile preview and a small "Pin" control in the header.
 * - All three hover cards look nearly identical aside from the owner label and name, creating confusable distractors.
 *
 * Initial state: all hover cards closed and unpinned.
 * No other tooltips are present.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Avatar, IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import type { TaskComponentProps } from '../types';

const owners = [
  { role: 'Primary owner', name: 'Sarah Johnson', email: 'sarah@company.com', initials: 'SJ', color: '#1976d2' },
  { role: 'Secondary owner', name: 'Mike Chen', email: 'mike@company.com', initials: 'MC', color: '#9c27b0' },
  { role: 'Billing owner', name: 'Lisa Park', email: 'lisa@company.com', initials: 'LP', color: '#2e7d32' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [openOwner, setOpenOwner] = useState<string | null>(null);
  const [pinnedOwner, setPinnedOwner] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openOwner === 'Secondary owner' && pinnedOwner === 'Secondary owner' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openOwner, pinnedOwner, onSuccess]);

  const handlePin = (role: string) => {
    setPinnedOwner(role);
  };

  const createHoverCardContent = (owner: typeof owners[0]) => (
    <Card 
      sx={{ minWidth: 220, boxShadow: 3 }}
      data-testid={`hover-card-${owner.role.replace(' ', '-').toLowerCase()}`}
      data-cb-instance={owner.role}
      data-pinned={pinnedOwner === owner.role}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {owner.role}
          </Typography>
          <IconButton 
            size="small" 
            onClick={() => handlePin(owner.role)}
            data-testid={`pin-button-${owner.role.replace(' ', '-').toLowerCase()}`}
            aria-label="Pin"
          >
            {pinnedOwner === owner.role ? <PushPinIcon fontSize="small" /> : <PushPinOutlinedIcon fontSize="small" />}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: owner.color, width: 32, height: 32, fontSize: 12 }}>
            {owner.initials}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              {owner.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
              {owner.email}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 320 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Workspace owners</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {owners.map((owner) => (
            <Tooltip
              key={owner.role}
              title={createHoverCardContent(owner)}
              open={openOwner === owner.role}
              onOpen={() => setOpenOwner(owner.role)}
              onClose={() => {
                if (pinnedOwner !== owner.role) setOpenOwner(null);
              }}
              arrow={false}
              placement="left"
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
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
                data-testid={`owner-${owner.role.replace(' ', '-').toLowerCase()}`}
                data-cb-instance={owner.role}
              >
                <Avatar sx={{ bgcolor: owner.color, width: 36, height: 36, fontSize: 13 }}>
                  {owner.initials}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {owner.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {owner.role}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
