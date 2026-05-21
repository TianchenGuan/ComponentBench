'use client';

/**
 * clipboard_copy-mui-T07: Copy the token matching the Reference chip
 *
 * Layout: isolated_card, centered.
 * The card title is "Active API tokens". At the top of the card there is a prominent chip labeled "Reference" showing the target token in full:
 * - Reference: tk_7F12-6D9A
 *
 * Below the chip there is a list of three token rows. Each row shows the token (monospace) and an IconButton copy control at the end:
 * 1) tk_7F12-6D8A
 * 2) tk_7F12-6D9A   (this is the target)
 * 3) tk_7F12-6D9B
 *
 * Component behavior:
 * - Clicking a row's copy IconButton copies that row's full token value to the clipboard.
 * - A small inline "Copied" tooltip appears on the clicked button.
 *
 * Distractors: a "Revoke" text link on each row (does nothing in this benchmark).
 * Requirement: instances=3; target instance is the row whose token matches the Reference chip.
 *
 * Success: Clipboard text equals "tk_7F12-6D9A".
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Tooltip, Chip, Box, Stack, Link } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import type { TaskComponentProps } from '../types';
import { copyToClipboard } from '../types';

const tokens = [
  { id: '1', value: 'tk_7F12-6D8A' },
  { id: '2', value: 'tk_7F12-6D9A' },  // target
  { id: '3', value: 'tk_7F12-6D9B' },
];

const targetToken = 'tk_7F12-6D9A';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [completed, setCompleted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (token: string, id: string) => {
    await copyToClipboard(token, `Token row ${token}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);

    // Only complete if the correct token was copied
    if (token === targetToken && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardHeader title="Active API tokens" />
      <CardContent>
        <Stack spacing={3}>
          {/* Reference chip */}
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              label={`Reference: ${targetToken}`}
              color="primary"
              sx={{ fontFamily: 'monospace', fontSize: 14 }}
              data-testid="reference-chip"
            />
          </Box>

          {/* Token list */}
          <Stack spacing={1}>
            {tokens.map((token) => (
              <Box
                key={token.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                }}
                data-testid={`token-row-${token.id}`}
              >
                <Typography sx={{ fontFamily: 'monospace' }}>{token.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{ textDecoration: 'none' }}
                    data-testid={`revoke-${token.id}`}
                  >
                    Revoke
                  </Link>
                  <Tooltip title={copiedId === token.id ? 'Copied' : 'Copy'}>
                    <IconButton
                      size="small"
                      onClick={() => handleCopy(token.value, token.id)}
                      data-testid={`copy-token-${token.id}`}
                      aria-label={`Copy token ${token.value}`}
                    >
                      {copiedId === token.id ? (
                        <Check fontSize="small" color="success" />
                      ) : (
                        <ContentCopy fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
