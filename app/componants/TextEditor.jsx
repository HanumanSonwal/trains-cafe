"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

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
        onBlur={(newContent) => {
          setContent(newContent);
          if (onChange) onChange(newContent);
        }}
        onChange={() => {}}
      />
    </div>
  );
};

export default TextEditor;
