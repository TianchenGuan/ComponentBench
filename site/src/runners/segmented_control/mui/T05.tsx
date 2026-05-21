'use client';

/**
 * segmented_control-mui-T05: Alignment (icons) → match preview
 *
 * Layout: isolated card in the center titled "Preview alignment".
 * The card contains:
 * - A preview box at the top showing a short line of text aligned either left, centered, or right.
 *   The preview is the ground-truth target.
 * - Below it, a ToggleButtonGroup labeled "Alignment" that uses ICON buttons (no text):
 *   align-left icon, align-center icon, align-right icon.
 *
 * Initial state: align-left is selected.
 * Selecting a new icon updates immediately (no Apply button).
 *
 * Clutter (low): a small caption under the preview reads "Match the preview alignment."
 *
 * Success: The "Alignment" ToggleButtonGroup selection matches the alignment shown in the preview box.
 * (Preview shows Center alignment)
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import type { TaskComponentProps } from '../types';

// The preview shows Center alignment
const PREVIEW_ALIGNMENT = 'Center';

const alignmentToJustify: Record<string, string> = {
  Left: 'flex-start',
  Center: 'center',
  Right: 'flex-end',
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('Left');

  const handleChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value !== null) {
      setSelected(value);
      if (value === PREVIEW_ALIGNMENT) {
        onSuccess();
      }
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Preview alignment</Typography>

        {/* Preview box */}
        <Box
          data-testid="alignment-preview"
          data-target-alignment={PREVIEW_ALIGNMENT}
          sx={{
            p: 2,
            mb: 1,
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            display: 'flex',
            justifyContent: alignmentToJustify[PREVIEW_ALIGNMENT],
          }}
        >
          <Typography>Sample text for preview</Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Match the preview alignment.
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Alignment
        </Typography>
        <ToggleButtonGroup
          data-testid="alignment"
          data-canonical-type="segmented_control"
          data-selected-value={selected}
          value={selected}
          exclusive
          onChange={handleChange}
          aria-label="Alignment"
        >
          <ToggleButton value="Left" aria-label="Left">
            <FormatAlignLeftIcon />
          </ToggleButton>
          <ToggleButton value="Center" aria-label="Center">
            <FormatAlignCenterIcon />
          </ToggleButton>
          <ToggleButton value="Right" aria-label="Right">
            <FormatAlignRightIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </CardContent>
    </Card>
  );
}
