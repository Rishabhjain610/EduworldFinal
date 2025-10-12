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
import { useState } from "react";

// This component is now a clean, reusable rich text editor.
// The AI generation logic has been moved to the components that use it.
const RichTextEditor = ({ onRichTextEditorChange, value, index }) => {
  const [editorValue, setEditorValue] = useState(value);

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