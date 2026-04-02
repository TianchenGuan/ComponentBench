'use client';

/**
 * file_dropzone-antd-T02: Upload profile photo (PNG) with thumbnail preview
 *
 * setup_description: The page uses the baseline scene: a centered isolated card (light theme, comfortable spacing, default scale).
 * Inside the card there is one AntD Upload.Dragger labeled "Profile photo".
 * The drop area is configured to accept images only (accept=image/*) and uses a picture-style upload list:
 * after upload, the list shows a small image thumbnail preview next to the filename and status.
 * Clicking the drop area opens an in-page "Sample files" picker listing 3 images:
 * - avatar-green.png
 * - avatar-blue.png
 * - id-card.jpg
 * Auto-upload is enabled and a short progress indicator appears before the final "uploaded" status.
 * Initial state: empty (no selected file). There are no extra buttons or other form fields.
 *
 * Success: The dropzone labeled "Profile photo" contains exactly one file: avatar-green.png with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List } from 'antd';
import { InboxOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'avatar-green.png', type: 'image/png' },
  { name: 'avatar-blue.png', type: 'image/png' },
  { name: 'id-card.jpg', type: 'image/jpeg' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'avatar-green.png' &&
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
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="${sample.name.includes('green') ? '%2352c41a' : sample.name.includes('blue') ? '%231677ff' : '%23999'}" width="100" height="100"/></svg>`,
    };
    
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
    listType: 'picture',
    accept: 'image/*',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  return (
    <Card style={{ width: 450 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Profile photo</Title>
      
      <div data-testid="dropzone-profile-photo" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
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
            >
              <List.Item.Meta
                avatar={<FileImageOutlined style={{ fontSize: 24 }} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
