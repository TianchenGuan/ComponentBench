'use client';

/**
 * notification_center-mui-T06: Expand details for a weekly report notification
 *
 * setup_description:
 * Isolated Notification Center card anchored near the top-left of the viewport (not centered).
 * The list uses accordion behavior: each notification row can be expanded to reveal additional details (a longer message and two buttons).
 * 
 * Mixed guidance: on the right side of the page there is a small, non-interactive preview card titled "Target".
 * It visually shows the exact notification row to open (same icon + title text).
 * 
 * Target row:
 *   - Title text: "Weekly report ready"
 *   - Id: 'weekly_report_ready'
 *   - Collapsed initially (details hidden)
 * 
 * There are other rows with similar wording such as "Weekly report scheduled" and "Weekly report failed".
 * The expansion affordance is either clicking the row header area or clicking a small chevron icon on the right.
 * 
 * Distractors: a separate "Reports" section in the page sidebar contains links like "Weekly report", but those links are outside the Notification Center.
 * Feedback: when expanded, the row shows its details region and the chevron rotates; the row has aria-expanded=true.
 *
 * success_trigger: Notification 'weekly_report_ready' is expanded (details visible).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: 'weekly_report_scheduled', title: 'Weekly report scheduled', message: 'Your weekly report will be generated on Monday at 9 AM.' },
  { id: 'weekly_report_ready', title: 'Weekly report ready', message: 'Your weekly performance report is now available for download. Click "View Report" to see the full analysis.' },
  { id: 'weekly_report_failed', title: 'Weekly report failed', message: 'Failed to generate your weekly report due to insufficient data.' },
  { id: 'monthly_summary', title: 'Monthly summary available', message: 'Your monthly summary report is ready.' },
  { id: 'annual_review', title: 'Annual review notice', message: 'Please complete your annual review by end of month.' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [expandedId, setExpandedId] = useState<string | false>(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (expandedId === 'weekly_report_ready' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [expandedId, onSuccess]);

  const handleChange = (id: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedId(isExpanded ? id : false);
  };

  return (
    <Box sx={{ display: 'flex', gap: 4 }}>
      {/* Main notification center */}
      <Card sx={{ width: 450 }}>
        <CardHeader title="Notification Center" />
        <CardContent sx={{ pt: 0 }}>
          {notifications.map((notif) => (
            <Accordion
              key={notif.id}
              expanded={expandedId === notif.id}
              onChange={handleChange(notif.id)}
              data-notif-id={notif.id}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${notif.id}-content`}
                id={`${notif.id}-header`}
              >
                <Typography fontWeight={500}>{notif.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {notif.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained">View Report</Button>
                  <Button size="small">Dismiss</Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>

      {/* Target preview */}
      <Card sx={{ width: 200, height: 'fit-content' }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Target
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
            <DescriptionIcon fontSize="small" />
            <Typography variant="body2">Weekly report ready</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Sidebar - distractor */}
      <Card sx={{ width: 180, height: 'fit-content' }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Reports</Typography>
          <List dense disablePadding>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Weekly report" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Monthly report" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Custom report" />
              </ListItemButton>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
