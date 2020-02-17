import { setDefaults, withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

import { Editor } from '../src/main/ts';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
const sampleContent = `
<h2 style="text-align: center;">
  TinyMCE provides a <span style="text-decoration: underline;">full-featured</span> rich text editing experience, and a featherweight download.
</h2>
<p style="text-align: center;">
  <strong><span style="font-size: 14pt;"><span style="color: #7e8c8d; font-weight: 600;">No matter what you're building, TinyMCE has got you covered.</span></span></strong>
</p>`;

setDefaults({
  inline: true,
  source: false,
  propTables: false,
  header: false
});

class ControlledInput extends React.Component<any, { data: string }> {
  constructor(props) {
    super(props);
    this.state = {
      data: sampleContent
    };
  }

  public handleChange(data: string) {
    this.setState({ data });
  }

  public render() {
    const textareaStyle = { width: '100%', height: '200px' };
    return (
      <div>
        <Editor
          apiKey={apiKey}
          init={{ height: 300 }}
          value={this.state.data}
          onEditorChange={(e) => this.handleChange(e)}
        />
        <textarea
          style={textareaStyle}
          value={this.state.data}
          onChange={(e) => this.handleChange(e.target.value)}
        />
      </div>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class Disable extends React.Component<any, { disabled: boolean }> {
  constructor(props) {
    super(props);
    this.state = { disabled: true };
  }

  public toggleDisabled() {
    this.setState({ disabled: !this.state.disabled });
  }

  public render() {
    // tslint:disable-next-line:no-console
    console.log(this.state.disabled);
    return (
      <div>
        <button onClick={this.toggleDisabled.bind(this)}>
          {this.state.disabled ? 'enable' : 'disable'}
        </button>
        <Editor
          apiKey={apiKey}
          init={{ height: 300 }}
          initialValue={sampleContent}
          disabled={this.state.disabled}
        />
      </div>
    );
  }
}

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
    'Disable button',
    withInfo({
      text: `Example with setting the editor into readonly mode using the disabled prop.`
    })(() => <Disable />)
  )
  .add(
    'cloudChannel set to 5-dev',
    withInfo({
      text: 'Editor with cloudChannel set to 5-dev, please make sure to reload page to load tinymce 5.'
    })(() =>
      <Editor
        apiKey={apiKey}
        cloudChannel='5-dev'
        initialValue={sampleContent}
        init={{ height: 300 }}
      />
    )
  );
