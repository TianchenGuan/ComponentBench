'use client';

/**
 * window_splitter-mui-T17: Modal save: set Inspector to 25% and Save changes
 * 
 * The page uses a modal_flow layout with a button labeled "Customize layout". 
 * Clicking it opens a MUI Dialog titled "Customize Layout". Inside the dialog 
 * is a resizable two-pane layout: "Canvas" (left) and "Inspector" (right), 
 * starting at 50/50. The dialog footer contains "Cancel" and a primary 
 * "Save changes" button. Resizing changes are not considered committed until 
 * Save changes is pressed.
 * 
 * Success: After clicking "Save changes", Inspector (right) is 25% ±2%
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { Group, Panel, Separator } from 'react-resizable-panels';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inspectorSize, setInspectorSize] = useState(50);
  const [committedSize, setCommittedSize] = useState<number | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (!successFiredRef.current && committedSize !== null) {
      const inspectorFraction = committedSize / 100;
      // Success: Inspector (right) is 25% ±2% (0.23 to 0.27)
      if (inspectorFraction >= 0.23 && inspectorFraction <= 0.27) {
        successFiredRef.current = true;
        onSuccess();
      }
    }
  }, [committedSize, onSuccess]);

  const handleSave = () => {
    setCommittedSize(inspectorSize);
    setIsApplied(true);
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setInspectorSize(50);
    setIsDialogOpen(false);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => setIsDialogOpen(true)}
          data-testid="open-dialog-button"
        >
          Customize layout
        </Button>

        {committedSize !== null && (
          <Typography 
            variant="body2" 
            color="success.main" 
            sx={{ mt: 2 }}
            data-committed-layout={`${100 - committedSize},${committedSize}`}
          >
            Applied: Canvas {(100 - committedSize).toFixed(0)}% • Inspector {committedSize.toFixed(0)}%
          </Typography>
        )}
      </CardContent>

      <Dialog 
        open={isDialogOpen} 
        onClose={handleCancel} 
        maxWidth="md" 
        fullWidth
        data-testid="customize-layout-dialog"
      >
        <DialogTitle>Customize Layout</DialogTitle>
        <DialogContent>
          <Box 
            sx={{ height: 300, border: '1px solid #e0e0e0', borderRadius: 1, my: 2 }}
            data-testid="splitter-primary"
          >
            <Group 
              orientation="horizontal" 
              onLayoutChange={(layout) => {
                const val = layout['inspector'];
                if (val !== undefined) {
                  setInspectorSize(val);
                  setIsApplied(false);
                }
              }}
            >
              <Panel id="canvas" defaultSize="50%" minSize="20%" maxSize="90%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                  <Typography fontWeight={500}>Canvas</Typography>
                </Box>
              </Panel>
              <Separator style={{
                width: 8,
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'col-resize',
              }}>
                <Box sx={{ width: 4, height: 24, borderLeft: '2px dotted #999', borderRight: '2px dotted #999' }} />
              </Separator>
              <Panel id="inspector" minSize="10%">
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                  <Typography fontWeight={500}>Inspector</Typography>
                </Box>
              </Panel>
            </Group>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Canvas: {(100 - inspectorSize).toFixed(0)}% • Inspector: {inspectorSize.toFixed(0)}%
            </Typography>
            {!isApplied && <Chip label="Unsaved" size="small" color="warning" />}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="save-button">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
