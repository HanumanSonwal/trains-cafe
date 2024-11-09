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
//     return null; // Return null on server side rendering
//   }

//   return (
//     <SunEditor
//       setContents={previousValue}
//       onChange={handleChange}
//       setOptions={{
//         height: height || 200,
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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure CKEditor is only rendered on the client-side
  }, []);

  const handleChange = (event, editor) => {
    const content = editor.getData();
    updatedValue(content);
  };

  if (!isClient) {
    return null; // Return null during server-side rendering
  }

  return (
    <CKEditor
      editor={ClassicEditor}
      data={previousValue}
      onChange={handleChange}
      config={{
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "|",
          "fontColor",
          "fontBackgroundColor",
          "bulletedList",
          "numberedList",
          "outdent",
          "indent",
          "alignment",
          "|",
          "link",
          "insertTable",
          "blockQuote",
          "imageUpload",
          "mediaEmbed",
          "codeBlock",
          "horizontalLine",
          "|",
          "preview",
          "print",
          "sourceEditing",
        ],
      }}
    />
  );
};

export default TextEditor;
