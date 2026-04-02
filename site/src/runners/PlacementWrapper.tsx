'use client';

import React from 'react';
import type { SceneContext } from '@/types';

interface PlacementWrapperProps {
  placement: SceneContext['placement'];
  children: React.ReactNode;
}

/**
 * PlacementWrapper positions the component within the viewport based on placement setting.
 * - center: Component centered in viewport
 * - top_left: Component in top-left corner
 * - top_right: Component in top-right corner
 * - bottom_left: Component in bottom-left corner
 * - bottom_right: Component in bottom-right corner
 */
export function PlacementWrapper({ placement, children }: PlacementWrapperProps) {
  const styles = getPlacementStyles(placement);

  return (
    <div
      style={{
        display: 'flex',
        minHeight: 'calc(100vh - 48px)', // Account for padding
        width: '100%',
        padding: 24,
        boxSizing: 'border-box',
        ...styles,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Get flexbox styles for placement
 */
function getPlacementStyles(placement: SceneContext['placement']): React.CSSProperties {
  switch (placement) {
    case 'top_left':
      return { justifyContent: 'flex-start', alignItems: 'flex-start' };
    case 'top_right':
      return { justifyContent: 'flex-end', alignItems: 'flex-start' };
    case 'bottom_left':
      return { justifyContent: 'flex-start', alignItems: 'flex-end' };
    case 'bottom_right':
      return { justifyContent: 'flex-end', alignItems: 'flex-end' };
    case 'center':
    default:
      return { justifyContent: 'center', alignItems: 'center' };
  }
}

export default PlacementWrapper;
