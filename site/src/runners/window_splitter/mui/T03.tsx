'use client';

/**
 * window_splitter-mui-T13: Collapse the Sidebar by dragging until it snaps closed
 * 
 * A centered isolated card titled "Primary splitter" contains a two-panel layout: 
 * "Sidebar" (left) and "Workspace" (right). The Sidebar panel is configured as 
 * collapsible: when resized below its minimum, it snaps to a collapsed size (0%). 
 * A status chip under the layout reads "Sidebar: Expanded" initially and changes 
 * to "Sidebar: Collapsed" when the snap-collapse occurs.
 * 
 * Success: Sidebar (left) is in collapsed state
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, Chip } from '@mui/material';
import { Group, Panel, Separator, usePanelRef } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarPanelRef = usePanelRef();
  const successFiredRef = useRef(false);

  useEffect(() => {
    // Success: Sidebar is collapsed
    if (!successFiredRef.current && isCollapsed) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isCollapsed, onSuccess]);

  return (
    <Card sx={{ width: 700 }}>
      <CardHeader title="Primary splitter" />
      <CardContent>
        <Box 
          sx={{ height: 300, border: '1px solid #e0e0e0', borderRadius: 1 }}
          data-testid="splitter-primary"
        >
          <Group orientation="horizontal">
            <Panel 
              id="sidebar"
              panelRef={sidebarPanelRef}
              defaultSize="40%" 
              minSize="10%" 
              collapsible 
              collapsedSize="0%"
              onResize={() => {
                const collapsed = sidebarPanelRef.current?.isCollapsed() ?? false;
                setIsCollapsed(collapsed);
              }}
            >
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#fafafa'
              }}>
                <Typography fontWeight={500}>Sidebar</Typography>
              </Box>
            </Panel>
            <Separator style={{
              width: 8,
              background: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'col-resize',
            }}>
              <Box sx={{ 
                width: 4, 
                height: 24, 
                borderLeft: '2px dotted #999',
                borderRight: '2px dotted #999',
              }} />
            </Separator>
            <Panel id="workspace" minSize="10%">
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: '#f5f5f5'
              }}>
                <Typography fontWeight={500}>Workspace</Typography>
              </Box>
            </Panel>
          </Group>
        </Box>
        <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Chip 
            label={`Sidebar: ${isCollapsed ? 'Collapsed' : 'Expanded'}`}
            color={isCollapsed ? 'warning' : 'success'}
            size="small"
            data-collapsed={isCollapsed}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
