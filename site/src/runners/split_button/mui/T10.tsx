'use client';

/**
 * split_button-mui-T10: Export: choose nested path Export → PDF (MUI, dark)
 *
 * Layout: isolated card in dark theme placed near the top-left of the viewport (placement=top_left).
 *
 * Target component: MUI split button with two-step nested panel inside Popper.
 * Step 1 (root): "Quick export (CSV)", "Export" (opens step 2), "Share" (disabled)
 * Step 2 (Export panel): Back, "CSV", "PDF", "PNG", "Excel"
 *
 * Initial state: Selected action: "Quick export (CSV)".
 * Success: selectedPath = ["Export", "PDF"], selectedAction = "export_pdf"
 */

import React, { useState, useRef } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Card,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Grow,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { TaskComponentProps } from '../types';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('quick_export_csv');
  const [selectedPath, setSelectedPath] = useState<string[]>(['Quick export (CSV)']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<'root' | 'export'>('root');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      'quick_export_csv': 'Quick export (CSV)',
      'export_csv': 'CSV',
      'export_pdf': 'PDF',
      'export_png': 'PNG',
      'export_excel': 'Excel',
    };
    return labels[key] || key;
  };

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setStep('root');
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
    setStep('root');
  };

  const handleQuickExport = () => {
    setSelectedAction('quick_export_csv');
    setSelectedPath(['Quick export (CSV)']);
    setMenuOpen(false);
    setStep('root');
  };

  const handleExportFormat = (format: string) => {
    const actionKey = `export_${format.toLowerCase()}`;
    setSelectedAction(actionKey);
    setSelectedPath(['Export', format]);
    setMenuOpen(false);
    setStep('root');
    if (actionKey === 'export_pdf' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 360, bgcolor: '#1e1e1e', color: '#fff' }}>
      <CardHeader 
        title="Export" 
        titleTypographyProps={{ color: '#fff' }}
        sx={{ borderBottom: '1px solid #333' }}
      />
      <CardContent>
        <div
          data-testid="split-button-root"
          data-selected-action={selectedAction}
          data-selected-path={JSON.stringify(selectedPath)}
        >
          <ButtonGroup variant="contained" ref={anchorRef}>
            <Button sx={{ textTransform: 'none' }}>{getLabel(selectedAction)}</Button>
            <Button
              size="small"
              aria-controls={menuOpen ? 'split-button-menu' : undefined}
              aria-expanded={menuOpen ? 'true' : undefined}
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            open={menuOpen}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            sx={{ zIndex: 1 }}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper sx={{ width: 200 }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {step === 'root' ? (
                        <>
                          <MenuItem onClick={handleQuickExport}>
                            Quick export (CSV)
                          </MenuItem>
                          <MenuItem onClick={() => setStep('export')}>
                            <ListItemText>Export</ListItemText>
                            <ArrowForwardIosIcon sx={{ fontSize: 12, ml: 1 }} />
                          </MenuItem>
                          <MenuItem disabled>
                            Share
                          </MenuItem>
                        </>
                      ) : (
                        <>
                          <MenuItem onClick={() => setStep('root')}>
                            <ListItemIcon>
                              <ArrowBackIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Back</ListItemText>
                          </MenuItem>
                          <Divider />
                          <MenuItem onClick={() => handleExportFormat('CSV')}>CSV</MenuItem>
                          <MenuItem onClick={() => handleExportFormat('PDF')}>PDF</MenuItem>
                          <MenuItem onClick={() => handleExportFormat('PNG')}>PNG</MenuItem>
                          <MenuItem onClick={() => handleExportFormat('Excel')}>Excel</MenuItem>
                        </>
                      )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </CardContent>
    </Card>
  );
}
