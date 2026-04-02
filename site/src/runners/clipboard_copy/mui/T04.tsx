'use client';

/**
 * clipboard_copy-mui-T04: Hover to reveal copy on code snippet
 *
 * Layout: isolated_card anchored at the top-left (placement=top_left).
 * The card title is "Quick start". It contains a single code block showing:
 *     npm install @acme/sdk@2.1.0
 *
 * A small MUI IconButton with a copy icon is positioned in the top-right corner of the code block, but it is only visible on hover/focus of the code block (disclosed affordance).
 *
 * Component behavior:
 * - Clicking the revealed IconButton copies the full command string to the clipboard (navigator.clipboard.writeText).
 * - A small Tooltip changes from "Copy" to "Copied".
 *
 * Distractors: a short paragraph above the code block. Initial state: IconButton hidden; tooltip state "Copy".
 *
 * Success: Clipboard text equals "npm install @acme/sdk@2.1.0".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, Box } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const command = 'npm install @acme/sdk@2.1.0';

  const handleCopy = async () => {
    if (completed) return;
    
    const success = await copyToClipboard(command, 'Install command');
    if (success) {
      setCopied(true);
      setCompleted(true);
      onSuccess();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Quick start" />
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Install the SDK using npm to get started with the API.
        </Typography>

        <Box
          sx={{
            position: 'relative',
            bgcolor: 'grey.900',
            color: 'grey.100',
            p: 2,
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: 14,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-testid="code-block"
        >
          {command}
          <Tooltip title={copied ? 'Copied' : 'Copy'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                color: 'grey.400',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.2s',
                '&:hover': { color: 'grey.100' },
              }}
              data-testid="copy-code-button"
              aria-label="Copy install command"
            >
              {copied ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
