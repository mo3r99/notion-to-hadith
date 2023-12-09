import React from 'react'
import MDEditor from '@uiw/react-md-editor';

function MarkdownEditor() {
  const [value, setValue] = React.useState("**Input notion text here**");
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} style={{ whiteSpace: 'pre-wrap' }} />
    </div>
  );
}

export default MarkdownEditor