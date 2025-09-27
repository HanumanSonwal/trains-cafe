// import React, { useEffect, useState } from "react";
// import SunEditor from "suneditor-react";
// import "suneditor/dist/css/suneditor.min.css";
// import "./TextEditor.css";

// const TextEditor = ({
//   previousValue = "",
//   updatedValue,
//   height = 200,
//   label = "",
// }) => {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const handleChange = (content) => {
//     updatedValue(content);
//   };

//   if (!isClient) return null;

//   return (
//     <div className="text-editor-container">
//       {label && <label className="editor-label mb-2">{label}</label>}
//       <SunEditor
//         setContents={previousValue}
//         onChange={handleChange}
//         setOptions={{
//           height: height,
//           minHeight: 100,
//           buttonList: [
//             ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
//             [
//               "bold",
//               "underline",
//               "italic",
//               "strike",
//               "subscript",
//               "superscript",
//               "removeFormat",
//             ],
//             [
//               "fontColor",
//               "hiliteColor",
//               "outdent",
//               "indent",
//               "align",
//               "horizontalRule",
//               "list",
//               "table",
//             ],
//             [
//               "link",
//               "image",
//               "video",
//               "fullScreen",
//               "showBlocks",
//               "codeView",
//               "preview",
//               "print",
//               "save",
//             ],
//           ],
//           buttonSize: "sm",
//           defaultStyle: "font-size:14px;",
//           charCounter: false,
//         }}
//       />
//     </div>
//   );
// };

// export default TextEditor;


import React, { useEffect, useState, useRef } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./TextEditor.css";

const TextEditor = ({
  previousValue = "",
  updatedValue,
  height = 200,
  label = "",
}) => {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (content) => {
    updatedValue(content);
  };

  if (!isClient) return null;

  return (
    <div className="text-editor-container">
      {label && <label className="editor-label mb-2">{label}</label>}
      <SunEditor
        ref={editorRef}
        setContents={previousValue}
        onChange={handleChange}
        setOptions={{
          height: height,
          minHeight: 100,
          buttonList: [
            ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
              "removeFormat",
            ],
            [
              "fontColor",
              "hiliteColor",
              "outdent",
              "indent",
              "align",
              "horizontalRule",
              "list",
              "table",
            ],
            [
              "link",
              "image",
              "video",
              "fullScreen",
              "showBlocks",
              "codeView",
              "preview",
              "print",
              "save",
            ],
          ],
          buttonSize: "sm",
          defaultStyle: "font-size:14px; line-height:1.6; margin:8px 0;", 
          formats: [
            "p",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "pre",
            "blockquote",
          ], 
        }}
      />
    </div>
  );
};

export default TextEditor;
