'use client';

/**
 * menu_button-mui-T10: Invite members from Team actions menu in dark dashboard
 * 
 * Layout: dashboard with dark theme and high clutter (charts, side nav, dense toolbar).
 * In the top toolbar there are two icon-only menu buttons (instances=2), both three-dot IconButtons:
 * one labeled "Project actions" and one labeled "Team actions".
 * 
 * Opening either shows a menu with several actions.
 * The Team actions menu includes: "Invite members", "Manage roles", "Leave team".
 * Selecting an action closes the menu and updates a small label next to that icon button.
 * 
 * Initial state: both Last action labels read "Last action: None".
 * Success: For "Team actions", the last selected action equals "Invite members".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Box, Divider } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [projectAnchorEl, setProjectAnchorEl] = useState<null | HTMLElement>(null);
  const [teamAnchorEl, setTeamAnchorEl] = useState<null | HTMLElement>(null);
  const [projectLastAction, setProjectLastAction] = useState<string | null>(null);
  const [teamLastAction, setTeamLastAction] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const projectOpen = Boolean(projectAnchorEl);
  const teamOpen = Boolean(teamAnchorEl);

  useEffect(() => {
    if (teamLastAction === 'Invite members' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [teamLastAction, successTriggered, onSuccess]);

  const handleProjectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProjectAnchorEl(event.currentTarget);
  };

  const handleTeamClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTeamAnchorEl(event.currentTarget);
  };

  const handleProjectClose = () => {
    setProjectAnchorEl(null);
  };

  const handleTeamClose = () => {
    setTeamAnchorEl(null);
  };

  const handleProjectAction = (action: string) => {
    setProjectLastAction(action);
    handleProjectClose();
  };

  const handleTeamAction = (action: string) => {
    setTeamLastAction(action);
    handleTeamClose();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      {/* Toolbar Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Dashboard</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {/* Project Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last action: {projectLastAction || 'None'}
                </Typography>
                <IconButton
                  aria-label="Project actions"
                  onClick={handleProjectClick}
                  size="small"
                  data-testid="menu-button-project-actions"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Divider orientation="vertical" flexItem />

              {/* Team Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Last action: {teamLastAction || 'None'}
                </Typography>
                <IconButton
                  aria-label="Team actions"
                  onClick={handleTeamClick}
                  size="small"
                  data-testid="menu-button-team-actions"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Clutter: Dashboard content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 2 }}>
        {/* Side nav clutter */}
        <Card>
          <CardContent sx={{ py: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Navigation
            </Typography>
            <Typography variant="body2" sx={{ py: 0.5 }}>Overview</Typography>
            <Typography variant="body2" sx={{ py: 0.5 }}>Analytics</Typography>
            <Typography variant="body2" sx={{ py: 0.5 }}>Reports</Typography>
            <Typography variant="body2" sx={{ py: 0.5 }}>Settings</Typography>
          </CardContent>
        </Card>

        {/* Main content clutter */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Chart Area</Typography>
              <Box sx={{ height: 80, bgcolor: 'grey.800', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary">[Chart placeholder]</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Recent Activity</Typography>
              <Typography variant="body2" color="text.secondary">User A edited document</Typography>
              <Typography variant="body2" color="text.secondary">User B joined team</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Project Actions Menu */}
      <Menu
        anchorEl={projectAnchorEl}
        open={projectOpen}
        onClose={handleProjectClose}
      >
        <MenuItem onClick={() => handleProjectAction('New project')}>New project</MenuItem>
        <MenuItem onClick={() => handleProjectAction('Archive project')}>Archive project</MenuItem>
        <MenuItem onClick={() => handleProjectAction('Project settings')}>Project settings</MenuItem>
      </Menu>

      {/* Team Actions Menu */}
      <Menu
        anchorEl={teamAnchorEl}
        open={teamOpen}
        onClose={handleTeamClose}
      >
        <MenuItem onClick={() => handleTeamAction('Invite members')}>Invite members</MenuItem>
        <MenuItem onClick={() => handleTeamAction('Manage roles')}>Manage roles</MenuItem>
        <MenuItem onClick={() => handleTeamAction('Leave team')}>Leave team</MenuItem>
      </Menu>
    </Box>
  );
}
