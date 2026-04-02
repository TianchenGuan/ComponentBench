'use client';

/**
 * file_dropzone-antd-T05: Replace an existing W-9 PDF (maxCount=1)
 *
 * setup_description: The page is a small "Vendor onboarding" form section (light theme, comfortable spacing) with several non-target fields
 * (company name text input, address text input, and a disabled "Save" button). These fields are distractors and are not required.
 * The target component is one AntD Upload.Dragger labeled "W-9 form", configured as a single-file uploader (maxCount=1, accept=.pdf).
 * Initial state: the upload list already contains:
 * - w9-2025.pdf (status: uploaded)
 * The file row includes a remove icon and a prominent inline action link "Replace file".
 * Clicking the drop area or "Replace file" opens the in-page "Sample files" picker listing:
 * - w9-2025.pdf
 * - w9-2026.pdf
 * - w8ben.pdf
 * Selecting a file replaces the existing item (the list should end with exactly one uploaded PDF).
 *
 * Success: The dropzone labeled "W-9 form" contains exactly one file: w9-2026.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List, Input, Button, Space } from 'antd';
import { InboxOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'w9-2025.pdf', type: 'application/pdf' },
  { name: 'w9-2026.pdf', type: 'application/pdf' },
  { name: 'w8ben.pdf', type: 'application/pdf' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: 'initial-w9',
      name: 'w9-2025.pdf',
      status: 'done',
      percent: 100,
    },
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'w9-2026.pdf' &&
      fileList[0].status === 'done'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      percent: 0,
    };
    
    // Replace existing file
    setFileList([newFile]);
    
    await simulateUpload(300);
    setFileList([{ ...newFile, percent: 50 }]);
    await simulateUpload(300);
    setFileList([{ ...newFile, status: 'done', percent: 100 }]);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: false,
    maxCount: 1,
    accept: '.pdf,application/pdf',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card title="Vendor onboarding" style={{ width: 500 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Distractor fields */}
        <div>
          <Text strong>Company name</Text>
          <Input placeholder="Enter company name" style={{ marginTop: 4 }} />
        </div>
        
        <div>
          <Text strong>Address</Text>
          <Input placeholder="Enter address" style={{ marginTop: 4 }} />
        </div>
        
        {/* Target dropzone */}
        <div>
          <Title level={5} style={{ marginBottom: 8 }}>W-9 form</Title>
          
          <div data-testid="dropzone-w9-form" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
            <Dragger
              {...uploadProps}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
          </div>
          
          {fileList.length > 0 && (
            <Button type="link" onClick={() => setPickerOpen(true)} style={{ paddingLeft: 0, marginTop: 8 }}>
              Replace file
            </Button>
          )}
        </div>
        
        <Button type="primary" disabled>Save</Button>
      </Space>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={SAMPLE_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectFile(item)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
