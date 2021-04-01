import React from 'react';
import { EditorEvent, Events, Editor as TinyMCEEditor } from 'tinymce';

import { Story } from '@storybook/react';

import { Editor } from '../main/ts/components/Editor';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
const sampleContent = `
<h2>Full-featured rich text editing experience</h2>
<p>No matter what you're building, TinyMCE has got you covered.</p>
`;

export default {
  title: 'Editor',
  component: Editor,
};

export const IframeEditor: Story = () => (
  <Editor
    apiKey={apiKey}
    initialValue={sampleContent}
  />
);
IframeEditor.parameters = {
  controls: { hideNoControlsWarning: true },
};

export const InlineEditor: Story = () => (
  <div style={{ paddingTop: '100px' }}>
    <Editor
      apiKey={apiKey}
      initialValue={sampleContent}
      inline
    />
  </div>
);
InlineEditor.parameters = {
  controls: { hideNoControlsWarning: true },
};

export const ControlledInput: Story = () => {
  const [ data, setData ] = React.useState(sampleContent);
  return (
    <div>
      <Editor
        apiKey={apiKey}
        value={data}
        onEditorChange={(e) => setData(e)}
      />
      <textarea
        style={{ width: '100%', height: '200px' }}
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
    </div>
  );
};
ControlledInput.parameters = {
  controls: { hideNoControlsWarning: true },
};

// The editor will enforce a value that is given to it.
// Note that the value must be valid HTML or it will forever correcting it and then rolling back the change.
export const ControlledInputFixed: Story = () => (
  <div>
    <Editor
      apiKey={apiKey}
      value={'<p>This value is <strong>fixed</strong> and can not be <em>changed</em>.</p>'}
    />
  </div>
);
ControlledInputFixed.parameters = {
  controls: { hideNoControlsWarning: true },
};

export const ControlledInputLimitLength: Story = () => {
  const sizeLimit = 50;
  const [ data, setData ] = React.useState('<p>This field can only take 50 characters.</p>');
  const [ len, setLen ] = React.useState(0);

  const handleInit = (evt: unknown, editor: TinyMCEEditor) => {
    setLen(editor.getContent({ format: 'text' }).length);
  };

  const handleUpdate = (value: string, editor: TinyMCEEditor) => {
    const length = editor.getContent({ format: 'text' }).length;
    if (length <= sizeLimit) {
      setData(value);
      setLen(length);
    }
  };

  const handleBeforeAddUndo = (evt: EditorEvent<Events.EditorEventMap['BeforeAddUndo']>, editor: TinyMCEEditor) => {
    const length = editor.getContent({ format: 'text' }).length;
    // note that this is the opposite test as in handleUpdate
    // because we are determining when to deny adding an undo level
    if (length > sizeLimit) {
      evt.preventDefault();
    }
  };

  return (
    <div>
      <Editor
        apiKey={apiKey}
        value={data}
        onEditorChange={handleUpdate}
        onBeforeAddUndo={handleBeforeAddUndo}
        onInit={handleInit}
      />
      <p>Remaining: {sizeLimit - len}</p>
    </div>
  );
};
ControlledInputLimitLength.parameters = {
  controls: { hideNoControlsWarning: true },
};

export const ToggleDisabledProp: Story = () => {
  const [ disabled, setDisabled ] = React.useState(true);
  const toggleDisabled = () => setDisabled((prev) => !prev);
  return (
    <div>
      <Editor
        apiKey={apiKey}
        initialValue={sampleContent}
        disabled={disabled}
      />
      <button onClick={toggleDisabled}>
        {disabled ? 'Enable Editor' : 'Disable Editor'}
      </button>
    </div>
  );
};
ToggleDisabledProp.parameters = {
  controls: { hideNoControlsWarning: true },
};

export const CloudChannelSetTo5Dev: Story = () => (
  <div>
    <Editor
      apiKey={apiKey}
      cloudChannel='5-dev'
      initialValue={sampleContent}
    />
    <p>Refresh the page to ensure a load from the "5-dev" channel</p>
  </div>
);
CloudChannelSetTo5Dev.storyName = 'Cloud Channel Set To "5-dev"';
CloudChannelSetTo5Dev.parameters = {
  controls: { hideNoControlsWarning: true },
};