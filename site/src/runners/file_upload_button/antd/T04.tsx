'use client';

/**
 * file_upload_button-antd-T04: Upload to the correct uploader when two are present
 *
 * setup_description: A single isolated card titled "Candidate profile" is centered on the page. Inside 
 * the card there are two clearly separated Ant Design Upload components of the same canonical type. 
 * The first section is labeled "Profile photo" and uses a picture-card style with image-only accept 
 * rules (PNG/JPG) and maxCount=1; it starts empty. The second section is labeled "Resume" and uses 
 * the default text list style and accepts PDF; it also starts empty. Both sections have their own 
 * "Select file" button and their own independent upload list area directly below. No other controls 
 * are on the page.
 *
 * Success: The uploader labeled "Resume" contains exactly one file named "resume.pdf" with status "done".
 *          The uploader labeled "Profile photo" remains empty (0 files).
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Divider, Modal, List } from 'antd';
import { UploadOutlined, PlusOutlined, FileOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Title } = Typography;

const PROFILE_PHOTO_FILES: SampleFile[] = [
  { name: 'headshot.png', type: 'image/png' },
  { name: 'profile.jpg', type: 'image/jpeg' },
  { name: 'avatar.png', type: 'image/png' },
];

const RESUME_FILES: SampleFile[] = [
  { name: 'resume.pdf', type: 'application/pdf' },
  { name: 'cv.pdf', type: 'application/pdf' },
  { name: 'experience.pdf', type: 'application/pdf' },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [profilePhotoList, setProfilePhotoList] = useState<UploadFile[]>([]);
  const [resumeList, setResumeList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);
  const [resumePickerOpen, setResumePickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      resumeList.length === 1 &&
      resumeList[0].name === 'resume.pdf' &&
      resumeList[0].status === 'done' &&
      profilePhotoList.length === 0
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [resumeList, profilePhotoList, completed, onSuccess]);

  const handleSelectProfilePhoto = async (sample: SampleFile) => {
    setProfilePickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231677ff" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="white" font-size="10">${sample.name.substring(0, 8)}</text></svg>`,
    };
    
    setProfilePhotoList([newFile]);
    
    await simulateUpload(500);
    setProfilePhotoList([{ ...newFile, status: 'done' }]);
  };

  const handleSelectResume = async (sample: SampleFile) => {
    setResumePickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setResumeList([newFile]);
    
    await simulateUpload(500);
    setResumeList([{ ...newFile, status: 'done' }]);
  };

  const profilePhotoProps: UploadProps = {
    accept: '.png,.jpg,.jpeg,image/png,image/jpeg',
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    fileList: profilePhotoList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setProfilePhotoList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const resumeProps: UploadProps = {
    accept: '.pdf,application/pdf',
    multiple: false,
    fileList: resumeList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setResumeList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <Card title="Candidate profile" style={{ width: 500 }}>
      {/* Profile photo section */}
      <div data-testid="uploader-profile-photo" onClick={() => profilePhotoList.length === 0 && setProfilePickerOpen(true)}>
        <Title level={5} style={{ marginBottom: 12 }}>Profile photo</Title>
        <Upload {...profilePhotoProps}>
          {profilePhotoList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Select file</div>
            </div>
          )}
        </Upload>
      </div>

      <Divider />

      {/* Resume section */}
      <div data-testid="uploader-resume" onClick={() => setResumePickerOpen(true)}>
        <Title level={5} style={{ marginBottom: 12 }}>Resume</Title>
        <Upload {...resumeProps}>
          <Button icon={<UploadOutlined />}>Select file</Button>
        </Upload>
      </div>

      {/* Profile photo picker modal */}
      <Modal
        title="Sample images"
        open={profilePickerOpen}
        onCancel={() => setProfilePickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={PROFILE_PHOTO_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectProfilePhoto(item)}
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

      {/* Resume picker modal */}
      <Modal
        title="Sample files"
        open={resumePickerOpen}
        onCancel={() => setResumePickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={RESUME_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectResume(item)}
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
