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
      editing: true
    }
  }
  handleOnChange = (e, editor) => {
    console.log(e)
    this.setState({content: editor.getContent()})
  }

  toggleEditing = () =>this.setState({ editing: !this.state.editing })

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
              inline
              init={{plugins: 'table', height: 500 }} 
              value={this.state.content}
              onChange={this.handleOnChange}
            />
          : <div 
              dangerouslySetInnerHTML={{__html: this.state.content}}
            />
        }

        <button onClick={this.toggleEditing}>{this.state.editing ? 'Stop editing' : 'Edit'}</button>
        </div>
      </div>
    );
  }
}

export default App;
