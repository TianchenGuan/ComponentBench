'use client';

/**
 * slider_single-mantine-T05: Open Threshold modal and set to 0.70
 * 
 * Layout: modal_flow with a centered card titled "Threshold".
 * The card has a primary button labeled "Set threshold…" that opens a Mantine Modal dialog.
 * Inside the modal is one Mantine Slider labeled "Threshold".
 * Configuration: range 0.00–1.00, step=0.05. The slider label formats values to two decimals.
 * Initial state when modal opens: Threshold is 0.50.
 * Feedback: Mantine shows the value in a floating label while dragging; a small text "Selected: 0.xx" is shown under the slider in the modal.
 * There is a Close (X) icon for the modal, but no Apply/Cancel; the value is committed immediately as it changes.
 * 
 * Success: The 'Threshold' slider value equals 0.70 (step=0.05).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Slider, Button, Modal } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState(0.50);

  useEffect(() => {
    if (Math.abs(value - 0.70) < 0.001) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleOpen = () => {
    setValue(0.50);
    setModalOpen(true);
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Threshold</Text>
        <Text c="dimmed" size="sm" mb="md">
          Current: {value.toFixed(2)}
        </Text>
        <Button onClick={handleOpen} data-testid="btn-open-threshold-modal">
          Set threshold…
        </Button>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Set Threshold"
        centered
      >
        <Text fw={500} size="sm" mb="lg">Threshold</Text>
        <Slider
          value={value}
          onChange={setValue}
          min={0}
          max={1}
          step={0.05}
          label={(v) => v.toFixed(2)}
          data-testid="slider-threshold"
          mb="md"
        />
        <Text c="dimmed" size="sm">
          Selected: {value.toFixed(2)}
        </Text>
      </Modal>
    </>
  );
}
