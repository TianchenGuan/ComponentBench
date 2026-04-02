'use client';

/**
 * icon_button-antd-T02: Toggle Favorite on (star icon)
 *
 * Layout: isolated_card centered in the viewport.
 * A card titled "Document actions" shows the document name "Quarterly Summary". 
 * To the right of the "Favorite" row there is a single icon-only AntD Button (type="text") 
 * showing a star outline icon. The row also contains a status text "Favorite: Off/On".
 * 
 * Success: The star icon button has aria-pressed="true" (Favorite is On).
 */

import React, { useState } from 'react';
import { Button, Card } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (newState) {
      onSuccess();
    }
  };

  return (
    <Card title="Document actions" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <strong>Document:</strong> "Quarterly Summary"
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Favorite: {isFavorite ? 'On' : 'Off'}</span>
        <Button
          type="text"
          icon={isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={handleToggle}
          aria-pressed={isFavorite}
          aria-label="Favorite"
          data-testid="antd-icon-btn-favorite"
        />
      </div>
    </Card>
  );
}
