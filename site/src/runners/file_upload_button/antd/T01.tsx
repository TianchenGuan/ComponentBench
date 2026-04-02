'use client';

/**
 * file_upload_button-antd-T01: Upload a resume PDF (single file)
 *
 * setup_description: The page shows a single isolated card titled "Job application – Resume" centered 
 * in the viewport. Inside the card there is one Ant Design Upload component rendered as a prominent 
 * primary button labeled "Select file" with a small hint text "PDF only" under it. The Upload uses 
 * the default (text) listType and shows the upload list below the button once a file is chosen. 
 * The component is configured for a single file (multiple=false) and auto-uploads immediately to 
 * a mocked endpoint; progress briefly shows as "uploading" then becomes "done". No other interactive 
 * elements are present (no extra form fields, no extra uploaders). Initial state: the upload list 
 * is empty and no errors are shown.
 *
 * Success: The Resume uploader's file list contains exactly one file named "resume.pdf" with status "done".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Modal, List } from 'antd';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume.pdf', type: 'application/pdf' },
  { name: 'cover_letter.pdf', type: 'application/pdf' },
  { name: 'portfolio.pdf', type: 'application/pdf' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'resume.pdf' &&
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
    };
    
    setFileList([newFile]);
    
    // Simulate upload progress
    await simulateUpload(500);
    setFileList([{ ...newFile, status: 'done' }]);
  };

  const uploadProps: UploadProps = {
    accept: '.pdf,application/pdf',
    multiple: false,
    fileList,
    showUploadList: true,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <Card title="Job application – Resume" style={{ width: 400 }}>
      <div data-testid="uploader-resume" onClick={() => setPickerOpen(true)}>
        <Upload {...uploadProps}>
          <Button type="primary" icon={<UploadOutlined />}>
            Select file
          </Button>
        </Upload>
        <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
          PDF only
        </Text>
      </div>

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
              style={{ cursor: 'pointer', padding: '12px 0' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined style={{ fontSize: 20 }} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
