// // import React, { useState } from "react";
// // import { Upload, message, Image, Button } from "antd";
// // import { UploadOutlined } from "@ant-design/icons";

// // const FileUploadComponent = ({ url, setUrl }) => {
// //   const [fileList, setFileList] = useState([]);

// //   const handleFileUpload = async (file) => {
// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const response = await fetch("/api/fileUpload/local", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         message.success("File uploaded successfully");
// //         setUrl(result.url); 
// //         console.log("File URL:", result.url);
// //       } else {
// //         message.error(result.message || "File upload failed");
// //       }
// //     } catch (error) {
// //       message.error("Error uploading file");
// //       console.error(error);
// //     }
// //   };

// //   const handleChange = ({ fileList: newFileList }) => {
// //     setFileList(newFileList);

// //     if (newFileList.length > 0) {
// //       handleFileUpload(newFileList[0].originFileObj);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Upload
// //         listType="picture"
// //         beforeUpload={() => false}
// //         onChange={handleChange}
// //         fileList={fileList}
// //         showUploadList={false}
// //       >
// //         <Button icon={<UploadOutlined />}>Select File</Button>
// //       </Upload>

// //       {url && ( 
// //         <div style={{ marginTop: "16px" }}>
// //           <h3>Uploaded Image:</h3>
// //           <Image
// //             src={url}
// //             alt="Uploaded Image"
// //             width={150} 
            
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FileUploadComponent;

// import React, { useEffect, useState } from "react";
// import { PlusOutlined } from "@ant-design/icons";
// import { Upload, message, Image, Button } from "antd";

// // Helper function to convert file to Base64 for preview
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const FileUploadComponent = ({ url, setUrl }) => {
//   const [fileList, setFileList] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   // Update fileList when editing category with pre-existing image
//   useEffect(() => {
//     if (url) {
//       setFileList([
//         {
//           uid: "-1", // unique identifier for the file
//           name: "image.png", // You can set this to the actual image name if available
//           status: "done", // Status of the upload
//           url: url, // The image URL to display in preview
//         },
//       ]);
//     }
//   }, [url]);

//   const handleFileUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/fileUpload/local", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         message.success("File uploaded successfully");
//         setUrl(result.url);
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

//     if (newFileList.length > 0 && newFileList[0].originFileObj) {
//       handleFileUpload(newFileList[0].originFileObj);
//     }
//   };

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };

//   const uploadButton = (
//     <Button icon={<PlusOutlined />}>Upload</Button>
//   );

//   return (
//     <div>
//       <Upload
//         listType="picture-card"
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//         beforeUpload={() => false} // Prevent auto-upload, handle it manually
//       >
//         {fileList.length >= 1 ? null : uploadButton}
//       </Upload>

//       {previewImage && (
//         <Image
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(""),
//           }}
//           src={previewImage}
//           wrapperStyle={{ display: "none" }}
//         />
//       )}
//     </div>
//   );
// };

// export default FileUploadComponent;

import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, message, Image, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define your Zod schema
const schema = z.object({
  files: z.array(z.instanceof(File)).min(1, "At least one file is required").refine((files) => files.every(file => file.size <= 2 * 1024 * 1024), {
    message: "Each file must be less than 2MB",
  }).refine((files) => files.every(file => ["image/jpeg", "image/png", "image/gif"].includes(file.type)), {
    message: "Only .jpeg, .png, and .gif formats are supported",
  }),
});

const FileUploadComponent = ({ url, setUrl, reset }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (url) {
      setFileList(url.map((fileUrl, index) => ({
        uid: index.toString(),
        name: `image-${index}.png`,
        status: "done",
        url: fileUrl,
      })));
    }
  }, [url]);

  const handleFileUpload = async (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      const response = await fetch("/api/fileUpload/local", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("Files uploaded successfully");
        setUrl(result.urls); // Assume the response contains an array of URLs
        console.log("File URLs:", result.urls);
      } else {
        message.error(result.message || "File upload failed");
      }
    } catch (error) {
      message.error("Error uploading files");
      console.error(error);
    }
  };

  const onSubmit = (data) => {
    handleFileUpload(data.files);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setValue("files", newFileList.map(file => file.originFileObj));
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <Button icon={<PlusOutlined />}>Upload</Button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="files"
        control={control}
        render={({ field }) => (
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={(info) => {
              handleChange(info);
              field.onChange(info.fileList.map(file => file.originFileObj));
            }}
            beforeUpload={() => false}
            multiple
          >
            {fileList.length >= 5 ? null : uploadButton} {/* Limit to 5 images */}
          </Upload>
        )}
      />
      {errors.files && <p style={{ color: "red" }}>{errors.files.message}</p>}

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
    </form>
  );
};

export default FileUploadComponent;

