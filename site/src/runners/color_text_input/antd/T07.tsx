'use client';

/**
 * color_text_input-antd-T07: Open a theme modal and set Header background HEX
 *
 * Layout: modal_flow. The page shows a single 'Customize Theme' button in an isolated card;
 * clicking it opens an AntD Modal dialog.
 *
 * Inside the modal: a small form section labeled 'Header' contains one AntD ColorPicker
 * labeled 'Header background'.
 *
 * Component: ColorPicker uses showText and provides an editable HEX input within its popover.
 *
 * Initial state: Header background starts at #ffffff.
 * Clutter: the modal also contains a disabled 'Reset defaults' button and a non-functional
 * preview thumbnail. Modal footer has 'Cancel' and 'Done' buttons, but they are NOT required for success.
 *
 * Feedback: the header preview area inside the modal updates as soon as the color parses to a valid value.
 *
 * Success: The Header background ColorPicker inside the modal parses to RGBA(245, 245, 245, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, ColorPicker, Typography, Space } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance } from '../types';

const { Text, Title } = Typography;

const TARGET_RGBA = { r: 245, g: 245, b: 245, a: 1 };

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [headerColor, setHeaderColor] = useState<Color | string>('#ffffff');
  const [hasCompleted, setHasCompleted] = useState(false);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    if (typeof headerColor === 'object' && 'toRgb' in headerColor) {
      const rgb = headerColor.toRgb();
      rgba = { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a ?? 1 };
    } else if (typeof headerColor === 'string') {
      const hex = headerColor.replace('#', '');
      if (hex.length === 6) {
        rgba = {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
          a: 1,
        };
      }
    }

    if (isColorWithinTolerance(rgba, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [headerColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getColorString = (): string => {
    if (typeof headerColor === 'object' && 'toHexString' in headerColor) {
      return headerColor.toHexString();
    }
    return headerColor as string;
  };

  return (
    <>
      <Card style={{ width: 300, textAlign: 'center' }} data-testid="theme-card">
        <Button type="primary" onClick={() => setModalOpen(true)} data-testid="customize-theme-btn">
          Customize Theme
        </Button>
      </Card>

      <Modal
        title="Customize Theme"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="done" type="primary" onClick={() => setModalOpen(false)}>
            Done
          </Button>,
        ]}
        data-testid="customize-theme-modal"
      >
        {/* Preview thumbnail */}
        <div
          style={{
            width: '100%',
            height: 60,
            marginBottom: 16,
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            backgroundColor: getColorString(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: getColorString() === '#ffffff' ? '#999' : '#333' }}>
            Header Preview
          </Text>
        </div>

        {/* Header section */}
        <Title level={5} style={{ marginBottom: 12 }}>Header</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text>Header background</Text>
          <ColorPicker
            value={headerColor}
            onChange={setHeaderColor}
            showText
            format="hex"
            data-testid="header-background-picker"
          />
        </div>

        {/* Reset button */}
        <Space style={{ marginTop: 16 }}>
          <Button disabled>Reset defaults</Button>
        </Space>
      </Modal>
    </>
  );
}
