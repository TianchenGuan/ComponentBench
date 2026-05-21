'use client';

/**
 * slider_range-mantine-T10: Invert track in dark modal and Save changes
 * 
 * Layout: modal_flow. The main page shows a button labeled "Advanced grading".
 * Clicking opens a modal titled "Advanced grading" using a dark theme (dark background, light text).
 * Inside the modal there is one Mantine RangeSlider labeled "Grade window".
 * - Slider configuration: min=0, max=100, step=1, inverted=true (the filled track is inverted compared to the default appearance).
 * - Initial state: Selected is 40-80, shown in a readout "Selected: 40 - 80".
 * Changes are considered pending until the user clicks "Save" in the modal footer. "Cancel" closes the modal without committing.
 * No other interactive elements in the modal besides the slider and footer buttons.
 * 
 * Success: Target range is set to 60-90 pts (both thumbs), require_confirm: true with Save.
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Text, RangeSlider, Group, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<[number, number]>([40, 80]);
  const [appliedValue, setAppliedValue] = useState<[number, number]>([40, 80]);

  useEffect(() => {
    if (appliedValue[0] === 60 && appliedValue[1] === 90) {
      onSuccess();
    }
  }, [appliedValue, onSuccess]);

  const handleSave = () => {
    setAppliedValue(pendingValue);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setPendingValue([40, 80]);
    setModalOpen(false);
  };

  const handleOpen = () => {
    setPendingValue([40, 80]);
    setModalOpen(true);
  };

  return (
    <div>
      <Text c="dimmed" size="sm" mb="md">
        Applied: {appliedValue[0]} - {appliedValue[1]}
      </Text>
      <Button onClick={handleOpen}>
        Advanced grading
      </Button>

      <MantineProvider forceColorScheme="dark">
        <Modal
          opened={modalOpen}
          onClose={handleCancel}
          title="Advanced grading"
          centered
          styles={{
            content: { backgroundColor: '#1a1b1e' },
            header: { backgroundColor: '#1a1b1e' },
          }}
        >
          <Text size="sm" mb="md" c="white">Grade window (inverted)</Text>
          <RangeSlider
            value={pendingValue}
            onChange={setPendingValue}
            min={0}
            max={100}
            step={1}
            inverted
            data-testid="grade-window-range"
            mb="md"
          />
          <Text c="dimmed" size="sm" mb="lg">
            Selected: {pendingValue[0]} - {pendingValue[1]}
          </Text>
          <Group justify="flex-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </Group>
        </Modal>
      </MantineProvider>
    </div>
  );
}
