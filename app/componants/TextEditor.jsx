"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const TextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  height = 300,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const config = useMemo(
    () => ({
      readonly: false,
      height,
      placeholder,
      toolbarAdaptive: false, 
      toolbarSticky: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush", 
        "paragraph",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "link",
        "image",
        "table",
        "hr",
        "|",
        "undo",
        "redo",
        "copyformat",
        "selectall",
        "cut",
        "copy",
        "paste",
        "|",
        "fullsize",
        "preview",
        "print",
      ],
      // uploader: {
      //   insertImageAsBase64URI: true, 
      // },
      removeButtons: ["about"],
      showCharsCounter: false,
      showWordsCounter: false,
      showXPathInStatusbar: false,
    }),
    [placeholder, height]
  );

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onChange={(newContent) => {
          setContent(newContent);
          if (onChange) onChange(newContent);
        }}
      />
    </div>
  );
};

export default TextEditor;
