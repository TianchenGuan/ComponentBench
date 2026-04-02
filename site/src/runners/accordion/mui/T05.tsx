'use client';

/**
 * accordion-mui-T05: Mixed cue: open Compliance section (match reference icon)
 * 
 * A centered isolated card titled "Policies" shows a small reference chip above the 
 * accordion list; the chip contains an icon (e.g., a shield) and the text "Compliance". 
 * Below it is a MUI Accordion list with 7 items whose headers include small leading icons.
 * Initial state: all collapsed. Icons are similar in size and style; the reference chip 
 * is the clearest visual cue, but the header text is also available.
 * 
 * Success: expanded_item_ids equals exactly: [compliance]
 */

import React, { useState, useEffect } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Paper,
  Chip,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import HistoryIcon from '@mui/icons-material/History';
import BusinessIcon from '@mui/icons-material/Business';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (expanded === 'compliance') {
      onSuccess();
    }
  }, [expanded, onSuccess]);

  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const items = [
    { key: 'overview', label: 'Overview', icon: InfoIcon, content: 'General policy overview.' },
    { key: 'data_use', label: 'Data use', icon: StorageIcon, content: 'How we use your data.' },
    { key: 'compliance', label: 'Compliance', icon: ShieldIcon, content: 'Compliance and regulatory information.' },
    { key: 'security', label: 'Security', icon: SecurityIcon, content: 'Security measures we implement.' },
    { key: 'retention', label: 'Retention', icon: HistoryIcon, content: 'Data retention policies.' },
    { key: 'vendors', label: 'Vendors', icon: BusinessIcon, content: 'Third-party vendor policies.' },
    { key: 'contact', label: 'Contact', icon: ContactMailIcon, content: 'Contact information for policy inquiries.' },
  ];

  return (
    <Paper elevation={2} sx={{ width: 500, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Policies</Typography>
      
      {/* Reference chip */}
      <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Reference:
        </Typography>
        <Chip 
          icon={<ShieldIcon />} 
          label="Compliance" 
          variant="outlined"
          color="primary"
        />
      </Box>
      
      <div data-testid="accordion-root">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <Accordion 
              key={item.key}
              expanded={expanded === item.key} 
              onChange={handleChange(item.key)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon fontSize="small" color="action" />
                  <Typography>{item.label}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.content}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </Paper>
  );
}
