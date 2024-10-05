// import React, { useState } from "react";
// import { Upload, Button, message } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const FileUploadComponent = ({url , setUrl}) => {
//   const [fileList, setFileList] = useState([]);

//   const handleFileUpload = async () => {
//     if (fileList.length === 0) {
//       message.error("Please select a file to upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", fileList[0].originFileObj); 

//     try {
//       const response = await fetch("/api/fileUpload/local", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         message.success("File uploaded successfully");
//         setUrl(result.url)
//         console.log("File URL:", result.url); 
//       } else {
//         message.error(result.message || "File upload failed");
//       }
//     } catch (error) {
//       message.error("Error uploading file");
//       console.error(error);
//     }
//   };

//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);
//   };

//   return (
//     <div>
//       <Upload
//         listType="picture"
//         beforeUpload={() => false} 
//         onChange={handleChange}
//         fileList={fileList}
//       >
//         <Button icon={<UploadOutlined />}>Select File</Button>
//       </Upload>

//       <Button
//         type="primary"
//         onClick={handleFileUpload}
//         style={{ marginTop: "16px" }}
//       >
//         Upload
//       </Button>
//     </div>
//   );
// };

// export default FileUploadComponent;


import React, { useState } from "react";
import { Upload, message, Image, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FileUploadComponent = ({ url, setUrl }) => {
  const [fileList, setFileList] = useState([]);

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
        setUrl(result.url); // Set the uploaded file URL
        console.log("File URL:", result.url);
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

    if (newFileList.length > 0) {
      // Automatically upload the selected file
      handleFileUpload(newFileList[0].originFileObj);
    }
  };

  return (
    <div>
      <Upload
        listType="picture"
        beforeUpload={() => false} // Prevent automatic upload by Ant Design
        onChange={handleChange}
        fileList={fileList}
        showUploadList={false} // Hide the upload button list
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      {url && ( // Conditionally render the uploaded image
        <div style={{ marginTop: "16px" }}>
          <h3>Uploaded Image:</h3>
          <Image
            src={url} // Use the uploaded image URL
            alt="Uploaded Image"
            width={200} // Adjust the size as needed
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;

