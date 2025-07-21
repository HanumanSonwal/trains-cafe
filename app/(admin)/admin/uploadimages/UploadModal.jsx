// "use client";

// import { Modal, Button, Select, Input, message, Col } from "antd";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import MultiImageUploader from "./MultiImageUploader";

// const UploadModal = ({ open, onCancel, fetchImages, editingImage }) => {
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [newFolder, setNewFolder] = useState("");
//   const [urls, setUrls] = useState([]);

//   useEffect(() => {
//     getFolders();
//     if (editingImage) {
//       setSelectedFolder(editingImage.folder);
//       setUrls([editingImage.url]);
//     } else {
//       setSelectedFolder("");
//       setUrls([]);
//     }
//   }, [editingImage]);

//   const getFolders = async () => {
//     const { data } = await axios.get("/api/folders");
//     if (data.success) {
//       setFolders(data.folders);
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedFolder) {
//       message.error("Select or add a folder");
//       return;
//     }

//     if (urls.length === 0) {
//       message.error("Please upload images");
//       return;
//     }

//     try {
//       if (editingImage) {
//         await axios.put(`/api/images?id=${editingImage._id}`, {
//           url: urls[0],
//           folder: selectedFolder,
//         });
//       } else {
//         await axios.post("/api/images", {
//           urls,
//           folder: selectedFolder,
//         });
//       }
//       message.success("Saved");
//       fetchImages();
//       onCancel();
//     } catch {
//       message.error("Error saving");
//     }
//   };

//   return (
//     <Modal
//       title={editingImage ? "Edit Image" : "Upload Images"}
//       open={open}
//       onCancel={onCancel}
//       footer={[
//         <Button
//           key="submit"
//           type="primary"
//           style={{ background: "#D6872A", borderColor: "#D6872A" }}
//           onClick={handleSave}
//         >
//           {editingImage ? "Save Changes" : "Upload"}
//         </Button>,
//       ]}
//     >
//       <Col span={24} className="mb-4">
//         <label className="block mb-1">Select Folder</label>
//         <Select
//           value={selectedFolder}
//           style={{ width: "100%", marginBottom: "1rem" }}
//           placeholder="Select existing folder"
//           onChange={(val) => setSelectedFolder(val)}
//           options={folders.map((f) => ({ label: f, value: f }))}
//         />
//         <Input
//           placeholder="Or create new folder"
//           value={newFolder}
//           onChange={(e) => {
//             setNewFolder(e.target.value);
//             setSelectedFolder(e.target.value);
//           }}
//         />
//       </Col>

//       <Col span={24}>
//         <MultiImageUploader
//           folderName={selectedFolder}
//           onUploaded={(url) => setUrls((prev) => [...prev, url])}
//         />
//       </Col>
//     </Modal>
//   );
// };

// export default UploadModal;


"use client";

import { Modal, Button, Select, Input, message, Col } from "antd";
import { useState, useEffect } from "react";
import MultiImageUploader from "./MultiImageUploader";
import axios from "axios";

const UploadModal = ({ open, onCancel, fetchImages, editingImage }) => {
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [newFolder, setNewFolder] = useState("");
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    getFolders();
    if (editingImage) {
      setSelectedFolder(editingImage.folder);
      setUrls([editingImage.url]);
    } else {
      setSelectedFolder("");
      setUrls([]);
    }
  }, [editingImage]);

  const getFolders = async () => {
    const { data } = await axios.get("/api/folders");
    if (data.success) {
      setFolders(data.folders);
    }
  };

  const handleSave = async () => {
    const finalFolder = newFolder.trim() || selectedFolder;

    if (!finalFolder) {
      message.error("Please select or add folder");
      return;
    }

    if (urls.length === 0) {
      message.error("Please upload at least one image");
      return;
    }

    try {
      if (editingImage) {
        await axios.put(`/api/images?id=${editingImage._id}`, {
          url: urls[0],
          folder: finalFolder,
        });
      } else {
        await axios.post("/api/images", {
          urls,
          folder: finalFolder,
        });
      }
      message.success("Saved successfully");
      fetchImages();
      onCancel();
    } catch {
      message.error("Save failed");
    }
  };

  return (
    <Modal
      title={editingImage ? "Edit Image" : "Upload Images"}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSave}
          style={{ background: "#D6872A", borderColor: "#D6872A" }}
        >
          {editingImage ? "Save Changes" : "Upload"}
        </Button>,
      ]}
    >
      <Col span={24} className="mb-4">
        <label className="block mb-1">Select Existing Folder</label>
        <Select
          value={selectedFolder}
          style={{ width: "100%", marginBottom: 8 }}
          placeholder="Select folder"
          options={folders.map((f) => ({ label: f, value: f }))}
          onChange={(val) => {
            setSelectedFolder(val);
            setNewFolder(""); // clear new folder if selected
          }}
        />
        <label className="block mb-1">Or Create New Folder</label>
        <Input
          placeholder="Type new folder name"
          value={newFolder}
          onChange={(e) => {
            setNewFolder(e.target.value);
            if (e.target.value) setSelectedFolder("");
          }}
        />
      </Col>

      <Col span={24}>
        <MultiImageUploader
          folderName={newFolder || selectedFolder}
          onUploaded={(url) => setUrls((prev) => [...prev, url])}
        />
      </Col>
    </Modal>
  );
};

export default UploadModal;
