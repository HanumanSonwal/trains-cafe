import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, message, Image, Button } from "antd";

const FileUploadComponent = ({ url, setUrl, isreset }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isreset) {
      setFileList([]);
      setPreviewImage("");
      setUrl("");
    }
  }, [isreset]);


  useEffect(() => {
    if (url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: url,
        },
      ]);
    }
  }, [url]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/fileUpload/local", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("File uploaded successfully");
        setUrl(result.url);
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

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      handleFileUpload(newFileList[0].originFileObj);
    } else {
      setUrl(""); 
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} 
      >
        {fileList.length >= 1 ? null : (
          <Button icon={<PlusOutlined />}>Upload</Button>
        )}
      </Upload>

      {previewImage && (
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          wrapperStyle={{ display: "none" }}
        />
      )}
    </>
  );
};


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default FileUploadComponent;


