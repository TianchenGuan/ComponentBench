'use client';

/**
 * checkbox_group-mui-T08: Select specific report sections in a scrollable modal
 *
 * Scene: dark theme; compact spacing; a modal dialog flow centered in the viewport; small-sized controls.
 * Material UI page in a dark theme with compact spacing. A button "Choose report sections" opens a modal.
 * Inside the modal:
 * - FormGroup labeled "Include sections" with ~25 options in a scrollable container.
 * - Example options: Overview, Executive summary, KPIs, Revenue, Expenses, Forecast, Risk notes, Notes, Methodology, Appendix A, Appendix B, Appendix C, Change log, etc.
 * - Several non-target options are checked by default (e.g., Overview and KPIs).
 * Modal footer: "Apply" (primary) and "Cancel" (secondary)
 * Success: After clicking Apply, the saved selection equals: Executive summary, Risk notes, Appendix A, Appendix B, Change log.
 */

import React, { useState, useRef } from 'react';
import { 
  Card, CardContent, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, FormControl, FormLabel, FormGroup, 
  FormControlLabel, Checkbox, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const sectionOptions = [
  'Overview', 'Executive summary', 'KPIs', 'Revenue', 'Expenses',
  'Forecast', 'Risk notes', 'Notes', 'Methodology', 'Compliance',
  'Appendix A', 'Appendix B', 'Appendix C', 'Change log', 'Glossary',
  'References', 'Index', 'Charts', 'Tables', 'Figures',
  'Summary', 'Recommendations', 'Next steps', 'Timeline', 'Budget'
];

const initialChecked = {
  'Overview': true,
  'KPIs': true,
};

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(
    sectionOptions.reduce((acc, opt) => ({ 
      ...acc, 
      [opt]: initialChecked[opt as keyof typeof initialChecked] || false 
    }), {})
  );
  const hasSucceeded = useRef(false);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected({ ...selected, [name]: event.target.checked });
  };

  const handleApply = () => {
    const targetSet = new Set(['Executive summary', 'Risk notes', 'Appendix A', 'Appendix B', 'Change log']);
    const checkedItems = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
    setDialogOpen(false);
  };

  const handleCancel = () => {
    // Reset to initial state
    setSelected(
      sectionOptions.reduce((acc, opt) => ({ 
        ...acc, 
        [opt]: initialChecked[opt as keyof typeof initialChecked] || false 
      }), {})
    );
    setDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Report Generator</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Customize which sections to include in your export.
          </Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Choose report sections
          </Button>
        </CardContent>
      </Card>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report sections</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ width: '100%' }} data-testid="cg-include-sections">
            <FormLabel component="legend" sx={{ mb: 1 }}>Include sections</FormLabel>
            <Box sx={{ 
              maxHeight: 300, 
              overflowY: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              p: 1
            }}>
              <FormGroup>
                {sectionOptions.map(section => (
                  <FormControlLabel
                    key={section}
                    control={
                      <Checkbox 
                        checked={selected[section]} 
                        onChange={handleChange(section)}
                        name={section}
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">{section}</Typography>}
                  />
                ))}
              </FormGroup>
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} data-testid="btn-apply">Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
