'use client';

/**
 * meter-mantine-T10: Drag small Upload Limit meter in drawer to 55% and Apply (Mantine)
 *
 * Setup Description:
 * A drawer_flow scene begins with a "Open limits" button in a settings panel.
 * - Layout: drawer_flow; a right-side drawer contains the meters.
 * - Spacing/scale: compact spacing and small scale inside the drawer (short, thin bars).
 * - Clutter: low (drawer includes a couple of informational labels and an Apply/Cancel footer).
 * - Component: Mantine Progress meters used as meters.
 * - Instances: 2 meters inside the drawer:
 *   * "Upload Limit" (interactive target)
 *   * "Download Limit" (interactive distractor)
 * - Interaction:
 *   * Open the drawer.
 *   * Drag along the Upload Limit bar to adjust value continuously.
 *   * Release to set the pending value.
 *   * Click "Apply" to commit.
 * - Observability: numeric labels are small and appear only while dragging (they fade after 1s). 
 *   Hovering shows the value again.
 * - Initial state: Upload Limit=20%, Download Limit=80%.
 * - Feedback: after Apply, the drawer closes and a toast "Limits saved" appears.
 *
 * Success: Upload Limit committed value is 55% (±1 percentage point). Apply has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Group, Stack, Button, Drawer, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadLimit, setUploadLimit] = useState(20);
  const [downloadLimit, setDownloadLimit] = useState(80);
  const [committedUpload, setCommittedUpload] = useState(20);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(committedUpload - 55) <= 1 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [committedUpload, onSuccess]);

  const handleOpenDrawer = () => {
    setUploadLimit(committedUpload);
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setCommittedUpload(uploadLimit);
    setIsDrawerOpen(false);
    notifications.show({
      title: 'Success',
      message: 'Limits saved',
      color: 'green',
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, target: string) => {
    setIsDragging(true);
    setDragTarget(target);
    updateValue(e, target);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragTarget) return;
    updateValue(e, dragTarget);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  const updateValue = (e: React.MouseEvent<HTMLDivElement>, target: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (target === 'upload') {
      setUploadLimit(clampedPercent);
    } else if (target === 'download') {
      setDownloadLimit(clampedPercent);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350, textAlign: 'center' }}>
        <Stack gap="md">
          <Text fw={600} size="lg">Settings</Text>
          <Button onClick={handleOpenDrawer} data-testid="open-limits">
            Open limits
          </Button>
        </Stack>
      </Card>

      <Drawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Bandwidth Limits"
        position="right"
        size="sm"
      >
        <Stack gap="md" style={{ height: '100%' }}>
          <Text size="xs" c="dimmed">
            Drag the bars to adjust bandwidth limits. Click Apply to save changes.
          </Text>

          {/* Upload Limit meter */}
          <div>
            <Text size="sm" fw={500} mb={4}>Upload Limit</Text>
            <Tooltip label={`${uploadLimit}%`}>
              <div
                onMouseDown={(e) => handleMouseDown(e, 'upload')}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                data-testid="meter-upload"
                data-instance-label="Upload Limit"
                data-meter-value={uploadLimit}
                role="meter"
                aria-valuenow={uploadLimit}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Upload Limit"
              >
                <Progress value={uploadLimit} size="sm" />
              </div>
            </Tooltip>
            {isDragging && dragTarget === 'upload' && (
              <Text size="xs" c="dimmed" mt={2}>{uploadLimit}%</Text>
            )}
          </div>

          {/* Download Limit meter */}
          <div>
            <Text size="sm" fw={500} mb={4}>Download Limit</Text>
            <Tooltip label={`${downloadLimit}%`}>
              <div
                onMouseDown={(e) => handleMouseDown(e, 'download')}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                data-testid="meter-download"
                data-instance-label="Download Limit"
                data-meter-value={downloadLimit}
                role="meter"
                aria-valuenow={downloadLimit}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Download Limit"
              >
                <Progress value={downloadLimit} size="sm" />
              </div>
            </Tooltip>
            {isDragging && dragTarget === 'download' && (
              <Text size="xs" c="dimmed" mt={2}>{downloadLimit}%</Text>
            )}
          </div>

          <div style={{ flex: 1 }} />

          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} data-testid="limits-apply">
              Apply
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </>
  );
}
