'use client';

/**
 * tooltip-mui-T08: Open tooltip on a compact table action icon
 *
 * Light theme, COMPACT spacing, table_cell layout centered.
 * A single-row compact MUI Table is shown with columns: Plan, Status, Actions.
 * In the Actions cell there are THREE small icon buttons, each wrapped in MUI Tooltip:
 * - Edit → "Edit plan"
 * - Archive → "Archive plan" (TARGET)
 * - Duplicate → "Duplicate plan"
 * Scale: small (icons are tightly packed). Clutter: medium (table header and row labels). Initial state: no tooltip visible.
 */

import React, { useEffect, useRef } from 'react';
import {
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('[role="tooltip"]');
      if (tooltipContent && tooltipContent.textContent?.includes('Archive plan')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" gutterBottom>
          Plans
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Pro Monthly</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: 2 }}>
                    <Tooltip title="Edit plan">
                      <IconButton size="small" data-testid="tooltip-trigger-edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Archive plan">
                      <IconButton size="small" data-testid="tooltip-trigger-archive">
                        <ArchiveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate plan">
                      <IconButton size="small" data-testid="tooltip-trigger-duplicate">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
