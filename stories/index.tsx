import { setDefaults, withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { EditorEvent, Events, Editor as TinyMCEEditor } from 'tinymce';

import { Editor } from '../src/main/ts';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
const sampleContent = `
<h2 style="text-align: center;">
  TinyMCE provides a <span style="text-decoration: underline;"
  >full-featured</span> rich text editing experience, and a featherweight download.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;"
  >No matter what you're building, TinyMCE has got you covered.</span></span></strong>
</p>`;

setDefaults({
  inline: true,
  source: false,
  propTables: false,
  header: false
});

const ControlledInput = () => {
  const [ data, setData ] = React.useState(sampleContent);
  return (
    <div>
      <Editor
        apiKey={apiKey}
        init={{ height: 300 }}
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

const ControlledInputFixed = () => (
  <div>
    <Editor
      apiKey={apiKey}
      init={{ height: 300 }}
      value={'<p>The quick brown fox</p>'}
    />
  </div>
);

const ControlledInputLimitLength = () => {
  const sizeLimit = 20;
  const [ data, setData ] = React.useState('<p>Hello world</p>');
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
        init={{ height: 300 }}
        value={data}
        onEditorChange={handleUpdate}
        onBeforeAddUndo={handleBeforeAddUndo}
        onInit={handleInit}
      />
      <p>Remaining: {sizeLimit - len}</p>
    </div>
  );
};

const Disable = () => {
  const [ disabled, setDisabled ] = React.useState(true);
  const toggleDisabled = () => setDisabled((prev) => !prev);
  return (
    <div>
      <button onClick={toggleDisabled}>
        {disabled ? 'enable' : 'disable'}
      </button>
      <Editor
        apiKey={apiKey}
        init={{ height: 300 }}
        initialValue={sampleContent}
        disabled={disabled}
      />
    </div>
  );
};

storiesOf('tinymce-react', module)
  .add(
    'Iframe editor',
    withInfo({
      text: 'Iframe editor.'
    })(() =>
      <Editor
        apiKey={apiKey}
        initialValue={sampleContent}
        init={{ height: 300 }}
      />
    )
  )
  .add(
    'Inline editor',
    withInfo({
      text: 'Inline editor.'
    })(() =>
      <div style={{ paddingTop: '100px' }}>
        <Editor
          apiKey={apiKey}
          initialValue={sampleContent}
          inline
        />
      </div>
    )
  )
  .add(
    'Controlled input',
    withInfo({
      text: 'Example of usage as as a controlled component.'
    })(() => <ControlledInput />)
  )
  .add(
    'Controlled input fixed',
    withInfo({
      text: 'Example of usage as as a controlled component with a fixed value.'
    })(() => <ControlledInputFixed />)
  )
  .add(
    'Controlled input limited length',
    withInfo({
      text: 'Example of usage as as a controlled component with a limited length.'
    })(() => <ControlledInputLimitLength />)
  )
  .add(
    'Disable button',
    withInfo({
      text: `Example with setting the editor into readonly mode using the disabled prop.`
    })(() => <Disable />)
  )
  .add(
    'cloudChannel set to 5-dev',
    withInfo({
      text: 'Editor with cloudChannel set to 5-dev, please make sure to reload page to load TinyMCE 5.'
    })(() =>
      <Editor
        apiKey={apiKey}
        cloudChannel='5-dev'
        initialValue={sampleContent}
        init={{ height: 300 }}
      />
    )
  );
