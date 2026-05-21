'use client';

/**
 * toolbar-mui-T10: Visual match: pick the correct annotation tool
 *
 * A centered card contains two panels side-by-side. The left panel shows a large example 
 * icon under the title "Reference" (no text label).
 * The right panel contains a MUI Toolbar labeled "Annotation tools" with 6 small icon-only 
 * toggle buttons. Only one can be selected at a time.
 * Initial state: "Select" tool is active. The reference icon corresponds to the "Comment" tool.
 */

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from '@mui/material';
import MouseIcon from '@mui/icons-material/Mouse';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import HighlightIcon from '@mui/icons-material/Highlight';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatShapesIcon from '@mui/icons-material/FormatShapes';
import type { TaskComponentProps } from '../types';

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const TOOLS: Tool[] = [
  { id: 'select', label: 'Select', icon: <MouseIcon /> },
  { id: 'draw', label: 'Draw', icon: <EditIcon /> },
  { id: 'comment', label: 'Comment', icon: <CommentIcon /> },
  { id: 'highlight', label: 'Highlight', icon: <HighlightIcon /> },
  { id: 'erase', label: 'Erase', icon: <DeleteIcon /> },
  { id: 'shapes', label: 'Shapes', icon: <FormatShapesIcon /> },
];

const TARGET_TOOL = 'comment';
const INITIAL_TOOL = 'select';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [activeTool, setActiveTool] = useState<string>(INITIAL_TOOL);

  const handleToolChange = (
    event: React.MouseEvent<HTMLElement>,
    newTool: string | null
  ) => {
    if (newTool !== null) {
      setActiveTool(newTool);
      if (newTool === TARGET_TOOL) {
        onSuccess();
      }
    }
  };

  const targetToolData = TOOLS.find((t) => t.id === TARGET_TOOL);

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Reference panel */}
        <Box
          sx={{
            width: 140,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Reference
          </Typography>
          <Box
            sx={{
              width: 72,
              height: 72,
              margin: '0 auto',
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              color: 'primary.main',
            }}
            data-reference-tool={TARGET_TOOL}
          >
            {targetToolData?.icon}
          </Box>
        </Box>

        {/* Annotation tools toolbar */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Annotation tools
          </Typography>
          <ToggleButtonGroup
            value={activeTool}
            exclusive
            onChange={handleToolChange}
            aria-label="annotation tools"
            data-testid="mui-toolbar-annotation-tools"
          >
            {TOOLS.map((tool) => (
              <ToggleButton
                key={tool.id}
                value={tool.id}
                aria-label={tool.label}
                aria-pressed={activeTool === tool.id}
                data-testid={`mui-toolbar-annotation-tools-${tool.id}`}
                data-tool-id={tool.id}
              >
                {tool.icon}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Active tool: {TOOLS.find((t) => t.id === activeTool)?.label}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
