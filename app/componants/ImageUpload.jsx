import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploadComponent = () => {
  const [fileList, setFileList] = useState([]);

  const handleFileUpload = async () => {
    if (fileList.length === 0) {
      message.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj); // Append the file to FormData

    try {
      const response = await fetch("/api/fileUpload/local", {
        method: "POST",
        body: formData, // Send FormData as the request body
      });

      const result = await response.json();

      if (result.success) {
        message.success("File uploaded successfully");
        console.log("File URL:", result.url); // Use the uploaded file URL as needed
      } else {
        message.error(result.message || "File upload failed");
      }
    } catch (error) {
      message.error("Error uploading file");
      console.error(error);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <div>
      <Upload
        listType="picture"
        beforeUpload={() => false} // Prevent auto upload, we'll handle it manually
        onChange={handleChange}
        fileList={fileList}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <Button
        type="primary"
        onClick={handleFileUpload}
        style={{ marginTop: "16px" }}
      >
        Upload
      </Button>
    </div>
  );
};

export default FileUploadComponent;
