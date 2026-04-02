'use client';

/**
 * file_upload_button-mantine-T28: Upload an exact 4-file set in a compact settings panel
 *
 * setup_description: The page uses a settings-panel layout titled "Project settings" with medium 
 * clutter (several toggles and small helper texts are visible but not required). All content is 
 * in compact spacing mode, making controls closer together. The target component is a Mantine 
 * FileInput labeled "Supporting files" configured with multiple=true. Selected files are displayed 
 * as a list of pills below the input (each pill shows the filename and has a small remove icon). 
 * Initial state: no files are selected.
 *
 * Success: The FileInput labeled "Supporting files" contains exactly the set 
 *          {budget.xlsx, data_sample.csv, config.json, notes.txt} and no other files.
 */

import React, { useState, useEffect } from 'react';
import { TextInput, Switch, Card, Text, Stack, Divider, Group, Pill, Modal, UnstyledButton, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFile } from '@tabler/icons-react';
import type { TaskComponentProps, SampleFile } from '../types';

const TARGET_FILES = new Set(['budget.xlsx', 'data_sample.csv', 'config.json', 'notes.txt']);

const SAMPLE_FILES: SampleFile[] = [
  { name: 'budget.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  { name: 'data_sample.csv', type: 'text/csv' },
  { name: 'config.json', type: 'application/json' },
  { name: 'notes.txt', type: 'text/plain' },
  { name: 'extra.pdf', type: 'application/pdf' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpened, { open: openPicker, close: closePicker }] = useDisclosure(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (files.length === 4) {
      const fileNames = new Set(files);
      const hasAllRequired = Array.from(TARGET_FILES).every(name => fileNames.has(name));
      const hasOnlyRequired = files.every(f => TARGET_FILES.has(f));
      
      if (hasAllRequired && hasOnlyRequired) {
        setCompleted(true);
        onSuccess();
      }
    }
  }, [files, completed, onSuccess]);

  const handleSelectFile = (sample: SampleFile) => {
    if (!files.includes(sample.name)) {
      setFiles(prev => [...prev, sample.name]);
    }
    closePicker();
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="sm">Project settings</Text>
      
      <Stack gap="xs">
        {/* Distractor settings */}
        <Group justify="space-between">
          <Text size="sm">Enable notifications</Text>
          <Switch size="xs" defaultChecked />
        </Group>
        
        <Group justify="space-between">
          <Text size="sm">Auto-save</Text>
          <Switch size="xs" />
        </Group>
        
        <TextInput
          size="xs"
          label="Project name"
          defaultValue="My Project"
        />
        
        <Divider my="xs" />
        
        {/* Target uploader */}
        <div data-testid="uploader-supporting-files">
          <Text size="sm" fw={500} mb={4}>Supporting files</Text>
          <Button
            size="sm"
            variant="outline"
            leftSection={<IconFile size={14} />}
            onClick={openPicker}
          >
            Select files
          </Button>
          
          {files.length > 0 && (
            <Group gap="xs" mt="xs">
              {files.map((fileName, index) => (
                <Pill
                  key={index}
                  withRemoveButton
                  onRemove={() => handleRemoveFile(index)}
                  size="sm"
                >
                  {fileName}
                </Pill>
              ))}
            </Group>
          )}
        </div>
        
        {/* More distractor settings */}
        <Text size="xs" c="dimmed" mt="xs">
          Max file size: 10MB per file
        </Text>
      </Stack>

      {/* Virtual file picker modal */}
      <Modal opened={pickerOpened} onClose={closePicker} title="Sample files" centered>
        <Stack gap="xs">
          {SAMPLE_FILES.map((file) => (
            <UnstyledButton
              key={file.name}
              onClick={() => handleSelectFile(file)}
              style={{
                padding: '12px',
                borderRadius: '4px',
                opacity: files.includes(file.name) ? 0.5 : 1,
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Group gap="sm">
                <IconFile size={20} />
                <div>
                  <Text size="sm">{file.name}</Text>
                  {files.includes(file.name) && (
                    <Text size="xs" c="dimmed">Already added</Text>
                  )}
                </div>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal>
    </Card>
  );
}
