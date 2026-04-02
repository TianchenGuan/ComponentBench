'use client';

/**
 * split_button-mantine-T09: Export: pick nested path shown by icons (Export → PDF) (Mantine)
 *
 * Layout: isolated card placed near the top-left of the viewport (placement=top_left).
 *
 * Guidance (visual): Breadcrumb made of two icon-only chips: "export" icon → "PDF document" icon.
 *
 * Step 1 (root): Export icon-"Export" (opens step 2), Share icon-"Share" (disabled), Download icon-"Quick download"
 * Step 2 (Export formats): Back, CSV, PDF, PNG, Excel
 *
 * Initial state: Selected action is "Quick download".
 * Success: selectedPath = ["Export", "PDF"], selectedAction = "export_pdf"
 */

import React, { useState } from 'react';
import { Card, Button, Group, Menu, Text, Box, ActionIcon } from '@mantine/core';
import { 
  IconChevronDown, 
  IconChevronRight, 
  IconArrowLeft,
  IconFileExport, 
  IconShare, 
  IconDownload,
  IconFileTypeCsv,
  IconFileTypePdf,
  IconPhoto,
  IconFileSpreadsheet
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('quick_download');
  const [selectedPath, setSelectedPath] = useState<string[]>(['Quick download']);
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<'root' | 'export'>('root');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const getLabel = (key: string) => {
    const labels: Record<string, string> = {
      'quick_download': 'Quick download',
      'export_csv': 'CSV',
      'export_pdf': 'PDF',
      'export_png': 'PNG',
      'export_excel': 'Excel',
    };
    return labels[key] || key;
  };

  const handleQuickDownload = () => {
    setSelectedAction('quick_download');
    setSelectedPath(['Quick download']);
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
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={500} size="lg" mb="md">Export</Text>

      {/* Visual breadcrumb guidance (icon-only) */}
      <Box mb="md" data-reference-token="icon_breadcrumb_export_pdf">
        <Text size="sm" c="dimmed" mb="xs">Select this path:</Text>
        <Group gap="xs">
          <Box 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 28, 
              height: 28, 
              background: '#f0f0f0', 
              borderRadius: 4 
            }}
          >
            <IconFileExport size={16} />
          </Box>
          <IconChevronRight size={14} color="#adb5bd" />
          <Box 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 28, 
              height: 28, 
              background: '#f0f0f0', 
              borderRadius: 4 
            }}
          >
            <IconFileTypePdf size={16} />
          </Box>
        </Group>
      </Box>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        data-selected-path={JSON.stringify(selectedPath)}
      >
        <Group gap={0}>
          <Button style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
            {getLabel(selectedAction)}
          </Button>
          <Menu 
            position="bottom-end" 
            opened={menuOpen}
            onChange={(opened) => {
              setMenuOpen(opened);
              if (!opened) setStep('root');
            }}
          >
            <Menu.Target>
              <Button 
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, paddingLeft: 8, paddingRight: 8 }}
              >
                <IconChevronDown size={16} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {step === 'root' ? (
                <>
                  <Menu.Item
                    leftSection={<IconFileExport size={16} />}
                    rightSection={<IconChevronRight size={14} />}
                    onClick={() => setStep('export')}
                    closeMenuOnClick={false}
                  >
                    Export
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconShare size={16} />}
                    disabled
                  >
                    Share
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconDownload size={16} />}
                    onClick={handleQuickDownload}
                  >
                    Quick download
                  </Menu.Item>
                </>
              ) : (
                <>
                  <Menu.Item
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={() => setStep('root')}
                    closeMenuOnClick={false}
                  >
                    Back
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={<IconFileTypeCsv size={16} />}
                    onClick={() => handleExportFormat('CSV')}
                  >
                    CSV
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconFileTypePdf size={16} />}
                    onClick={() => handleExportFormat('PDF')}
                  >
                    PDF
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconPhoto size={16} />}
                    onClick={() => handleExportFormat('PNG')}
                  >
                    PNG
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconFileSpreadsheet size={16} />}
                    onClick={() => handleExportFormat('Excel')}
                  >
                    Excel
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </Card>
  );
}
