/* tslint:disable:no-console */
import { setDefaults, withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Editor } from '../src/main/ts';
import { content } from './fakeContent';

const apiKey = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';

setDefaults({
  inline: true,
  source: false,
  propTables: false
});

class StateFulEditor extends React.Component<any, { data: string }> {
  constructor(props) {
    super(props);
    this.state = {
      data: '<p>hello</p>'
    };
  }

  public handleChange(data: string) {
    this.setState({ data });
  }

  public render() {
    const textareaStyle = { width: '100%', height: '200px', fontSize: '1em' };
    return (
      <div>
        <Editor apiKey={apiKey} plugins='table' value={this.state.data} onEditorChange={(e) => this.handleChange(e)} />
        <textarea style={textareaStyle} value={this.state.data} onChange={(e) => this.handleChange(e.target.value)} />
      </div>
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
class DisablingEditor extends React.Component<any, { disabled: boolean }> {
  constructor(props) {
    super(props);
    this.state = { disabled: false };
  }

  public toggleDisabled() {
    this.setState({ disabled: !this.state.disabled });
  }

  public render() {
    console.log(this.state.disabled);
    return (
      <div>
        <Editor apiKey={apiKey} disabled={this.state.disabled} />
        <button onClick={this.toggleDisabled.bind(this)}>{this.state.disabled ? 'enable' : 'disable'}</button>
      </div>
    );
  }
}

storiesOf('Editor', module)
  .add(
    'Controlled input editor',
    withInfo({
      text: 'Simple iframe editor with some initial html value. Logs editor content on change event.'
    })(() => <StateFulEditor />)
  )
  .add(
    'Iframe editor',
    withInfo({
      text: 'Simple iframe editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor apiKey={apiKey} initialValue={content} onChange={(event, editor) => console.log(editor.getContent())} plugins='link table' />)
  )
  .add(
    'Inline init editor',
    withInfo({
      text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor apiKey={apiKey} init={{ inline: true, plugins: 'link table wordcount', toolbar: 'bold link table' }} />)
  )
  .add(
    'Inline editor',
    withInfo({
      text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor apiKey={apiKey} inline plugins='link table wordcount' toolbar='bold link table' />)
  )
  .add(
    'Disabled editor',
    withInfo({
      text: 'Simple disabled editor.'
    })(() => <Editor apiKey={apiKey} disabled />)
  )
  .add(
    'Disable editor dynamically with button',
    withInfo({
      text: `Shows example with setting the editor into readonly mode using the disabled prop. This is usage:

      class DisablingEditor extends React.Component {
        constructor(props) {
          super(props);
          this.state = { disabled: false };
        }

        public toggleDisabled() {
          this.setState({ disabled: !this.state.disabled });
        }

        public render() {
          console.log(this.state.disabled);
          return (
            <div>
              <Editor disabled={this.state.disabled} />
              <button onClick={this.toggleDisabled.bind(this)}>{this.state.disabled ? 'enable' : 'disable'}</button>
            </div>
          );
        }
      }
      `
    })(() => <DisablingEditor />)
  )
  .add(
    'editor with cloudchannel fixed to 4',
    withInfo({
      text: 'Editor with cloudChannel set to 4'
    })(() => <Editor apiKey={apiKey} cloudChannel='4' onChange={(event, editor) => console.log(editor.getContent())} />)
  )
  .add(
    'editor with cloudchannel fixed to 5-dev',
    withInfo({
      text: 'Editor with cloudChannel set to 5-dev, please make sure to reload page to load tinymce 5'
    })(() => <Editor apiKey={apiKey} cloudChannel='5-dev' onChange={(event, editor) => console.log(editor.getContent())} />)
  );
