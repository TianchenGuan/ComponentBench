'use client';

/**
 * alpha_slider-mantine-T09: Set scrim opacity in modal via ColorInput and save
 *
 * A modal workflow for editing a scrim color:
 * - Main page shows a button "Edit scrim".
 * - Clicking opens a modal titled "Scrim settings".
 * - Inside the modal is a Mantine ColorInput labeled "Scrim color" (configured in RGBA so alpha is available).
 * - Clicking the ColorInput swatch opens its dropdown/popover with a ColorPicker that includes an alpha slider.
 * - Modal footer has "Cancel" and a primary "Save" button.
 * Commit behavior:
 * - Changes are considered draft while the modal is open; the committed scrim preview updates only after clicking Save.
 * Initial state:
 * - Committed scrim alpha is 1.00 before opening.
 *
 * Success: The committed scrim alpha is set to 0.33 (33% opacity). Alpha must be within ±0.01 of the target value.
 * The modal 'Save' button must be clicked to commit the value.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Modal, ColorInput, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [committedColor, setCommittedColor] = useState('rgba(0, 0, 0, 1)');
  const [draftColor, setDraftColor] = useState('rgba(0, 0, 0, 1)');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const match = committedColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    const alpha = match ? parseFloat(match[1]) : 1;

    if (isAlphaWithinTolerance(alpha, 0.33, 0.01)) {
      onSuccess();
    }
  }, [committedColor, onSuccess]);

  const handleOpen = () => {
    setDraftColor(committedColor);
    setModalOpen(true);
  };

  const handleSave = () => {
    setCommittedColor(draftColor);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400, textAlign: 'center' }}>
      {/* Live preview */}
      <div
        style={{
          width: '100%',
          height: 100,
          marginBottom: 16,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          borderRadius: 8,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: committedColor,
            borderRadius: 8,
          }}
        />
      </div>

      <Text size="sm" c="dimmed" mb="md">Scrim preview</Text>

      <Button onClick={handleOpen} data-testid="edit-scrim-button">
        Edit scrim
      </Button>

      <Modal
        opened={modalOpen}
        onClose={handleCancel}
        title="Scrim settings"
      >
        <ColorInput
          label="Scrim color"
          format="rgba"
          value={draftColor}
          onChange={setDraftColor}
          mb="lg"
          data-testid="scrim-color-input"
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="save-button">
            Save
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
