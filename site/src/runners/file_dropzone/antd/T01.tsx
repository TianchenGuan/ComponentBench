'use client';

/**
 * file_dropzone-antd-T01: Upload resume PDF to Attachments (single file)
 *
 * setup_description: A single isolated card is centered in the viewport (light theme, comfortable spacing, default scale).
 * The card title is "Job application" and it contains one AntD Upload.Dragger instance labeled "Attachments".
 * The drop area shows the standard AntD dragger affordance (upload icon + "Click or drag file to this area to upload").
 * Clicking anywhere inside the drop area opens an in-page "Sample files" picker (not an OS dialog) listing 3 files:
 * - resume-alex-chen.pdf
 * - avatar-green.png
 * - project-brief.txt
 * The Upload.Dragger is configured for a single file (maxCount=1), with auto-upload enabled.
 * After a file is chosen/dropped, an AntD upload list appears directly below the drop area with filename text,
 * a progress indicator, and a final success state ("Uploaded" with a check icon). Each list item has a remove (×) icon.
 * Initial state: no file selected/uploaded. No other interactive UI is present on the page.
 *
 * Success: The dropzone labeled "Attachments" contains exactly one file: resume-alex-chen.pdf with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List, Button } from 'antd';
import { InboxOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid, getMimeType } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'resume-alex-chen.pdf', type: 'application/pdf' },
  { name: 'avatar-green.png', type: 'image/png' },
  { name: 'project-brief.txt', type: 'text/plain' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'resume-alex-chen.pdf' &&
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
    
    setFileList([newFile]);
    
    // Simulate upload progress
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
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card title="Job application" style={{ width: 450 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Attachments</Title>
      
      <div data-testid="dropzone-attachments" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
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
        footer={null}
        width={350}
      >
        <List
          dataSource={SAMPLE_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectFile(item)}
              style={{ cursor: 'pointer' }}
              className="hover:bg-gray-50"
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
