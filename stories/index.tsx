/* tslint:disable:no-console */
import { setDefaults, withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Editor } from '../src';
import { content } from './fakeContent';

setDefaults({
  inline: true,
  source: true,
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

  public componentDidMount() {
    setTimeout(() => {
      this.setState({ data: '<p>new content2</p>' });
    }, 100);
    setTimeout(() => {
      this.setState({ data: '<p>new content3</p>' });
    }, 1000);
    setTimeout(() => {
      this.setState({ data: '<p>new content1</p>' });
    }, 0);
  }

  public render() {
    const textareaStyle = { width: '100%', height: '200px', fontSize: '1em' };
    return (
      <div>
        <Editor {...this.props} value={this.state.data} onEditorChange={(e) => this.handleChange(e)} />
        <textarea style={textareaStyle} value={this.state.data} onChange={(e) => this.handleChange(e.target.value)} />
      </div>
    );
  }
}

storiesOf('Editor', module)
  .add(
    'Controlled input editor',
    withInfo({
      text: 'Simple iframe editor with some initial html value. Logs editor content on change event.'
    })(() => <StateFulEditor plugins="table" />)
  )
  .add(
    'Iframe editor',
    withInfo({
      text: 'Simple iframe editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor initialValue={content} onChange={(event, editor) => console.log(editor.getContent())} plugins="link table" />)
  )
  .add(
    'Inline init editor',
    withInfo({
      text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor init={{ inline: true, plugins: 'link table wordcount', toolbar: 'bold link table' }} />)
  )
  .add(
    'Inline editor',
    withInfo({
      text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
    })(() => <Editor inline plugins="link table wordcount" toolbar="bold link table" />)
  )
  .add(
    'Inlite editor',
    withInfo({
      text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
    })(() => (
      <Editor inline init={{ theme: 'inlite' }} initialValue={content} onChange={(event, editor) => console.log(editor.getContent())} />
    ))
  );
