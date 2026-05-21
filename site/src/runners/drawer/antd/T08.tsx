'use client';

/**
 * drawer-antd-T08: Open the drawer that matches a visual icon reference (3 instances)
 *
 * Layout: isolated_card centered with comfortable spacing. Clutter: none beyond the preview and the three triggers; the card contains several similar-looking icon buttons.
 *
 * On the card:
 * - A small "Target preview" tile shows a single icon (e.g., a bell) with no text label.
 * - Below it are three icon-only buttons (same size and style) that open three different AntD Drawers:
 *   1) Drawer A: header icon = star, title text "Panel"
 *   2) Drawer B: header icon = bell, title text "Panel"
 *   3) Drawer C: header icon = gear, title text "Panel"
 * All three drawers share the same visible title text to force reliance on the icon.
 *
 * Initial state:
 * - All drawers are CLOSED.
 *
 * Target component(s):
 * - Three separate AntD Drawer instances (same canonical type) with a mask and header close (X) icon.
 * - Only one drawer should be open at a time; opening one closes any previously open drawer.
 *
 * Feedback:
 * - Opening a drawer slides it in from the right and updates the header icon, which should match the target preview.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Space } from 'antd';
import { StarOutlined, BellOutlined, SettingOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

type DrawerType = 'star' | 'bell' | 'gear' | null;

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [openDrawer, setOpenDrawer] = useState<DrawerType>(null);
  const successCalledRef = useRef(false);

  // Target is the bell drawer (Drawer B)
  useEffect(() => {
    if (openDrawer === 'bell' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openDrawer, onSuccess]);

  const handleOpenDrawer = (type: DrawerType) => {
    setOpenDrawer(type);
  };

  return (
    <Card style={{ width: 350 }}>
      <Space direction="vertical" style={{ width: '100%' }} align="center">
        {/* Target preview */}
        <div style={{ border: '1px dashed #d9d9d9', padding: 16, borderRadius: 4, textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
            Target preview
          </Text>
          <BellOutlined style={{ fontSize: 32, color: '#1677ff' }} />
        </div>

        {/* Icon buttons */}
        <Space size="large" style={{ marginTop: 16 }}>
          <Button
            icon={<StarOutlined />}
            shape="circle"
            size="large"
            onClick={() => handleOpenDrawer('star')}
            data-testid="open-a"
          />
          <Button
            icon={<BellOutlined />}
            shape="circle"
            size="large"
            onClick={() => handleOpenDrawer('bell')}
            data-testid="open-b"
          />
          <Button
            icon={<SettingOutlined />}
            shape="circle"
            size="large"
            onClick={() => handleOpenDrawer('gear')}
            data-testid="open-c"
          />
        </Space>
      </Space>

      {/* Drawer A - Star */}
      <Drawer
        title={
          <Space>
            <StarOutlined />
            <span>Panel</span>
          </Space>
        }
        placement="right"
        onClose={() => setOpenDrawer(null)}
        open={openDrawer === 'star'}
        data-testid="drawer-a"
      >
        <Text>This is the Star panel.</Text>
      </Drawer>

      {/* Drawer B - Bell (target) */}
      <Drawer
        title={
          <Space>
            <BellOutlined />
            <span>Panel</span>
          </Space>
        }
        placement="right"
        onClose={() => setOpenDrawer(null)}
        open={openDrawer === 'bell'}
        data-testid="drawer-b"
      >
        <Text>This is the Bell panel.</Text>
      </Drawer>

      {/* Drawer C - Gear */}
      <Drawer
        title={
          <Space>
            <SettingOutlined />
            <span>Panel</span>
          </Space>
        }
        placement="right"
        onClose={() => setOpenDrawer(null)}
        open={openDrawer === 'gear'}
        data-testid="drawer-c"
      >
        <Text>This is the Settings panel.</Text>
      </Drawer>
    </Card>
  );
}
