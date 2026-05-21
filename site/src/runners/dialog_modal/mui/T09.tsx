'use client';

/**
 * dialog_modal-mui-T09: Drag a draggable dialog to a target corner
 *
 * Layout: isolated_card centered. The page loads with a draggable Material UI Dialog open.
 *
 * Dialog configuration:
 * - Title: "Palette"
 * - Content: static text showing a few color names
 * - Actions: none
 * - The dialog is draggable by the title bar.
 *
 * Initial state: dialog open and centered.
 * Target: place the dialog near the bottom-left corner of the viewport.
 * Success: The 'Palette' dialog remains open and positioned near bottom-left corner.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Paper,
  PaperProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const successCalledRef = useRef(false);
  const paperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Palette',
      position: { x: 0, y: 0 },
    };
  }, []);

  const checkPosition = useCallback(() => {
    if (!paperRef.current || successCalledRef.current) return;
    
    const rect = paperRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Target: bottom-left corner with margin
    const targetX = 24;
    const targetY = viewportHeight - 24;
    const toleranceX = 100;
    const toleranceY = 100;
    
    const modalLeft = rect.left;
    const modalBottom = rect.bottom;
    
    // Check if modal is near bottom-left
    const isNearBottomLeft = 
      Math.abs(modalLeft - targetX) <= toleranceX &&
      Math.abs(modalBottom - targetY) <= toleranceY;

    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Palette',
      position: { x: rect.left, y: rect.top },
    };

    if (isNearBottomLeft && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  }, [onSuccess]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    setPosition({
      x: dragRef.current.initialX + dx,
      y: dragRef.current.initialY + dy,
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      checkPosition();
    }
  }, [isDragging, checkPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const DraggablePaper = (props: PaperProps) => {
    return (
      <Paper
        {...props}
        ref={paperRef}
        style={{
          ...props.style,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      />
    );
  };

  const colors = [
    { name: 'Ocean Blue', color: '#1976d2' },
    { name: 'Forest Green', color: '#2e7d32' },
    { name: 'Sunset Orange', color: '#ed6c02' },
    { name: 'Berry Purple', color: '#9c27b0' },
  ];

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardHeader title="Design Tools" />
        <CardContent>
          <Typography variant="body2">
            Drag the palette dialog to the bottom-left corner.
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperComponent={DraggablePaper}
        hideBackdrop
        disableEnforceFocus
        aria-labelledby="palette-dialog-title"
        data-testid="dialog-palette"
      >
        <DialogTitle
          id="palette-dialog-title"
          sx={{ cursor: 'grab', userSelect: 'none' }}
          onMouseDown={handleMouseDown}
        >
          Palette
        </DialogTitle>
        <DialogContent>
          <List dense>
            {colors.map((color) => (
              <ListItem key={color.name}>
                <ListItemIcon>
                  <CircleIcon sx={{ color: color.color }} />
                </ListItemIcon>
                <ListItemText primary={color.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
