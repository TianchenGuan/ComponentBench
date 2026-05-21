'use client';

/**
 * breadcrumb-mui-T09: Select region from dark menu (MUI)
 * 
 * Dark theme isolated card titled "City Details".
 * MUI Breadcrumbs: World > Regions (menu) > Cities > City Details
 * Clicking Regions opens menu: Americas, Europe, Asia.
 * Select "Europe".
 */

import React, { useState } from 'react';
import {
  Breadcrumbs,
  Link,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSelectRegion = (region: string) => {
    if (selectedRegion) return;
    setSelectedRegion(region);
    handleCloseMenu();
    if (region === 'Europe') {
      onSuccess();
    }
  };

  return (
    <Card
      sx={{
        width: 450,
        bgcolor: '#1f1f1f',
        '& .MuiCardHeader-root': { color: '#fff' },
      }}
    >
      <CardHeader title="City Details" sx={{ borderBottom: '1px solid #303030' }} />
      <CardContent>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: '#888' }} />}
          sx={{ mb: 2 }}
        >
          <Typography sx={{ color: '#90caf9' }}>World</Typography>
          <Link
            component="button"
            underline="hover"
            onClick={handleOpenMenu}
            data-testid="mui-breadcrumb-regions-menu"
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#90caf9' }}
          >
            Regions <ExpandMoreIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Link>
          <Typography sx={{ color: '#90caf9' }}>Cities</Typography>
          <Typography sx={{ color: '#888' }}>City Details</Typography>
        </Breadcrumbs>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          data-testid="mui-menu-regions"
        >
          <MenuItem onClick={() => handleSelectRegion('Americas')}>Americas</MenuItem>
          <MenuItem onClick={() => handleSelectRegion('Europe')}>Europe</MenuItem>
          <MenuItem onClick={() => handleSelectRegion('Asia')}>Asia</MenuItem>
        </Menu>

        {selectedRegion ? (
          <Typography sx={{ color: '#66bb6a', fontWeight: 500 }}>
            Selected region: {selectedRegion}
          </Typography>
        ) : (
          <Typography sx={{ color: '#ccc' }}>
            Click "Regions" to select a region.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
