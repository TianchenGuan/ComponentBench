'use client';

/**
 * file_upload_button-antd-T02: Upload profile photo to picture-card uploader (mixed guidance)
 *
 * setup_description: A centered isolated card titled "Account – Profile photo" contains an Ant Design 
 * Upload configured as a picture-card (thumbnail grid). The uploader shows a single empty picture-card 
 * slot with a plus icon and the text "Upload"; maxCount is 1 so only one image can be stored. Accepted 
 * types are limited to PNG/JPEG, and the helper text below the component says "Images only". To the 
 * right of the uploader, a non-interactive Reference panel shows the expected image thumbnail and the 
 * filename text "profile_photo.png" (this provides mixed text+visual guidance). After selection, the 
 * chosen image appears as a thumbnail tile inside the Upload component with small overlay icons for 
 * preview and remove. Initial state: no file is selected, and the upload list grid is empty.
 *
 * Success: The Profile photo uploader contains exactly one file named "profile_photo.png" with status "done".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List } from 'antd';
import { PlusOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'profile_photo.png', type: 'image/png' },
  { name: 'avatar.jpg', type: 'image/jpeg' },
  { name: 'headshot.png', type: 'image/png' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'profile_photo.png' &&
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
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231677ff" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="10">${sample.name.substring(0, 8)}</text></svg>`,
    };
    
    setFileList([newFile]);
    
    // Simulate upload progress
    await simulateUpload(500);
    setFileList([{ ...newFile, status: 'done' }]);
  };

  const uploadProps: UploadProps = {
    accept: '.png,.jpg,.jpeg,image/png,image/jpeg',
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    fileList,
    showUploadList: true,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card title="Account – Profile photo" style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <div data-testid="uploader-profile-photo" onClick={() => fileList.length === 0 && setPickerOpen(true)}>
          <Upload {...uploadProps}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Text type="secondary" style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
            Images only
          </Text>
        </div>
        
        {/* Reference panel */}
        <div
          style={{
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            minWidth: 150,
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Reference</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileImageOutlined style={{ fontSize: 32, color: '#1677ff' }} />
            <Text data-testid="reference-file-name">profile_photo.png</Text>
          </div>
        </div>
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
                avatar={<FileImageOutlined style={{ fontSize: 20 }} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
