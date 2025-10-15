
import React, { useState, useEffect } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnStrikeThrough,
  BtnUnderline,
  BtnUndo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

const RichTextEditor = ({ onRichTextEditorChange, value, index }) => {
  const [editorValue, setEditorValue] = useState(value);

  // This useEffect hook will sync the editor's internal state
  // with the value prop from the parent component.
  // This is crucial for updating the editor when AI generates new content.
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (e) => {
    setEditorValue(e.target.value);
    if (onRichTextEditorChange) {
      onRichTextEditorChange(e, index);
    }
  };

  return (
    <div className="mt-2">
      <EditorProvider>
        <Editor value={editorValue} onChange={handleEditorChange}>
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
};

export default RichTextEditor;