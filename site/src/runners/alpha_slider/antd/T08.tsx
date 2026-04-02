'use client';

/**
 * alpha_slider-antd-T08: Set Secondary overlay opacity to 20% among three tiles
 *
 * A dashboard-style page shows three tiles in a grid (clutter high):
 * - Tile 1: "Primary overlay" with a preview card and an AntD ColorPicker control.
 * - Tile 2: "Secondary overlay" with a preview card and an AntD ColorPicker control. (THIS is the target.)
 * - Tile 3: "Danger overlay" with a preview card and an AntD ColorPicker control.
 * Each tile's ColorPicker opens a popup panel that includes an Opacity slider labeled "Opacity".
 * Initial state:
 * - Primary overlay opacity = 80%.
 * - Secondary overlay opacity = 50%.
 * - Danger overlay opacity = 90%.
 * Distractors:
 * - Each tile also contains unrelated buttons (e.g., "Preview", "Reset layout") and small KPI badges.
 * - The three ColorPicker triggers look very similar; only the tile header text distinguishes them.
 *
 * Success: Only the 'Secondary overlay' instance has alpha set to 0.20 (20% opacity).
 * Alpha must be within ±0.01 of the target value. The correct instance must be modified.
 */

import React, { useState, useEffect } from 'react';
import { Card, ColorPicker, Typography, Button, Badge } from 'antd';
import type { Color } from 'antd/es/color-picker';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const { Text } = Typography;

interface OverlayTileProps {
  title: string;
  color: Color | string;
  onChange: (c: Color | string) => void;
  badge: number;
  testId: string;
}

function OverlayTile({ title, color, onChange, badge, testId }: OverlayTileProps) {
  const getColorString = (): string => {
    if (typeof color === 'string') return color;
    if (color && typeof color === 'object' && 'toRgbString' in color) {
      return color.toRgbString();
    }
    return 'rgba(0,0,0,0.5)';
  };

  const getAlphaPercent = (): number => {
    if (typeof color === 'string') {
      const match = color.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      return match ? Math.round(parseFloat(match[1]) * 100) : 100;
    } else if (color && typeof color === 'object' && 'toRgb' in color) {
      const rgb = color.toRgb();
      return Math.round((rgb.a ?? 1) * 100);
    }
    return 100;
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{title}</span>
          <Badge count={badge} style={{ backgroundColor: '#52c41a' }} />
        </div>
      }
      style={{ width: 240 }}
      size="small"
    >
      {/* Preview */}
      <div
        style={{
          width: '100%',
          height: 60,
          marginBottom: 12,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
          borderRadius: 4,
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: getColorString(),
            borderRadius: 4,
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 12 }}>Color</Text>
        <ColorPicker 
          value={color} 
          onChange={onChange} 
          size="small"
          showText={() => `${getAlphaPercent()}%`}
          data-testid={testId}
        />
      </div>

      {/* Distractor buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button size="small" style={{ flex: 1 }}>Preview</Button>
        <Button size="small" style={{ flex: 1 }}>Reset</Button>
      </div>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryColor, setPrimaryColor] = useState<Color | string>('rgba(22, 119, 255, 0.8)');
  const [secondaryColor, setSecondaryColor] = useState<Color | string>('rgba(82, 196, 26, 0.5)');
  const [dangerColor, setDangerColor] = useState<Color | string>('rgba(245, 34, 45, 0.9)');

  useEffect(() => {
    let alpha = 0.5;
    if (typeof secondaryColor === 'string') {
      const match = secondaryColor.match(/rgba?\([^)]+,\s*([\d.]+)\)/);
      if (match) alpha = parseFloat(match[1]);
    } else if (secondaryColor && typeof secondaryColor === 'object' && 'toRgb' in secondaryColor) {
      const rgb = secondaryColor.toRgb();
      alpha = rgb.a ?? 1;
    }

    if (isAlphaWithinTolerance(alpha, 0.2, 0.01)) {
      onSuccess();
    }
  }, [secondaryColor, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
      <OverlayTile 
        title="Primary overlay" 
        color={primaryColor} 
        onChange={setPrimaryColor}
        badge={42}
        testId="primary-overlay-picker"
      />
      <OverlayTile 
        title="Secondary overlay" 
        color={secondaryColor} 
        onChange={setSecondaryColor}
        badge={18}
        testId="secondary-overlay-picker"
      />
      <OverlayTile 
        title="Danger overlay" 
        color={dangerColor} 
        onChange={setDangerColor}
        badge={7}
        testId="danger-overlay-picker"
      />
    </div>
  );
}
