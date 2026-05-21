'use client';

/**
 * file_dropzone-antd-T03: Upload two receipt PDFs (multi-select)
 *
 * setup_description: Baseline scene (light/comfortable/centered isolated card). One AntD Upload.Dragger instance is labeled "Receipts".
 * The dropzone is configured for multiple files (multiple=true, maxCount=5) and accepts PDFs (accept=.pdf).
 * Clicking the drop area opens an in-page "Sample files" picker with checkboxes (multi-select) listing:
 * - invoice-1042.pdf
 * - invoice-1043.pdf
 * - receipt-sample.pdf
 * After selection, the AntD upload list shows one row per file with filename and per-item status/progress.
 * Initial state: no uploaded files.
 *
 * Success: The dropzone labeled "Receipts" contains exactly two files: invoice-1042.pdf and invoice-1043.pdf.
 *          Both files have final status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, Checkbox, Button, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'invoice-1042.pdf', type: 'application/pdf' },
  { name: 'invoice-1043.pdf', type: 'application/pdf' },
  { name: 'receipt-sample.pdf', type: 'application/pdf' },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    const doneFiles = fileList.filter(f => f.status === 'done');
    const hasInvoice1042 = doneFiles.some(f => f.name === 'invoice-1042.pdf');
    const hasInvoice1043 = doneFiles.some(f => f.name === 'invoice-1043.pdf');
    
    if (doneFiles.length === 2 && hasInvoice1042 && hasInvoice1043) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, completed, onSuccess]);

  const handleConfirmSelection = async () => {
    setPickerOpen(false);
    
    const newFiles: UploadFile[] = selectedFiles.map(name => ({
      uid: generateUid(),
      name,
      status: 'uploading' as const,
      percent: 0,
    }));
    
    setFileList(newFiles);
    
    // Simulate upload for each file
    await simulateUpload(300);
    setFileList(prev => prev.map(f => ({ ...f, percent: 50 })));
    await simulateUpload(300);
    setFileList(prev => prev.map(f => ({ ...f, status: 'done' as const, percent: 100 })));
    
    setSelectedFiles([]);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: true,
    maxCount: 5,
    accept: '.pdf,application/pdf',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card style={{ width: 450 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Receipts</Title>
      
      <div data-testid="dropzone-receipts" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
        <Dragger
          {...uploadProps}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={
          <Button type="primary" onClick={handleConfirmSelection} disabled={selectedFiles.length === 0}>
            Add selected
          </Button>
        }
        width={350}
      >
        <Checkbox.Group value={selectedFiles} onChange={(vals) => setSelectedFiles(vals as string[])}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {SAMPLE_FILES.map(file => (
              <Checkbox key={file.name} value={file.name}>
                {file.name}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </Modal>
    </Card>
  );
}
