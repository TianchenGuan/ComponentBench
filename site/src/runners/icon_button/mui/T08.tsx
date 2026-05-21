'use client';

/**
 * icon_button-mui-T08: Star Project Beta (3 similar instances)
 *
 * Layout: form_section centered in the viewport.
 * A section titled "Projects" lists three project rows (Alpha, Beta, Gamma).
 * Each row ends with a MUI IconButton showing a star icon.
 * 
 * Success: The star IconButton for "Project Beta" has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import type { TaskComponentProps } from '../types';

interface Project {
  id: string;
  name: string;
  status: string;
}

const projects: Project[] = [
  { id: 'alpha', name: 'Project Alpha', status: 'Active' },
  { id: 'beta', name: 'Project Beta', status: 'Active' },
  { id: 'gamma', name: 'Project Gamma', status: 'Paused' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const handleToggle = (id: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (id === 'beta') {
          onSuccess();
        }
      }
      return next;
    });
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Projects
        </Typography>

        {projects.map((project) => {
          const isStarred = starred.has(project.id);
          return (
            <Box
              key={project.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Box>
                <Typography variant="body1">{project.name}</Typography>
                <Chip 
                  label={project.status} 
                  size="small" 
                  sx={{ fontSize: 10, height: 18, mt: 0.5 }}
                />
              </Box>
              <IconButton
                onClick={() => handleToggle(project.id)}
                aria-label={`Star ${project.name}`}
                aria-pressed={isStarred}
                data-testid={`mui-icon-btn-star-${project.id}`}
                color={isStarred ? 'warning' : 'default'}
              >
                {isStarred ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
