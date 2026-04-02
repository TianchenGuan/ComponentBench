'use client';

/**
 * virtual_list-mui-T07: Open a drawer list, pick a member, and confirm
 *
 * Placement: the entry card is anchored near the bottom-right of the viewport.
 * Layout: drawer_flow. The main page shows a small "Team Members" card with a button "Add member".
 * Target component: clicking "Add member" opens a right-side MUI Drawer titled "Select a member".
 * Inside the drawer:
 *   - a react-window virtualized list (height ~360px) of ~2,000 members
 *   - drawer footer with "Cancel" and primary "Done"
 * Initial state: drawer closed; no new member selected.
 *
 * Success: Select 'mem-0204' (Diego Alvarez) and click Done
 */

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Drawer, Box, ListItemButton, ListItemText, ListItemAvatar, Avatar, Checkbox, FormControlLabel, Divider } from '@mui/material';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import type { TaskComponentProps } from '../types';

interface MemberItem {
  key: string;
  id: string;
  name: string;
  avatarColor: string;
}

const avatarColors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068', '#f5222d', '#1890ff', '#722ed1'];

// Generate 2000 members
const generateMembers = (): MemberItem[] => {
  const firstNames = ['Diego', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
  const lastNames = ['Alvarez', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  
  return Array.from({ length: 2000 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    // Special name for member 204
    if (num === 204) name = 'Diego Alvarez';
    return {
      key: `mem-${String(num).padStart(4, '0')}`,
      id: `MEM-${String(num).padStart(4, '0')}`,
      name,
      avatarColor: avatarColors[i % avatarColors.length],
    };
  });
};

const members = generateMembers();

export default function T07({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempSelectedKey, setTempSelectedKey] = useState<string | null>(null);
  const [confirmedMember, setConfirmedMember] = useState<MemberItem | null>(null);

  const handleDone = () => {
    if (tempSelectedKey) {
      const member = members.find(m => m.key === tempSelectedKey);
      if (member) {
        setConfirmedMember(member);
        setDrawerOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setTempSelectedKey(confirmedMember?.key || null);
    setDrawerOpen(false);
  };

  // Check success condition
  useEffect(() => {
    if (confirmedMember?.key === 'mem-0204') {
      onSuccess();
    }
  }, [confirmedMember, onSuccess]);

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = members[index];
    return (
      <ListItemButton
        style={style}
        selected={tempSelectedKey === item.key}
        onClick={() => setTempSelectedKey(item.key)}
        data-item-key={item.key}
        aria-selected={tempSelectedKey === item.key}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: item.avatarColor, width: 32, height: 32 }}>
            {item.name[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={`${item.id} — ${item.name}`} />
      </ListItemButton>
    );
  };

  return (
    <>
      <Paper 
        elevation={2} 
        sx={{ width: 320, p: 2 }}
        data-confirmed-member={confirmedMember?.key || 'none'}
      >
        <Typography variant="h6" gutterBottom>
          Team Members
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pending add: {confirmedMember ? `${confirmedMember.id} — ${confirmedMember.name}` : 'none'}
        </Typography>
        <Button variant="contained" onClick={() => setDrawerOpen(true)}>
          Add member
        </Button>
      </Paper>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCancel}
      >
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Select a member</Typography>
          </Box>
          <Divider />
          
          {/* Non-functional distractor */}
          <Box sx={{ p: 2 }}>
            <FormControlLabel 
              control={<Checkbox disabled />} 
              label="Only show active" 
            />
          </Box>

          <Box sx={{ flex: 1, px: 2 }} data-testid="vl-drawer">
            <Paper variant="outlined">
              <FixedSizeList
                height={360}
                width="100%"
                itemSize={56}
                itemCount={members.length}
                overscanCount={5}
              >
                {Row}
              </FixedSizeList>
            </Paper>
          </Box>

          <Divider />
          <Box sx={{ p: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleDone}
              disabled={!tempSelectedKey}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
