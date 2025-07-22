"use client";

import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const MultiImageUploader = ({ onFilesSelected }) => {
  const props = {
    multiple: true,
    beforeUpload: (file, fileList) => {
      onFilesSelected([...fileList]); 
      return false; 
    },
    onDrop(e) {
      onFilesSelected(Array.from(e.dataTransfer.files)); 
    },
  };

  return (
    <Dragger {...props} accept="image/*">
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag image files to upload</p>
    </Dragger>
  );
};

export default MultiImageUploader;
