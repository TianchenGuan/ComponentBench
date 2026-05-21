'use client';

/**
 * file_upload_button-antd-T09: Replace an existing logo image (dark theme, 2 instances)
 *
 * setup_description: A dark-themed centered card titled "Brand assets" contains two Ant Design 
 * Upload components side-by-side. Left: "Company logo" uses picture-card thumbnails with maxCount=1 
 * and already has one uploaded image tile labeled "logo_old.png". Right: "Team photo" is another 
 * picture-card uploader that starts empty and is a distractor. In the Company logo tile, small 
 * overlay icons for preview and remove appear on hover. Selecting a new file while maxCount=1 
 * is set replaces the existing file; alternatively, the user may remove the old file and then 
 * upload the new one.
 *
 * Success: The uploader labeled "Company logo" contains exactly one file named "logo_new.png" 
 *          with status "done". "logo_old.png" is not present. The "Team photo" uploader remains empty.
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List } from 'antd';
import { PlusOutlined, FileImageOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Title } = Typography;

const COMPANY_LOGO_FILES: SampleFile[] = [
  { name: 'logo_new.png', type: 'image/png' },
  { name: 'brand_logo.png', type: 'image/png' },
  { name: 'icon.png', type: 'image/png' },
];

const TEAM_PHOTO_FILES: SampleFile[] = [
  { name: 'team_2025.jpg', type: 'image/jpeg' },
  { name: 'group_photo.png', type: 'image/png' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [companyLogoList, setCompanyLogoList] = useState<UploadFile[]>([
    {
      uid: 'existing-logo',
      name: 'logo_old.png',
      status: 'done',
      thumbUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23ff4d4f" width="100" height="100"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="14">OLD</text></svg>',
    },
  ]);
  const [teamPhotoList, setTeamPhotoList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [companyLogoPickerOpen, setCompanyLogoPickerOpen] = useState(false);
  const [teamPhotoPickerOpen, setTeamPhotoPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    const hasOldLogo = companyLogoList.some((f) => f.name === 'logo_old.png');
    const hasNewLogo = companyLogoList.some((f) => f.name === 'logo_new.png' && f.status === 'done');
    
    if (
      companyLogoList.length === 1 &&
      hasNewLogo &&
      !hasOldLogo &&
      teamPhotoList.length === 0
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [companyLogoList, teamPhotoList, completed, onSuccess]);

  const handleSelectCompanyLogo = async (sample: SampleFile) => {
    setCompanyLogoPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%2352c41a" width="100" height="100"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="12">NEW</text></svg>`,
    };
    
    setCompanyLogoList([newFile]); // Replace any existing
    
    await simulateUpload(500);
    setCompanyLogoList([{ ...newFile, status: 'done' }]);
  };

  const handleSelectTeamPhoto = async (sample: SampleFile) => {
    setTeamPhotoPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
      thumbUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231677ff" width="100" height="100"/></svg>`,
    };
    
    setTeamPhotoList([newFile]);
    
    await simulateUpload(500);
    setTeamPhotoList([{ ...newFile, status: 'done' }]);
  };

  const companyLogoProps: UploadProps = {
    accept: '.png,.jpg,.jpeg,image/png,image/jpeg',
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    fileList: companyLogoList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setCompanyLogoList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const teamPhotoProps: UploadProps = {
    accept: '.png,.jpg,.jpeg,image/png,image/jpeg',
    multiple: false,
    maxCount: 1,
    listType: 'picture-card',
    fileList: teamPhotoList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setTeamPhotoList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Card 
      title="Brand assets" 
      style={{ width: 500, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
    >
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Company logo */}
        <div data-testid="uploader-company-logo" onClick={() => setCompanyLogoPickerOpen(true)}>
          <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Company logo</Title>
          <Upload {...companyLogoProps}>
            {companyLogoList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
        
        {/* Team photo - distractor */}
        <div data-testid="uploader-team-photo" onClick={() => teamPhotoList.length === 0 && setTeamPhotoPickerOpen(true)}>
          <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Team photo</Title>
          <Upload {...teamPhotoProps}>
            {teamPhotoList.length >= 1 ? null : uploadButton}
          </Upload>
        </div>
      </div>

      {/* Company logo picker modal */}
      <Modal
        title="Sample images"
        open={companyLogoPickerOpen}
        onCancel={() => setCompanyLogoPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={COMPANY_LOGO_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectCompanyLogo(item)}
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

      {/* Team photo picker modal */}
      <Modal
        title="Sample images"
        open={teamPhotoPickerOpen}
        onCancel={() => setTeamPhotoPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={TEAM_PHOTO_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectTeamPhoto(item)}
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
