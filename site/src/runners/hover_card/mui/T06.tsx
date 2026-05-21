'use client';

/**
 * hover_card-mui-T06: Scroll to metric card and open its info hover card
 *
 * Layout: dashboard (light theme, comfortable spacing) with a vertically scrollable main content area.
 *
 * The dashboard has several metric cards stacked vertically (e.g., Sessions, Conversion, Retention, ARPU).
 * - Each metric card header contains a small info icon (ⓘ).
 * - Hovering any info icon opens the same MUI Tooltip/Popper-based hover card (single controlled instance), with content based on which metric is hovered.
 *
 * The "Retention" card is below the fold; the agent must scroll the page content to bring it into view.
 * Clutter: medium (filters, date range selector, and navigation tabs exist but are not needed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Tooltip, Box, Select, MenuItem, IconButton, Tabs, Tab } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { TaskComponentProps } from '../types';

const metrics = [
  { name: 'Sessions', value: '45.2K', change: '+12%', info: 'Total user sessions in the selected period.' },
  { name: 'Conversion', value: '3.8%', change: '+0.5%', info: 'Percentage of visitors who completed a purchase.' },
  { name: 'Bounce Rate', value: '42%', change: '-3%', info: 'Percentage of single-page visits.' },
  { name: 'Avg. Duration', value: '4m 32s', change: '+15s', info: 'Average time spent on site per session.' },
  { name: 'Retention', value: '68%', change: '+5%', info: 'Percentage of users who return within 30 days.' },
  { name: 'ARPU', value: '$24.50', change: '+$2.30', info: 'Average revenue per user.' },
];

const TARGET_METRIC = 'Retention';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (activeMetric === TARGET_METRIC && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeMetric, onSuccess]);

  const createHoverCardContent = (metric: typeof metrics[0]) => (
    <Card 
      sx={{ minWidth: 220, boxShadow: 3 }}
      data-testid={`hover-card-${metric.name.toLowerCase()}`}
      data-cb-instance={`Metric: ${metric.name} info`}
      data-metric={metric.name.toLowerCase()}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {metric.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {metric.info}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header with filters (clutter) */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Dashboard</Typography>
            <Select size="small" defaultValue="30d" sx={{ minWidth: 120 }}>
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
            </Select>
          </Box>
          <Tabs value={0}>
            <Tab label="Overview" />
            <Tab label="Details" />
          </Tabs>
        </Box>

        {/* Scrollable metrics */}
        <Box 
          sx={{ 
            maxHeight: 280, 
            overflowY: 'auto',
            p: 2
          }}
          data-testid="metrics-scroll-container"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {metrics.map((metric) => (
              <Card key={metric.name} variant="outlined">
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {metric.name}
                        </Typography>
                        <Tooltip
                          title={createHoverCardContent(metric)}
                          onOpen={() => setActiveMetric(metric.name)}
                          onClose={() => setActiveMetric(null)}
                          arrow={false}
                          placement="right"
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
                          <IconButton 
                            size="small" 
                            sx={{ p: 0.25 }}
                            data-testid={`metric-info-${metric.name.toLowerCase()}`}
                            data-cb-instance={`Metric: ${metric.name} info`}
                          >
                            <InfoOutlinedIcon sx={{ fontSize: 14, color: '#999' }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 0.5 }}>
                        {metric.value}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.change.startsWith('+') ? '#2e7d32' : '#d32f2f'
                      }}
                    >
                      {metric.change}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
