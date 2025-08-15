// // this sun editor intigration

// import React, { useEffect, useState } from "react";
// import SunEditor from "suneditor-react";
// import "suneditor/dist/css/suneditor.min.css";

// const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     // This ensures the editor is only rendered on the client-side
//     setIsClient(true);
//   }, []);

//   const handleChange = (content) => {
//     updatedValue(content);
//   };

//   if (!isClient) {
//     return null; 
//   }

//   return (
//     <SunEditor
//       setContents={previousValue}
//       onChange={handleChange}
//       setOptions={{
//         height: height || 100,
//         buttonList: [
//           ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
//           [
//             "bold",
//             "underline",
//             "italic",
//             "strike",
//             "subscript",
//             "superscript",
//             "removeFormat",
//           ],
//           [
//             "fontColor",
//             "hiliteColor",
//             "outdent",
//             "indent",
//             "align",
//             "horizontalRule",
//             "list",
//             "table",
//           ],
//           [
//             "link",
//             "image",
//             "video",
//             "fullScreen",
//             "showBlocks",
//             "codeView",
//             "preview",
//             "print",
//             "save",
//           ],
//         ],
//       }}
//     />
//   );
// };

// export default TextEditor;


import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./TextEditor.css"; 

const TextEditor = ({ 
  previousValue = "", 
  updatedValue, 
  height = 200,  
  label = ""     
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
  }, []);

  const handleChange = (content) => {
    updatedValue(content);
  };

  if (!isClient) return null;

  return (
    <div className="text-editor-container">
      {label && (
        <label className="editor-label mb-2">{label}</label>
      )}
      <SunEditor
        setContents={previousValue}
        onChange={handleChange}
        setOptions={{
          height: height,
          minHeight: 100,
          buttonList: [
            ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript", "removeFormat"],
            ["fontColor", "hiliteColor", "outdent", "indent", "align", "horizontalRule", "list", "table"],
            ["link", "image", "video", "fullScreen", "showBlocks", "codeView", "preview", "print", "save"],
          ],
          buttonSize: "sm",
          defaultStyle: "font-size:14px;", 
          charCounter: false,
        }}
      />
    </div>
  );
};

export default TextEditor;




// this Jodit editor intigration

// import React, { useEffect, useState } from "react";
// import JoditEditor from "jodit-react";

// const TextEditor = ({
//   value,
//   onChange,
//   onBlur,
//   name,
//   placeholder,
//   className,
// }) => {
//   const [editorData, setEditorData] = useState(value);

//   useEffect(() => {
//     if (editorData) {
//       onChange({
//         target: { name, value: editorData },
//       });
//     }
//   }, [editorData]);

//   const editorConfig = {
//     readonly: false,
//     tabIndex: 1,
//     askBeforePasteHTML: false,
//     askBeforePasteFromWord: false,
//     defaultActionOnPaste: "insert_clear_html",
//     placeholder: placeholder,
//     beautyHTML: true,
//     toolbarButtonSize: "large",
//     buttons: [
//       "source",
//       "|",
//       "bold",
//       "italic",
//       "|",
//       "ul",
//       "ol",
//       "|",
//       "font",
//       "fontsize",
//       "brush",
//       "paragraph",
//       "|",
//       "video",
//       "table",
//       "link",
//       "|",
//       "left",
//       "center",
//       "right",
//       "justify",
//       "|",
//       "undo",
//       "redo",
//       "|",
//       "hr",
//       "eraser",
//       "fullsize",
//       "image",
//     ],
//     enableDragAndDropFileToEditor: true,
//     uploader: {
//       insertImageAsBase64URI: true,
//       imagesExtensions: ["jpg", "png", "jpeg", "gif"],
//       prepareData: (formData) => {
//         const alt = formData.get("alt") || "";
//         const file = formData.get("file");
//         const data = new FormData();
//         data.append("file", file, file.name);
//         data.append("alt", alt);
//         return data;
//       },
//     },
//   };

//   return (
//     <JoditEditor
//       value={value}
//       onBlur={(newContent) => setEditorData(newContent)}
//       config={editorConfig}
//     />
//   );
// };

// export default TextEditor;



// this CK editor intigration


// import React, { useEffect, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true); // Ensure CKEditor is only rendered on the client-side
//   }, []);

//   const handleChange = (event, editor) => {
//     const content = editor.getData();
//     updatedValue(content);
//   };

//   if (!isClient) {
//     return null; // Return null during server-side rendering
//   }

//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       data={previousValue}
//       onChange={handleChange}
//       config={{
//         toolbar: [
//           "undo",
//           "redo",
//           "|",
//           "heading",
//           "bold",
//           "italic",
//           "underline",
//           "strikethrough",
//           "subscript",
//           "superscript",
//           "|",
//           "fontColor",
//           "fontBackgroundColor",
//           "bulletedList",
//           "numberedList",
//           "outdent",
//           "indent",
//           "alignment",
//           "|",
//           "link",
//           "insertTable",
//           "blockQuote",
//           "imageUpload",
//           "mediaEmbed",
//           "codeBlock",
//           "horizontalLine",
//           "|",
//           "preview",
//           "print",
//           "sourceEditing",
//         ],
//       }}
//     />
//   );
// };

// export default TextEditor;


// this CK editor with upload api intigration

// import React, { useEffect, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { Controller } from "react-hook-form"; // For React Hook Form Controller
// import { Col } from "antd"; // Assuming you are using Ant Design for layout

// const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true); // Ensure CKEditor is only rendered on the client-side
//   }, []);

//   const handleChange = (event, editor) => {
//     const content = editor.getData();
//     updatedValue(content); // Update the form field when content changes
//   };

//   if (!isClient) {
//     return null; // Return null during server-side rendering
//   }

//   return (
//     <CKEditor
//       editor={ClassicEditor}
//       data={previousValue} // Set the initial value of the editor
//       onChange={handleChange}
//       config={{
//         toolbar: [
//           "undo",
//           "redo",
//           "|",
//           "heading",
//           "bold",
//           "italic",
//           "underline",
//           "strikethrough",
//           "subscript",
//           "superscript",
//           "|",
//           "fontColor",
//           "fontBackgroundColor",
//           "bulletedList",
//           "numberedList",
//           "outdent",
//           "indent",
//           "alignment",
//           "|",
//           "link",
//           "insertTable",
//           "blockQuote",
//           "imageUpload", // Image Upload button
//           "mediaEmbed",
//           "codeBlock",
//           "horizontalLine",
//           "|",
//           "preview",
//           "print",
//           "sourceEditing",
//         ],
//         image: {
//           toolbar: [
//             "imageTextAlternative",
//             "|",
//             "imageStyle:full",
//             "imageStyle:side",
//           ],
//         },
//         simpleUpload: {
//           uploadUrl: "/api/fileUpload/local", // API endpoint for uploading image
//           withCredentials: true, // Optional, if you need to send credentials with the request
//           headers: {
//             // Optional, for auth headers if needed
//             Authorization: "Bearer YOUR_ACCESS_TOKEN", // if you have auth
//           },
//         },
//       }}
//     />
//   );
// };


