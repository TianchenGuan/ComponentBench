'use client';

/**
 * file_upload_button-antd-T08: Manual upload with Start upload in a settings panel (3 instances)
 *
 * setup_description: The page uses a settings-panel layout titled "Profile settings" with multiple 
 * subsections and medium clutter (toggles and text inputs are visible but irrelevant). In the 
 * "Documents" subsection there are three Ant Design Upload instances stacked vertically with 
 * headings: "Profile photo", "Resume (PDF)", and "Cover letter". "Profile photo" is a picture-card 
 * uploader and already contains one image file (pre-filled) to act as a distractor. "Resume (PDF)" 
 * is the target uploader and starts empty; it is configured for manual upload: selecting a file 
 * adds it to the list in a "ready" state and does not upload automatically. Directly below the 
 * Resume uploader's file list is a small primary button labeled "Start upload" that must be 
 * clicked to complete the upload. "Cover letter" is another text-style uploader with an existing 
 * file in its list. Only the Resume uploader's file list determines success for this task.
 *
 * Success: The uploader labeled "Resume (PDF)" contains exactly one file named "report_final.pdf" 
 *          with status "done", which only happens after clicking "Start upload".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Switch, Input, Divider, Space, Modal, List } from 'antd';
import { UploadOutlined, PlusOutlined, FileOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { generateUid } from '../types';

const { Title, Text } = Typography;

const RESUME_FILES: SampleFile[] = [
  { name: 'report_final.pdf', type: 'application/pdf' },
  { name: 'resume_v2.pdf', type: 'application/pdf' },
  { name: 'cv_updated.pdf', type: 'application/pdf' },
];

const PROFILE_PHOTO_FILES: SampleFile[] = [
  { name: 'new_avatar.jpg', type: 'image/jpeg' },
  { name: 'profile_pic.png', type: 'image/png' },
];

const COVER_LETTER_FILES: SampleFile[] = [
  { name: 'cover_letter_new.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  { name: 'application_letter.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [profilePhotoList, setProfilePhotoList] = useState<UploadFile[]>([
    {
      uid: 'existing-photo',
      name: 'avatar.jpg',
      status: 'done',
      thumbUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231677ff" width="100" height="100"/></svg>',
    },
  ]);
  const [resumeList, setResumeList] = useState<UploadFile[]>([]);
  const [coverLetterList, setCoverLetterList] = useState<UploadFile[]>([
    {
      uid: 'existing-cover',
      name: 'cover_letter_v2.docx',
      status: 'done',
    },
  ]);
  const [completed, setCompleted] = useState(false);
  const [startUploadClicked, setStartUploadClicked] = useState(false);
  const [resumePickerOpen, setResumePickerOpen] = useState(false);
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);
  const [coverLetterPickerOpen, setCoverLetterPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      resumeList.length === 1 &&
      resumeList[0].name === 'report_final.pdf' &&
      resumeList[0].status === 'done' &&
      startUploadClicked
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [resumeList, startUploadClicked, completed, onSuccess]);

  const handleStartUpload = () => {
    if (resumeList.length > 0 && resumeList[0].status !== 'done') {
      setStartUploadClicked(true);
      // Simulate upload completion
      setTimeout(() => {
        setResumeList((prev) =>
          prev.map((f) => ({ ...f, status: 'done' }))
        );
      }, 500);
    }
  };

  const handleSelectResume = (sample: SampleFile) => {
    setResumePickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading', // Show as pending/ready
    };
    
    setResumeList([newFile]);
  };

  const handleSelectProfilePhoto = async (sample: SampleFile) => {
    setProfilePickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231677ff" width="100" height="100"/></svg>`,
    };
    
    setProfilePhotoList([newFile]);
    
    setTimeout(() => {
      setProfilePhotoList([{ ...newFile, status: 'done' }]);
    }, 500);
  };

  const handleSelectCoverLetter = async (sample: SampleFile) => {
    setCoverLetterPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setCoverLetterList((prev) => [...prev, newFile]);
    
    setTimeout(() => {
      setCoverLetterList((prev) =>
        prev.map((f) => (f.uid === newFile.uid ? { ...f, status: 'done' } : f))
      );
    }, 500);
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
    showUploadList: true,
  };

  return (
    <Card title="Profile settings" style={{ width: 550 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Basic settings section */}
        <div>
          <Title level={5}>General</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Public profile</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Email notifications</Text>
              <Switch />
            </div>
            <div>
              <Text style={{ display: 'block', marginBottom: 4 }}>Display name</Text>
              <Input defaultValue="John Doe" />
            </div>
          </Space>
        </div>

        <Divider />

        {/* Documents section */}
        <div>
          <Title level={5}>Documents</Title>
          
          {/* Profile photo - distractor */}
          <div data-testid="uploader-profile-photo" style={{ marginBottom: 16 }} onClick={() => profilePhotoList.length === 0 && setProfilePickerOpen(true)}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Profile photo</Text>
            <Upload
              listType="picture-card"
              fileList={profilePhotoList}
              maxCount={1}
              beforeUpload={() => false}
              openFileDialogOnClick={false}
              onRemove={(file) => {
                setProfilePhotoList((prev) => prev.filter((f) => f.uid !== file.uid));
              }}
            >
              {profilePhotoList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>
          
          {/* Resume - target */}
          <div data-testid="uploader-resume" style={{ marginBottom: 16 }} onClick={() => setResumePickerOpen(true)}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Resume (PDF)</Text>
            <Upload {...resumeProps}>
              <Button icon={<UploadOutlined />}>Select file</Button>
            </Upload>
            {resumeList.length > 0 && resumeList[0].status !== 'done' && (
              <Button 
                type="primary" 
                size="small" 
                style={{ marginTop: 8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartUpload();
                }}
              >
                Start upload
              </Button>
            )}
          </div>
          
          {/* Cover letter - distractor */}
          <div data-testid="uploader-cover-letter" onClick={() => setCoverLetterPickerOpen(true)}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Cover letter</Text>
            <Upload
              fileList={coverLetterList}
              beforeUpload={() => false}
              openFileDialogOnClick={false}
              onRemove={(file) => {
                setCoverLetterList((prev) => prev.filter((f) => f.uid !== file.uid));
              }}
            >
              <Button icon={<UploadOutlined />}>Select file</Button>
            </Upload>
          </div>
        </div>
      </Space>

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

      {/* Cover letter picker modal */}
      <Modal
        title="Sample files"
        open={coverLetterPickerOpen}
        onCancel={() => setCoverLetterPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={COVER_LETTER_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectCoverLetter(item)}
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
