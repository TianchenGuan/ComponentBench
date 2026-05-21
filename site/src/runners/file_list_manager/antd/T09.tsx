'use client';

/**
 * file_list_manager-antd-T09: Remove the image that matches a reference preview
 *
 * setup_description: The page uses a dark theme. A single centered card titled "Images" contains a file list
 * manager specialized for image attachments. At the top of the card, a "Reference preview" panel shows a
 * medium-sized thumbnail (the target image). Below, the image list shows 8 rows with small thumbnails, generic
 * camera filenames (e.g., IMG_1021.jpg, IMG_1022.jpg, ...), and a Remove (trash) icon per row. Removing a row
 * deletes it immediately (no confirmation).
 *
 * Success: The image that matches the Reference preview is removed from the Images list. No other image rows are removed.
 */

import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tooltip, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Reference image is img-1024 (index 3 in the list)
const TARGET_ID = 'img-1024';
const REFERENCE_COLOR = '#45B7D1';

interface ImageFile {
  id: string;
  name: string;
  color: string;
}

const initialImages: ImageFile[] = [
  { id: 'img-1021', name: 'IMG_1021.jpg', color: '#FF6B6B' },
  { id: 'img-1022', name: 'IMG_1022.jpg', color: '#4ECDC4' },
  { id: 'img-1023', name: 'IMG_1023.jpg', color: '#96CEB4' },
  { id: 'img-1024', name: 'IMG_1024.jpg', color: REFERENCE_COLOR }, // Target
  { id: 'img-1025', name: 'IMG_1025.jpg', color: '#FFEAA7' },
  { id: 'img-1026', name: 'IMG_1026.jpg', color: '#DDA0DD' },
  { id: 'img-1027', name: 'IMG_1027.jpg', color: '#98D8C8' },
  { id: 'img-1028', name: 'IMG_1028.jpg', color: '#F7DC6F' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const targetExists = images.some((img) => img.id === TARGET_ID);
    const othersCount = images.filter((img) => img.id !== TARGET_ID).length;

    if (!targetExists && othersCount === 7) {
      setCompleted(true);
      onSuccess();
    }
  }, [images, completed, onSuccess]);

  const handleRemove = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <Card
      title="Images"
      style={{ width: 400, background: '#1f1f1f', borderColor: '#333' }}
      headStyle={{ color: '#fff', borderBottom: '1px solid #333' }}
      data-testid="flm-root"
    >
      {/* Reference preview */}
      <div style={{ marginBottom: 16 }}>
        <Text style={{ color: '#aaa', fontSize: 12 }}>Reference preview</Text>
        <div
          data-testid="ref-preview-1"
          style={{
            width: 120,
            height: 80,
            background: REFERENCE_COLOR,
            borderRadius: 4,
            marginTop: 8,
          }}
        />
      </div>

      {/* Image list */}
      <div data-testid="flm-Images">
        <List
          dataSource={images}
          renderItem={(item) => (
            <List.Item
              data-testid={`flm-row-${item.id}`}
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #333',
              }}
              actions={[
                <Tooltip key="remove" title="Remove">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(item.id)}
                    data-testid="flm-action-remove"
                    style={{ color: '#ff4d4f' }}
                  />
                </Tooltip>,
              ]}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 30,
                    background: item.color,
                    borderRadius: 4,
                  }}
                  data-testid={`flm-thumbnail-${item.id}`}
                />
                <Text style={{ color: '#ddd' }}>{item.name}</Text>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
}
