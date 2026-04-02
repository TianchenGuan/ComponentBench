'use client';

/**
 * popover-mui-T10: Match reference icon to open the correct Popper (visual guidance)
 *
 * Isolated card anchored near the top-left of the viewport.
 * At the top of the card, a 'Reference' box shows a single icon (visual-only) that represents the target tool.
 * Below, a compact toolbar contains three unlabeled IconButtons (icons only, no text): a bell, an envelope, and a gear.
 * Each IconButton toggles a MUI Popper anchored to that button. Each popper has a visible title inside.
 * Initial state: all poppers are closed.
 * No click-away dismissal is implemented; each popper toggles via its own icon button.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, Typography, IconButton, Popper, Paper, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import SettingsIcon from '@mui/icons-material/Settings';
import type { TaskComponentProps } from '../types';

type IconType = 'bell' | 'envelope' | 'gear';

const ICON_OPTIONS: IconType[] = ['bell', 'envelope', 'gear'];

const iconComponents: Record<IconType, React.ReactNode> = {
  bell: <NotificationsIcon />,
  envelope: <EmailIcon />,
  gear: <SettingsIcon />,
};

const popperTitles: Record<IconType, string> = {
  bell: 'Notifications',
  envelope: 'Messages',
  gear: 'Settings',
};

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const targetIcon = useMemo(() => {
    const index = Math.floor(Math.random() * ICON_OPTIONS.length);
    return ICON_OPTIONS[index];
  }, []);

  const [openIcon, setOpenIcon] = useState<IconType | null>(null);
  const anchorRefs = useRef<Record<IconType, HTMLButtonElement | null>>({
    bell: null,
    envelope: null,
    gear: null,
  });
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (openIcon === targetIcon && !successCalledRef.current) {
      // Check that no other poppers are open
      successCalledRef.current = true;
      onSuccess();
    }
  }, [openIcon, targetIcon, onSuccess]);

  const handleToggle = (icon: IconType) => () => {
    setOpenIcon((prev) => (prev === icon ? null : icon));
  };

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Toolbar
        </Typography>
        
        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            Reference:
          </Typography>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            data-testid="reference-icon-box"
            data-ref-icon={targetIcon}
          >
            {iconComponents[targetIcon]}
          </Box>
        </Box>
        
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
          Match the icon, then open the corresponding popover.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {ICON_OPTIONS.map((icon) => (
            <React.Fragment key={icon}>
              <IconButton
                ref={(el) => { anchorRefs.current[icon] = el; }}
                onClick={handleToggle(icon)}
                data-testid={`popper-target-${icon}`}
                color={openIcon === icon ? 'primary' : 'default'}
              >
                {iconComponents[icon]}
              </IconButton>
              <Popper
                open={openIcon === icon}
                anchorEl={anchorRefs.current[icon]}
                placement="bottom"
                data-testid={`popper-${icon}`}
              >
                <Paper sx={{ p: 1.5, mt: 1 }}>
                  <Typography variant="subtitle2">{popperTitles[icon]}</Typography>
                  <Typography variant="caption">
                    {icon === 'bell' && 'View your notifications'}
                    {icon === 'envelope' && 'Check your messages'}
                    {icon === 'gear' && 'Adjust your settings'}
                  </Typography>
                </Paper>
              </Popper>
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
