import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Editor} from '@tinymce/tinymce-react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      content: 'Hello <b>bold</b> world'
    }
  }
  handleOnChange = (content) => {
    this.setState({content: content})
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Testing tinymce-react</h1>
        </header>
        <div className="App-content">
          <h3>Iframe Editor</h3>
          <Editor id="test2" value={this.state.content} onChange={this.handleOnChange} />
          <h3>Inline Editor</h3>
          <Editor id="test" inline value={this.state.content} onChange={this.handleOnChange} />
        </div>
      </div>
    );
  }
}

export default App;
