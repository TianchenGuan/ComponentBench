'use client';

/**
 * file_dropzone-mui-T08: Match and upload the correct screenshot in a cluttered dashboard
 *
 * setup_description: The page is a light-theme dashboard with high clutter: multiple statistic cards, charts, and filter buttons are visible.
 * The target upload widget is one MUI-styled dropzone card labeled "Upload screenshot" located in the bottom-left region of the dashboard.
 * Within the upload card, a small "Reference preview" thumbnail is shown (target screenshot).
 * Under it, the dashed drop area supports drag/drop and click-to-open a "Sample files" dialog.
 * A candidate grid (part of the harness) shows 4 small screenshot thumbnails with neutral filenames:
 * - screenshot-01.png
 * - screenshot-02.png
 * - screenshot-03.png   ← (this matches the reference preview)
 * - screenshot-04.png
 * The reference preview matches screenshot-03.png by visual appearance (not by name).
 * After selection, the upload card shows a chip row with the chosen filename and an "uploaded" badge.
 * Initial state: no file attached.
 *
 * Success: The dropzone labeled "Upload screenshot" contains exactly one file: screenshot-03.png (status: uploaded).
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Paper, Dialog, DialogTitle, DialogContent, 
  Chip, Box, Grid
} from '@mui/material';
import { CloudUpload, TrendingUp, People, ShoppingCart, AttachMoney } from '@mui/icons-material';
import type { TaskComponentProps, SampleFile, DropzoneFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const SCREENSHOT_FILES: SampleFile[] = [
  { name: 'screenshot-01.png', type: 'image/png' },
  { name: 'screenshot-02.png', type: 'image/png' },
  { name: 'screenshot-03.png', type: 'image/png' },  // Target - matches reference
  { name: 'screenshot-04.png', type: 'image/png' },
];

// Generate distinct colors for visual matching
const getScreenshotColor = (name: string): string => {
  const colors: Record<string, string> = {
    'screenshot-01.png': '#e74c3c',  // Red
    'screenshot-02.png': '#9b59b6',  // Purple
    'screenshot-03.png': '#3498db',  // Blue - TARGET
    'screenshot-04.png': '#2ecc71',  // Green
  };
  return colors[name] || '#999';
};

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<DropzoneFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      files.length === 1 &&
      files[0].name === 'screenshot-03.png' &&
      files[0].status === 'uploaded'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setDialogOpen(false);
    
    const newFile: DropzoneFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFiles([newFile]);
    
    await simulateUpload(500);
    setFiles([{ ...newFile, status: 'uploaded' }]);
  };

  const handleDragStart = (e: React.DragEvent, file: SampleFile) => {
    e.dataTransfer.setData('application/json', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      const file: SampleFile = JSON.parse(data);
      await handleSelectFile(file);
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  const handleRemove = () => {
    setFiles([]);
  };

  // Stat card component for clutter
  const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5 }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: 600 }}>
      {/* Dashboard clutter - stat cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={3}>
          <StatCard icon={<TrendingUp />} label="Revenue" value="$24.5k" />
        </Grid>
        <Grid item xs={3}>
          <StatCard icon={<People />} label="Users" value="1,234" />
        </Grid>
        <Grid item xs={3}>
          <StatCard icon={<ShoppingCart />} label="Orders" value="567" />
        </Grid>
        <Grid item xs={3}>
          <StatCard icon={<AttachMoney />} label="Profit" value="$8.2k" />
        </Grid>
      </Grid>

      {/* More clutter - chart placeholder */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Sales Chart</Typography>
          <Box sx={{ height: 60, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'end', gap: 0.5, p: 1 }}>
            {[40, 65, 45, 80, 55, 70, 90].map((h, i) => (
              <Box key={i} sx={{ flex: 1, bgcolor: 'primary.main', height: `${h}%`, borderRadius: '2px 2px 0 0' }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Target: Upload screenshot card */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Upload screenshot
          </Typography>
          
          {/* Reference preview */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Reference preview</Typography>
            <Box
              sx={{
                width: 80,
                height: 50,
                bgcolor: getScreenshotColor('screenshot-03.png'),  // Target color
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
                mt: 0.5,
              }}
            />
          </Box>

          {/* Dropzone */}
          <Paper
            data-testid="dropzone-upload-screenshot"
            onClick={() => setDialogOpen(true)}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            sx={{
              p: 2,
              border: '2px dashed',
              borderColor: isDragOver ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              cursor: 'pointer',
              textAlign: 'center',
              bgcolor: isDragOver ? 'action.hover' : 'grey.50',
            }}
          >
            <CloudUpload sx={{ fontSize: 28, color: 'grey.400' }} />
            <Typography variant="caption" color="text.secondary" display="block">
              Drag or click to select
            </Typography>
          </Paper>

          {files.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${files[0].name} - ${files[0].status}`}
                onDelete={handleRemove}
                color={files[0].status === 'uploaded' ? 'success' : 'default'}
                size="small"
              />
            </Box>
          )}

          {/* Candidate thumbnails */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Candidates</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, mt: 0.5 }}>
              {SCREENSHOT_FILES.map(file => (
                <Box
                  key={file.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, file)}
                  onClick={() => handleSelectFile(file)}
                  sx={{ cursor: 'grab', textAlign: 'center' }}
                >
                  <Box
                    sx={{
                      height: 35,
                      bgcolor: getScreenshotColor(file.name),
                      borderRadius: 0.5,
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: 9 }}>{file.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sample files</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {SCREENSHOT_FILES.map(file => (
              <Box
                key={file.name}
                onClick={() => handleSelectFile(file)}
                sx={{
                  cursor: 'pointer',
                  p: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  textAlign: 'center',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Box
                  sx={{
                    height: 50,
                    bgcolor: getScreenshotColor(file.name),
                    borderRadius: 0.5,
                    mb: 1,
                  }}
                />
                <Typography variant="caption">{file.name}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
