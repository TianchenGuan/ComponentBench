'use client';

/**
 * checkbox_group-mui-T04: Set Delivery days to Monday only (two groups)
 *
 * Scene: light theme; comfortable spacing; a form section centered in the viewport; instances=2.
 * Material UI page showing an "Order schedule" form section (light theme, low clutter).
 * Above the checkbox groups are a disabled text field for "ZIP code" and a non-functional "Calculate shipping" button.
 * There are TWO FormGroup instances with the same day-of-week options:
 * 1) "Delivery days" (target) - Options: Monday, Tuesday, Wednesday, Thursday, Friday. Initial: Tuesday, Thursday checked.
 * 2) "Pickup days" (distractor) - Options: Monday, Tuesday, Wednesday, Thursday, Friday. Initial: Monday checked.
 * Success: In the 'Delivery days' checkbox group, only Monday is checked.
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, FormControl, FormLabel, 
  FormGroup, FormControlLabel, Checkbox, TextField, Button, Box, Divider
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [deliveryDays, setDeliveryDays] = useState<Record<string, boolean>>({
    Monday: false,
    Tuesday: true,
    Wednesday: false,
    Thursday: true,
    Friday: false,
  });
  const [pickupDays, setPickupDays] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
  });

  useEffect(() => {
    const targetSet = new Set(['Monday']);
    const checkedItems = Object.entries(deliveryDays).filter(([, v]) => v).map(([k]) => k);
    const currentSet = new Set(checkedItems);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [deliveryDays, onSuccess]);

  const handleDeliveryChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDays({ ...deliveryDays, [name]: event.target.checked });
  };

  const handlePickupChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPickupDays({ ...pickupDays, [name]: event.target.checked });
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Order schedule</Typography>
        
        {/* Distractor controls */}
        <Box sx={{ mb: 2 }}>
          <TextField 
            label="ZIP code" 
            value="90210" 
            disabled 
            size="small" 
            sx={{ mr: 2 }}
          />
          <Button variant="outlined" disabled>Calculate shipping</Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Target: Delivery days */}
        <FormControl component="fieldset" sx={{ mb: 3 }} data-testid="cg-delivery-days">
          <FormLabel component="legend">Delivery days</FormLabel>
          <FormGroup row>
            {days.map(day => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox 
                    checked={deliveryDays[day]} 
                    onChange={handleDeliveryChange(day)}
                    name={day}
                    size="small"
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </FormControl>

        {/* Distractor: Pickup days */}
        <FormControl component="fieldset" data-testid="cg-pickup-days">
          <FormLabel component="legend">Pickup days</FormLabel>
          <FormGroup row>
            {days.map(day => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox 
                    checked={pickupDays[day]} 
                    onChange={handlePickupChange(day)}
                    name={day}
                    size="small"
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
}
