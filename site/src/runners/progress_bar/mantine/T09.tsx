'use client';

/**
 * progress_bar-mantine-T09: Dark settings panel: run Uploads check to 90%
 *
 * Layout: settings_panel with dark theme. The page shows a right-side main panel titled 
 * "Storage checks" with multiple sections and switches.
 *
 * Target components (instances=2):
 * - Section "Uploads check" (TARGET): includes a Mantine Progress bar labeled "Uploads progress" 
 *   and a "Run check" button.
 * - Section "Downloads check" (distractor): includes a similar Progress bar labeled 
 *   "Downloads progress" and its own "Run check" button.
 *
 * Initial state:
 * - Both progress bars start at 0% and idle.
 *
 * Interaction:
 * - Clicking "Run check" in a section starts that section's progress increasing and auto-pauses at 90%.
 *
 * Success: "Uploads progress" value within ±1% of 90% and stable for 0.8 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Switch, MantineProvider, createTheme } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  primaryColor: 'blue',
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [uploadsProgress, setUploadsProgress] = useState(0);
  const [downloadsProgress, setDownloadsProgress] = useState(0);
  const [uploadsRunning, setUploadsRunning] = useState(false);
  const [downloadsRunning, setDownloadsRunning] = useState(false);
  const uploadsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const downloadsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: Uploads within ±1% of 90% and stable for 0.8 seconds
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!uploadsRunning && uploadsProgress >= 89 && uploadsProgress <= 91 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 800);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [uploadsProgress, uploadsRunning, onSuccess]);

  useEffect(() => {
    return () => {
      if (uploadsIntervalRef.current) clearInterval(uploadsIntervalRef.current);
      if (downloadsIntervalRef.current) clearInterval(downloadsIntervalRef.current);
    };
  }, []);

  const handleRunUploads = () => {
    setUploadsRunning(true);
    uploadsIntervalRef.current = setInterval(() => {
      setUploadsProgress((prev) => {
        if (prev >= 90) {
          clearInterval(uploadsIntervalRef.current!);
          setUploadsRunning(false);
          return 90;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handleRunDownloads = () => {
    setDownloadsRunning(true);
    downloadsIntervalRef.current = setInterval(() => {
      setDownloadsProgress((prev) => {
        if (prev >= 90) {
          clearInterval(downloadsIntervalRef.current!);
          setDownloadsRunning(false);
          return 90;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <MantineProvider defaultColorScheme="dark" theme={darkTheme}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: 450, background: '#1a1b1e' }}
      >
        <Stack gap="lg">
          <Text fw={600} size="lg" c="white">Storage checks</Text>

          {/* Uploads check section */}
          <div data-testid="uploads-check">
            <Text fw={500} size="sm" c="white" mb={8}>Uploads check</Text>
            <Group gap="sm" align="center" mb={8}>
              <Progress
                value={uploadsProgress}
                aria-label="Uploads progress"
                data-testid="uploads-progress"
                style={{ flex: 1 }}
              />
              <Text size="sm" c="dimmed">{uploadsProgress}%</Text>
            </Group>
            {uploadsProgress >= 90 && !uploadsRunning && (
              <Text size="xs" c="dimmed" mb={8}>Paused at 90%</Text>
            )}
            <Button
              size="sm"
              onClick={handleRunUploads}
              disabled={uploadsRunning || uploadsProgress >= 90}
            >
              Run check
            </Button>
          </div>

          {/* Downloads check section (distractor) */}
          <div data-testid="downloads-check">
            <Text fw={500} size="sm" c="white" mb={8}>Downloads check</Text>
            <Group gap="sm" align="center" mb={8}>
              <Progress
                value={downloadsProgress}
                aria-label="Downloads progress"
                data-testid="downloads-progress"
                style={{ flex: 1 }}
              />
              <Text size="sm" c="dimmed">{downloadsProgress}%</Text>
            </Group>
            <Button
              size="sm"
              onClick={handleRunDownloads}
              disabled={downloadsRunning || downloadsProgress >= 90}
            >
              Run check
            </Button>
          </div>

          {/* Settings switches */}
          <Stack gap="xs" style={{ paddingTop: 16, borderTop: '1px solid #373a40' }}>
            <Switch label="Run nightly" />
            <Switch label="Send notifications" />
          </Stack>
        </Stack>
      </Card>
    </MantineProvider>
  );
}
