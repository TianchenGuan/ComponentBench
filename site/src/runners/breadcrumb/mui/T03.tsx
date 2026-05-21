'use client';

/**
 * breadcrumb-mui-T03: Select project from breadcrumb menu (MUI)
 * 
 * Centered isolated card titled "Task Details".
 * MUI Breadcrumbs: Home > Projects (menu) > Tasks > Details
 * Clicking Projects opens menu with Project Alpha, Beta, Gamma.
 * Select "Project Beta".
 */

import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectProject = (project: string) => {
    if (selectedProject) return;
    setSelectedProject(project);
    handleCloseMenu();
    if (project === 'Project Beta') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardHeader title="Task Details" />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            data-testid="mui-breadcrumb-home"
            sx={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={handleOpenMenu}
            data-testid="mui-breadcrumb-projects-menu"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            Projects <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            data-testid="mui-breadcrumb-tasks"
            sx={{ cursor: 'pointer' }}
          >
            Tasks
          </Link>
          <Typography color="text.primary">Details</Typography>
        </Breadcrumbs>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          data-testid="mui-menu-projects"
        >
          <MenuItem onClick={() => handleSelectProject('Project Alpha')}>
            Project Alpha
          </MenuItem>
          <MenuItem onClick={() => handleSelectProject('Project Beta')}>
            Project Beta
          </MenuItem>
          <MenuItem onClick={() => handleSelectProject('Project Gamma')}>
            Project Gamma
          </MenuItem>
        </Menu>

        {selectedProject ? (
          <Typography color="success.main" fontWeight={500}>
            Selected: {selectedProject}
          </Typography>
        ) : (
          <Typography>
            Click "Projects" to open the menu and select a project.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
