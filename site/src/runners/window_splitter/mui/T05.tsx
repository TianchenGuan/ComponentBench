'use client';

/**
 * window_splitter-mui-T15: Two splitters: adjust the Chat Split (Secondary) to 60%
 * 
 * The page uses a dashboard layout with two nearly identical resizable cards stacked 
 * vertically. The first card is labeled "Primary — Email Split" with panes "Folders" 
 * and "Message". The second card is labeled "Secondary — Chat Split" with panes 
 * "Conversation" and "Info". Both use the same handle styling. Only the Secondary — 
 * Chat Split should be modified for success.
 * 
 * Success: Chat Split Conversation (left) is 60% ±3%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Box, Typography, Stack } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [emailSizes, setEmailSizes] = useState({ folders: 50, message: 50 });
  const [chatSizes, setChatSizes] = useState({ conversation: 50, info: 50 });
  const successFiredRef = useRef(false);

  useEffect(() => {
    const conversationFraction = chatSizes.conversation / 100;
    // Success: Conversation (left) is 60% ±3% (0.57 to 0.63)
    if (!successFiredRef.current && conversationFraction >= 0.57 && conversationFraction <= 0.63) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [chatSizes, onSuccess]);

  const renderSeparator = () => (
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
  );

  return (
    <Stack spacing={3} sx={{ width: 700 }}>
      {/* Primary — Email Split */}
      <Card>
        <CardHeader title="Primary — Email Split" titleTypographyProps={{ variant: 'subtitle1' }} />
        <CardContent>
          <Box 
            sx={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 1 }}
            data-testid="splitter-email"
          >
            <Group 
              orientation="horizontal" 
              onLayoutChange={(layout) => {
                setEmailSizes({ folders: layout['folders'] ?? 50, message: layout['message'] ?? 50 });
              }}
            >
              <Panel id="folders" defaultSize="50%" minSize="10%" maxSize="90%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                  <Typography fontWeight={500}>Folders</Typography>
                </Box>
              </Panel>
              {renderSeparator()}
              <Panel id="message" minSize="10%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography fontWeight={500}>Message</Typography>
                </Box>
              </Panel>
            </Group>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Folders: {emailSizes.folders.toFixed(0)}% • Message: {emailSizes.message.toFixed(0)}%
          </Typography>
        </CardContent>
      </Card>

      {/* Secondary — Chat Split */}
      <Card>
        <CardHeader title="Secondary — Chat Split" titleTypographyProps={{ variant: 'subtitle1' }} />
        <CardContent>
          <Box 
            sx={{ height: 200, border: '1px solid #e0e0e0', borderRadius: 1 }}
            data-testid="splitter-chat"
          >
            <Group 
              orientation="horizontal" 
              onLayoutChange={(layout) => {
                setChatSizes({ conversation: layout['conversation'] ?? 50, info: layout['info'] ?? 50 });
              }}
            >
              <Panel id="conversation" defaultSize="50%" minSize="10%" maxSize="90%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                  <Typography fontWeight={500}>Conversation</Typography>
                </Box>
              </Panel>
              {renderSeparator()}
              <Panel id="info" minSize="10%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography fontWeight={500}>Info</Typography>
                </Box>
              </Panel>
            </Group>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Conversation: {chatSizes.conversation.toFixed(0)}% • Info: {chatSizes.info.toFixed(0)}%
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
