'use client';

/**
 * split_button-mui-T08: Deploy dashboard: set Production split-button to Rollback previous (MUI)
 *
 * Layout: dashboard with three cards (clutter=medium):
 * 1) "Staging deploy", 2) "Production deploy" (target), 3) "Hotfix deploy"
 *
 * Each card contains a similar MUI split button.
 * Menu items (same): "Deploy latest", "Deploy tagged release…", "Rollback to previous version", "Rollback to selected version…", Divider, "Disable deployments" (disabled)
 * Initial state: All set to "Deploy latest".
 *
 * Success: Only "Production deploy" instance has selectedAction = "rollback_previous"
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
  Typography,
  Chip,
  Divider,
  Box,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { TaskComponentProps } from '../types';

const options = [
  { key: 'deploy_latest', label: 'Deploy latest' },
  { key: 'deploy_tagged', label: 'Deploy tagged release…' },
  { key: 'rollback_previous', label: 'Rollback to previous version' },
  { key: 'rollback_selected', label: 'Rollback to selected version…' },
  { key: 'divider', divider: true },
  { key: 'disable', label: 'Disable deployments', disabled: true },
];

interface DeployCardProps {
  title: string;
  instance: string;
  statusColor: 'success' | 'warning' | 'error';
  selectedAction: string;
  onActionChange: (key: string) => void;
}

function DeployCard({ title, instance, statusColor, selectedAction, onActionChange }: DeployCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getLabel = (key: string) => options.find(o => o.key === key && !o.divider)?.label || key;

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current?.contains(event.target as HTMLElement)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleMenuItemClick = (key: string) => {
    const option = options.find(o => o.key === key);
    if (option?.disabled || option?.divider) return;
    onActionChange(key);
    setMenuOpen(false);
  };

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ fontSize: 16 }}
        action={
          <Chip
            size="small"
            color={statusColor}
            label={statusColor === 'success' ? 'Healthy' : statusColor === 'warning' ? 'Warning' : 'Error'}
          />
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        {/* Sparkline placeholder (distractor) */}
        <Box sx={{ height: 40, bgcolor: '#fafafa', borderRadius: 1, mb: 2 }} />

        {/* Environment URL (non-interactive) */}
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          {instance}.example.com
        </Typography>

        <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
          {title} actions
        </Typography>

        <div
          data-testid="split-button-root"
          data-instance={instance}
          data-selected-action={selectedAction}
          aria-label={`${title}`}
        >
          <ButtonGroup variant="outlined" ref={anchorRef} size="small">
            <Button sx={{ textTransform: 'none' }}>{getLabel(selectedAction)}</Button>
            <Button
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
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option) => {
                        if (option.divider) {
                          return <Divider key={option.key} />;
                        }
                        return (
                          <MenuItem
                            key={option.key}
                            selected={option.key === selectedAction}
                            disabled={option.disabled}
                            onClick={() => handleMenuItemClick(option.key)}
                          >
                            {option.label}
                          </MenuItem>
                        );
                      })}
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

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [stagingAction, setStagingAction] = useState('deploy_latest');
  const [productionAction, setProductionAction] = useState('deploy_latest');
  const [hotfixAction, setHotfixAction] = useState('deploy_latest');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const handleProductionChange = (key: string) => {
    setProductionAction(key);
    if (key === 'rollback_previous' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%', maxWidth: 900 }}>
      <DeployCard
        title="Staging deploy"
        instance="staging"
        statusColor="success"
        selectedAction={stagingAction}
        onActionChange={setStagingAction}
      />
      <DeployCard
        title="Production deploy"
        instance="production"
        statusColor="success"
        selectedAction={productionAction}
        onActionChange={handleProductionChange}
      />
      <DeployCard
        title="Hotfix deploy"
        instance="hotfix"
        statusColor="warning"
        selectedAction={hotfixAction}
        onActionChange={setHotfixAction}
      />
    </Box>
  );
}
