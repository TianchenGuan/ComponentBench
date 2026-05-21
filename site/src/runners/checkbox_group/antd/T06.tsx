'use client';

/**
 * checkbox_group-antd-T06: Match the Target mix preview (Genres)
 *
 * Scene: light theme; comfortable spacing; a single isolated card centered in the viewport.
 * Centered isolated card titled "Playlist builder" in a light theme.
 * The card is split into two columns:
 * - Left column: one AntD Checkbox.Group labeled "Genres".
 * - Right column: a "Target mix" preview box.
 * Genres checkbox options each include a small emoji icon before the label:
 * - 🎸 Rock, 🎹 Jazz, 🎻 Classical, 🎧 Electronic, 🎤 Pop, 🥁 Hip-hop, 🎺 Blues, 🎵 Country
 * Initial state: Rock is checked by default; all others are unchecked.
 * The "Target mix" preview shows three icon-only chips (🎹, 🎧, 🎤) corresponding to Jazz, Electronic, Pop.
 * Success: The 'Genres' checkbox group has Jazz, Electronic, Pop checked. No extra genres are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const genreOptions = [
  { value: 'Rock', icon: '🎸' },
  { value: 'Jazz', icon: '🎹' },
  { value: 'Classical', icon: '🎻' },
  { value: 'Electronic', icon: '🎧' },
  { value: 'Pop', icon: '🎤' },
  { value: 'Hip-hop', icon: '🥁' },
  { value: 'Blues', icon: '🎺' },
  { value: 'Country', icon: '🎵' },
];

// Target: Jazz, Electronic, Pop
const targetGenres = ['Jazz', 'Electronic', 'Pop'];
const targetIcons = ['🎹', '🎧', '🎤'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Rock']);

  useEffect(() => {
    const targetSet = new Set(targetGenres);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Playlist builder" style={{ width: 550 }}>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Left column: Genres checkbox group */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Genres</Text>
          <Checkbox.Group
            data-testid="cg-genres"
            value={selected}
            onChange={(checkedValues) => setSelected(checkedValues as string[])}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {genreOptions.map(option => (
                <Checkbox key={option.value} value={option.value}>
                  {option.icon} {option.value}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Right column: Target mix preview */}
        <div style={{ flex: 1 }}>
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Target mix</Text>
          <div style={{ 
            padding: 16, 
            background: '#f5f5f5', 
            borderRadius: 8,
            border: '1px dashed #d9d9d9'
          }}>
            <Space size="middle">
              {targetIcons.map((icon, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    width: 40, 
                    height: 40, 
                    background: '#fff',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    border: '1px solid #e8e8e8'
                  }}
                >
                  {icon}
                </div>
              ))}
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
}
