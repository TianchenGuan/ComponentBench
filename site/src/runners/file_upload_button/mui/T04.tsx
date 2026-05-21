'use client';

/**
 * file_upload_button-mui-T14: Upload to the correct field in a form (2 instances)
 *
 * setup_description: The page is a short identity verification form section (low clutter) with 
 * two upload fields placed one under another. The first uploader is labeled "Passport scan" and 
 * the second is labeled "Proof of address"; both are MUI Buttons implemented as labels wrapping 
 * hidden file inputs. Each field shows its own selected filename line below the button 
 * (e.g., "Selected: none"). Both uploaders start empty. Other form fields (name, date of birth) 
 * are present above but are irrelevant to success.
 *
 * Success: The uploader labeled "Proof of address" has exactly one selected file named "invoice_2025-11.pdf".
 *          The uploader labeled "Passport scan" remains empty.
 */

import React, { useState, useEffect } from 'react';
import { 
  Button, Card, CardContent, Typography, Box, TextField, Divider,
  Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import type { TaskComponentProps, SampleFile } from '../types';

const PASSPORT_FILES: SampleFile[] = [
  { name: 'passport_scan.jpg', type: 'image/jpeg' },
  { name: 'id_front.png', type: 'image/png' },
  { name: 'id_back.png', type: 'image/png' },
];

const PROOF_FILES: SampleFile[] = [
  { name: 'invoice_2025-11.pdf', type: 'application/pdf' },
  { name: 'utility_bill.pdf', type: 'application/pdf' },
  { name: 'bank_statement.pdf', type: 'application/pdf' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [passportFile, setPassportFile] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [passportPickerOpen, setPassportPickerOpen] = useState(false);
  const [proofPickerOpen, setProofPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      proofFile === 'invoice_2025-11.pdf' &&
      passportFile === null
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [passportFile, proofFile, completed, onSuccess]);

  const handleSelectPassport = (sample: SampleFile) => {
    setPassportFile(sample.name);
    setPassportPickerOpen(false);
  };

  const handleSelectProof = (sample: SampleFile) => {
    setProofFile(sample.name);
    setProofPickerOpen(false);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Identity Verification
        </Typography>
        
        {/* Other form fields (distractors) */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            size="small"
            defaultValue="John Doe"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            variant="outlined"
            size="small"
            defaultValue="1990-01-15"
            sx={{ mb: 2 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />
        
        {/* Passport scan uploader */}
        <Box data-testid="uploader-passport" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Passport scan
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            size="small"
            onClick={() => setPassportPickerOpen(true)}
          >
            Choose file
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            Selected: {passportFile || 'none'}
          </Typography>
        </Box>
        
        {/* Proof of address uploader */}
        <Box data-testid="uploader-proof-address">
          <Typography variant="subtitle2" gutterBottom>
            Proof of address
          </Typography>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            size="small"
            onClick={() => setProofPickerOpen(true)}
          >
            Choose file
          </Button>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
            Selected: {proofFile || 'none'}
          </Typography>
        </Box>
      </CardContent>

      {/* Passport picker dialog */}
      <Dialog open={passportPickerOpen} onClose={() => setPassportPickerOpen(false)}>
        <DialogTitle>Sample images</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {PASSPORT_FILES.map((file) => (
            <ListItem
              key={file.name}
              component="div"
              onClick={() => handleSelectPassport(file)}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* Proof picker dialog */}
      <Dialog open={proofPickerOpen} onClose={() => setProofPickerOpen(false)}>
        <DialogTitle>Sample files</DialogTitle>
        <List sx={{ minWidth: 300 }}>
          {PROOF_FILES.map((file) => (
            <ListItem
              key={file.name}
              component="div"
              onClick={() => handleSelectProof(file)}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </Card>
  );
}
