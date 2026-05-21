'use client';

/**
 * toggle_button-mantine-T27: Disable microphone in dark compact control bar (3 ActionIcons)
 *
 * Layout: isolated_card centered. Theme is dark with compact spacing and small-scale controls.
 * Clutter is low (only a short status line below).
 *
 * The "Meeting controls" card contains a horizontal row of three Mantine ActionIcon toggle buttons:
 * - Camera (aria-label "Camera")
 * - Microphone (aria-label "Microphone")  ← target
 * - Screen share (aria-label "Screen share")
 *
 * Each ActionIcon behaves as a toggle button:
 * - aria-pressed indicates state
 * - Off = subtle/dim background
 * - On = filled/high-contrast background (using data-active styling)
 *
 * Initial state: Microphone is On; Camera is Off; Screen share is Off.
 * The small size and dark theme make it harder to visually distinguish states and hit the correct icon.
 */

import React, { useState } from 'react';
import { Card, Text, Group, ActionIcon } from '@mantine/core';
import { IconCamera, IconCameraOff, IconMicrophone, IconMicrophoneOff, IconScreenShare, IconScreenShareOff } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [camera, setCamera] = useState(false);
  const [microphone, setMicrophone] = useState(true); // Initial: On
  const [screenShare, setScreenShare] = useState(false);

  const handleCamera = () => setCamera(!camera);
  const handleScreenShare = () => setScreenShare(!screenShare);
  
  const handleMicrophone = () => {
    const newMic = !microphone;
    setMicrophone(newMic);
    if (!newMic) {
      // Success when turned OFF
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">Meeting controls</Text>
      
      <Group gap="xs">
        <ActionIcon
          variant={camera ? 'filled' : 'subtle'}
          color={camera ? 'blue' : 'gray'}
          size="md"
          onClick={handleCamera}
          aria-pressed={camera}
          aria-label="Camera"
          data-testid="camera-toggle"
        >
          {camera ? <IconCamera size={18} /> : <IconCameraOff size={18} />}
        </ActionIcon>

        <ActionIcon
          variant={microphone ? 'filled' : 'subtle'}
          color={microphone ? 'blue' : 'gray'}
          size="md"
          onClick={handleMicrophone}
          aria-pressed={microphone}
          aria-label="Microphone"
          data-testid="microphone-toggle"
        >
          {microphone ? <IconMicrophone size={18} /> : <IconMicrophoneOff size={18} />}
        </ActionIcon>

        <ActionIcon
          variant={screenShare ? 'filled' : 'subtle'}
          color={screenShare ? 'blue' : 'gray'}
          size="md"
          onClick={handleScreenShare}
          aria-pressed={screenShare}
          aria-label="Screen share"
          data-testid="screen-share-toggle"
        >
          {screenShare ? <IconScreenShare size={18} /> : <IconScreenShareOff size={18} />}
        </ActionIcon>
      </Group>

      <Text size="xs" c="dimmed" mt="md">
        Microphone: {microphone ? 'On' : 'Off'}
      </Text>
    </Card>
  );
}
