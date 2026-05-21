'use client';

/**
 * toggle_button-antd-T03: Favorite (heart) toggle on with nearby actions
 *
 * Layout: isolated_card in the center. Light theme, comfortable spacing, default scale. Clutter is low.
 *
 * The card title is "Photo actions". Inside the card is a small horizontal toolbar with three AntD Buttons:
 * 1) "Download" (regular action button, not a toggle)
 * 2) "Share" (regular action button, not a toggle)
 * 3) "Favorite" (heart icon + text) — this is the ONLY toggle button and is the target.
 *
 * The Favorite button uses toggle semantics:
 * - aria-pressed toggles true/false
 * - Off = default/outline styling
 * - On = filled/primary styling and the helper text below updates to "Favorite: On"
 *
 * Initial state: Favorite is Off. The other two buttons do nothing relevant to success.
 */

import React, { useState } from 'react';
import { Card, Button, Space } from 'antd';
import { HeartOutlined, HeartFilled, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [pressed, setPressed] = useState(false);

  const handleFavoriteClick = () => {
    const newPressed = !pressed;
    setPressed(newPressed);
    if (newPressed) {
      onSuccess();
    }
  };

  return (
    <Card title="Photo actions" style={{ width: 450 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Space>
          <Button icon={<DownloadOutlined />}>Download</Button>
          <Button icon={<ShareAltOutlined />}>Share</Button>
          <Button
            type={pressed ? 'primary' : 'default'}
            icon={pressed ? <HeartFilled /> : <HeartOutlined />}
            onClick={handleFavoriteClick}
            aria-pressed={pressed}
            data-testid="favorite-toggle"
          >
            Favorite
          </Button>
        </Space>
        <div style={{ fontSize: 12, color: '#999' }}>
          Favorite: {pressed ? 'On' : 'Off'}
        </div>
      </div>
    </Card>
  );
}
