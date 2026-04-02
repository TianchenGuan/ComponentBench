'use client';

/**
 * breadcrumb-mui-T08: Navigate in high-clutter file manager (MUI)
 * 
 * Form section file manager with high clutter.
 * MUI Breadcrumbs: Root > Shared > Team > Files
 * Navigate to "Shared" using breadcrumb.
 */

import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [navigated, setNavigated] = useState<string | null>(null);

  const handleNavigate = (item: string) => {
    if (navigated) return;
    setNavigated(item);
    if (item === 'Shared') {
      onSuccess();
    }
  };

  const files = [
    { name: 'quarterly_report.pdf', type: 'file' },
    { name: 'team_photo.jpg', type: 'file' },
    { name: 'meeting_notes.docx', type: 'file' },
    { name: 'Old Versions', type: 'folder' },
    { name: 'Templates', type: 'folder' },
    { name: 'budget.xlsx', type: 'file' },
  ];

  return (
    <Card sx={{ width: 500 }}>
      <CardHeader title="File Manager" />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 2 }}
        >
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Root')}
            data-testid="mui-breadcrumb-root"
            sx={{ cursor: 'pointer' }}
          >
            Root
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Shared')}
            data-testid="mui-breadcrumb-shared"
            sx={{ cursor: 'pointer' }}
          >
            Shared
          </Link>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleNavigate('Team')}
            data-testid="mui-breadcrumb-team"
            sx={{ cursor: 'pointer' }}
          >
            Team
          </Link>
          <Typography color="text.primary">Files</Typography>
        </Breadcrumbs>

        {navigated ? (
          <Typography color="success.main" fontWeight={500}>
            Navigated to: {navigated}
          </Typography>
        ) : (
          <List dense>
            {files.map((file) => (
              <ListItem key={file.name} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {file.type === 'folder' ? (
                    <FolderIcon sx={{ color: '#fbc02d' }} />
                  ) : (
                    <InsertDriveFileIcon sx={{ color: '#9e9e9e' }} />
                  )}
                </ListItemIcon>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
