'use client';

/**
 * file_list_manager-mantine-T08: Mark the visually-matching image as Primary in dark theme
 *
 * setup_description: The page uses a dark theme. A centered card titled "Images" shows a Reference preview panel
 * at the top with a medium thumbnail (the target). Below is a list of 10 image files with small thumbnails and
 * a star ActionIcon per row. Exactly one file can be Primary; the active Primary has a filled star. Initially,
 * a different image is Primary.
 *
 * Success: The image that matches the Reference preview is set as Primary (filled star) in the Images list.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, ActionIcon, MantineProvider, createTheme } from '@mantine/core';
import { IconStar, IconStarFilled } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Reference image is img-05 (index 4 in the list)
const TARGET_ID = 'img-05';
const REFERENCE_COLOR = '#FFEAA7';

const darkTheme = createTheme({
  primaryColor: 'blue',
});

interface ImageFile {
  id: string;
  name: string;
  color: string;
  primary: boolean;
}

const initialImages: ImageFile[] = [
  { id: 'img-01', name: 'IMG_0101.jpg', color: '#FF6B6B', primary: false },
  { id: 'img-02', name: 'IMG_0102.jpg', color: '#4ECDC4', primary: true }, // Initial primary
  { id: 'img-03', name: 'IMG_0103.jpg', color: '#96CEB4', primary: false },
  { id: 'img-04', name: 'IMG_0104.jpg', color: '#45B7D1', primary: false },
  { id: 'img-05', name: 'IMG_0105.jpg', color: REFERENCE_COLOR, primary: false }, // Target
  { id: 'img-06', name: 'IMG_0106.jpg', color: '#DDA0DD', primary: false },
  { id: 'img-07', name: 'IMG_0107.jpg', color: '#98D8C8', primary: false },
  { id: 'img-08', name: 'IMG_0108.jpg', color: '#F7DC6F', primary: false },
  { id: 'img-09', name: 'IMG_0109.jpg', color: '#BB8FCE', primary: false },
  { id: 'img-10', name: 'IMG_0110.jpg', color: '#85C1E9', primary: false },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;

    const targetImage = images.find((img) => img.id === TARGET_ID);
    if (targetImage && targetImage.primary) {
      setCompleted(true);
      onSuccess();
    }
  }, [images, completed, onSuccess]);

  const handleSetPrimary = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({ ...img, primary: img.id === imageId }))
    );
  };

  return (
    <MantineProvider theme={darkTheme} forceColorScheme="dark">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        w={400}
        style={{ backgroundColor: '#1a1a1a' }}
        data-testid="flm-root"
      >
        <Text fw={500} size="lg" mb="md" c="white">Images</Text>

        {/* Reference preview */}
        <div style={{ marginBottom: 16 }}>
          <Text size="xs" c="dimmed">Reference preview</Text>
          <div
            data-testid="ref-preview-1"
            style={{
              width: 100,
              height: 70,
              background: REFERENCE_COLOR,
              borderRadius: 4,
              marginTop: 8,
            }}
          />
        </div>

        {/* Image list */}
        <div data-testid="flm-Images">
          {images.map((image) => (
            <div
              key={image.id}
              data-testid={`flm-row-${image.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 0',
                borderBottom: '1px solid #333',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 26,
                  background: image.color,
                  borderRadius: 4,
                }}
                data-testid={`flm-thumbnail-${image.id}`}
              />
              <Text size="sm" c="white" style={{ flex: 1 }}>{image.name}</Text>
              <ActionIcon
                variant="subtle"
                onClick={() => handleSetPrimary(image.id)}
                aria-label="Set primary"
                data-testid={`flm-star-${image.id}`}
              >
                {image.primary ? (
                  <IconStarFilled size={18} color="#faad14" />
                ) : (
                  <IconStar size={18} color="#888" />
                )}
              </ActionIcon>
            </div>
          ))}
        </div>
      </Card>
    </MantineProvider>
  );
}
