import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the editor is only rendered on the client-side
    setIsClient(true);
  }, []);

  const handleChange = (content) => {
    updatedValue(content);
  };

  if (!isClient) {
    return null; // Return null on server side rendering
  }

  return (
    <SunEditor
      setContents={previousValue}
      onChange={handleChange}
      setOptions={{
        height: height || 200,
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
      }}
    />
  );
};

export default TextEditor;
