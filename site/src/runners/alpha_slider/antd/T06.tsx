'use client';

/**
 * alpha_slider-antd-T06: Set tooltip opacity in a modal and apply
 *
 * The page shows a centered button "Edit Tooltip Style". Clicking it opens an AntD Modal (modal_flow):
 * - Inside the modal, there is a ColorPicker control labeled "Tooltip background".
 * - The ColorPicker opens a popup panel (within the modal) that includes the Opacity slider labeled "Opacity" with a percent readout.
 * - The modal footer contains two buttons: "Cancel" and a primary button "Apply".
 * Initial state:
 * - Tooltip background opacity is currently 100% in the live preview behind the modal.
 * Feedback and commit behavior:
 * - Adjusting opacity updates the color inside the modal immediately, but the live tooltip preview outside the modal updates ONLY after clicking "Apply".
 * - Clicking "Cancel" closes the modal and discards changes.
 *
 * Success: The committed tooltip background alpha is 0.70 (70% opacity). Alpha must be within ±0.015 of the target value.
 * The modal 'Apply' button must be clicked to commit the value.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Button, Modal } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [committedColor, setCommittedColor] = useState<string>('rgba(0, 0, 0, 1)');
  const [draftColor, setDraftColor] = useState<Color | string>('rgba(0, 0, 0, 1)');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const match = committedColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
    const alpha = match ? parseFloat(match[1]) : 1;

    if (isAlphaWithinTolerance(alpha, 0.7, 0.015)) {
      onSuccess();
    }
  }, [committedColor, onSuccess]);

  const handleOpenModal = () => {
    setDraftColor(committedColor);
    setModalOpen(true);
  };

  const handleApply = () => {
    const colorStr = typeof draftColor === 'string' 
      ? draftColor 
      : draftColor && 'toRgbString' in draftColor 
        ? draftColor.toRgbString() 
        : committedColor;
    setCommittedColor(colorStr);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const getDraftAlphaPercent = (): number => {
    if (typeof draftColor === 'string') {
      const match = draftColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      return match ? Math.round(parseFloat(match[1]) * 100) : 100;
    } else if (draftColor && typeof draftColor === 'object' && 'toRgb' in draftColor) {
      const rgb = draftColor.toRgb();
      return Math.round((rgb.a ?? 1) * 100);
    }
    return 100;
  };

  return (
    <Card style={{ width: 400, textAlign: 'center' }}>
      {/* Live preview */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: committedColor,
            color: '#fff',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          Tooltip preview
        </div>
      </div>

      <Button type="primary" onClick={handleOpenModal} data-testid="edit-tooltip-style">
        Edit Tooltip Style
      </Button>

      <Modal
        title="Tooltip Style"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply} data-testid="apply-button">
            Apply
          </Button>,
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <Text>Tooltip background</Text>
          <ColorPicker
            value={draftColor}
            onChange={setDraftColor}
            showText={() => `${getDraftAlphaPercent()}%`}
            data-testid="tooltip-bg-color-picker"
          />
        </div>
      </Modal>
    </Card>
  );
}
