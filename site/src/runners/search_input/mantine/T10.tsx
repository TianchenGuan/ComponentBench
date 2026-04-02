'use client';

/**
 * search_input-mantine-T10: Scroll to footer Help center search and match the banner phrase
 *
 * Long "Help Center" page that starts with a wide visual banner at the top showing a suggested search phrase in large text: "shipping delay".
 * The only interactive control on the page is an isolated card located at the bottom (below the fold), anchored toward the bottom-right when you reach it.
 * That bottom card contains a Mantine TextInput labeled "Help center search" with a left search icon.
 * Initial state: empty.
 * Feedback: a tiny read-only line in the card updates live as you type: "Query: …".
 * No other interactive elements are present (clutter: none), but scrolling is required to reach the bottom card.
 *
 * Success: The footer search input labeled "Help center search" has value exactly "shipping delay".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TextInput, Text, Paper, Stack, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (value === 'shipping delay' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Box style={{ minHeight: '200vh', display: 'flex', flexDirection: 'column' }}>
      {/* Banner at top */}
      <Paper 
        p="xl" 
        radius={0} 
        bg="blue.6" 
        style={{ 
          width: '100%',
          textAlign: 'center',
          marginBottom: 40,
        }}
      >
        <Text size="lg" c="white" mb="xs">
          Having issues? Try searching for:
        </Text>
        <Text 
          size="xl" 
          fw={700} 
          c="white" 
          style={{ 
            fontSize: 32,
            letterSpacing: 1,
          }}
        >
          shipping delay
        </Text>
      </Paper>

      {/* Filler content to push footer down */}
      <Stack gap="xl" px="xl" style={{ flex: 1 }}>
        <Paper withBorder p="lg" radius="sm">
          <Text fw={600} mb="sm">Getting Started</Text>
          <Text size="sm" c="dimmed">
            Welcome to our Help Center. Browse topics or use the search at the bottom of the page.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="sm">
          <Text fw={600} mb="sm">Popular Topics</Text>
          <Text size="sm" c="dimmed">
            • Account settings<br />
            • Billing and payments<br />
            • Order tracking<br />
            • Returns and refunds
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="sm">
          <Text fw={600} mb="sm">Contact Support</Text>
          <Text size="sm" c="dimmed">
            If you can&apos;t find what you&apos;re looking for, our support team is available 24/7.
          </Text>
        </Paper>

        <Paper withBorder p="lg" radius="sm">
          <Text fw={600} mb="sm">Community Forum</Text>
          <Text size="sm" c="dimmed">
            Join discussions with other users and get tips from the community.
          </Text>
        </Paper>
      </Stack>

      {/* Footer search card */}
      <Box 
        style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          padding: 24,
          marginTop: 'auto',
        }}
      >
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
          <Text fw={600} size="lg" mb="md">Help Center Search</Text>
          <TextInput
            label="Help center search"
            placeholder="Search help articles…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            leftSection={<IconSearch size={16} />}
            data-testid="search-help"
          />
          <Text size="xs" c="dimmed" mt="xs">
            Query: {value || '—'}
          </Text>
        </Card>
      </Box>
    </Box>
  );
}
