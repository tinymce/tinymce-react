import { StoryObj } from '@storybook/react';
import React from 'react';
import { EditorEvent, Events, Editor as TinyMCEEditor } from 'tinymce';
import { Editor, IAllProps } from '../main/ts/components/Editor';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
const initialValue = `
<h2>Full-featured rich text editing experience</h2>
<p>No matter what you're building, TinyMCE has got you covered.</p>
`.trim();

/** Assigning this on a StoryObj will allow its args to be modified. */
const argTypes = {
  // Define arg types that need it, i.e. ones that haven't got a good default:
  plugins: { control: { type: 'text' }},
  toolbar: { control: { type: 'text' }},
  cloudChannel: { control: { type: 'text' }},
  rollback: { control: { type: 'number' }}
};

export default {
  title: 'Editor',
  component: Editor,
  parameters: {
    actions: {
      disable: true
    }
  }
};

export const IframeEditor: StoryObj<Editor> = {
  args: {
    apiKey,
    initialValue,
  },
  argTypes,
};

export const InlineEditor: StoryObj<Editor> = {
  args: {
    apiKey,
    initialValue,
    inline: true,
  },
  argTypes,
  render: (args) => (
    <div style={{ paddingTop: '100px' }}>
      <Editor
        {...args as IAllProps}
      />
    </div>
  )
};

export const ControlledInput: StoryObj<Editor> = {
  render: () => {
    const [ data, setData ] = React.useState(initialValue);
    return (
      <div>
        <Editor
          apiKey={apiKey}
          value={data}
          onEditorChange={(e) => {
            setData(e);
          }}
        />
        <textarea
          style={{ width: '100%', height: '200px' }}
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
      </div>
    );
  }
};

// The editor will enforce a value that is given to it.
// Note that the value must be valid HTML or it will forever correcting it and then rolling back the change.
export const ControlledInputFixed: StoryObj<Editor> = {
  render: () =>
    <Editor
      apiKey={apiKey}
      value='<p>This value is <strong>fixed</strong> and can not be <em>changed</em>.</p>'
    />
};

export const ControlledInputLimitLength: StoryObj<Editor> = {
  render: () => {
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
  }
};

export const ToggleDisabledProp: StoryObj<Editor> = {
  render: () => {
    const [ disabled, setDisabled ] = React.useState(true);
    const toggleDisabled = () => setDisabled((prev) => !prev);
    return (
      <div>
        <Editor
          apiKey={apiKey}
          initialValue={initialValue}
          disabled={disabled}
        />
        <button onClick={toggleDisabled}>
          {disabled ? 'Enable Editor' : 'Disable Editor'}
        </button>
      </div>
    );
  }
};

export const CloudChannelSetTo5Dev: StoryObj<Editor> = {
  name: 'Cloud Channel Set To "6-dev"',
  render: () => (
    <div>
      <Editor
        apiKey={apiKey}
        cloudChannel='6-dev'
        initialValue={initialValue}
      />
      <p>Refresh the page to ensure a load from the "6-dev" channel</p>
    </div>
  )
};
