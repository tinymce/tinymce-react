import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Editor} from '@tinymce/tinymce-react';

import {content} from './FakeContent'


class App extends Component {
  constructor() {
    super();
    this.state = {
      content: content,
      inline: false,
      editing: true
    }
  }
  handleOnChange = (e, editor) => {
    console.log(e)
    this.setState({content: editor.getContent()})
  }

  toggleEditing = () => this.setState({ editing: !this.state.editing })
  toggleInline = () => this.setState({ inline: !this.state.inline })

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Testing tinymce-react</h1>
        </header>
        <div className="App-content">
        {
          this.state.editing
          ? <Editor
              inline={this.state.inline}
              init={{plugins: 'table', height: 500 }} 
              initialValue={this.state.content}
              onChange={this.handleOnChange}
            />
          : <div 
              dangerouslySetInnerHTML={{__html: this.state.content}}
            />
        }

        <button onClick={this.toggleEditing}>{this.state.editing ? 'Stop editing' : 'Edit'}</button>
        {this.state.editing ? '' : <button onClick={this.toggleInline}>{this.state.inline ? 'Inline' : 'Iframe'}</button>}
        </div>
      </div>
    );
  }
}

export default App;
