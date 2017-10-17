import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Editor} from '@tinymce/tinymce-react';

class App extends Component {
  handleOnChange(content) {
    console.log(content)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Testing tinymce-react</h1>
        </header>
        <Editor id="test" inline onChange={this.handleOnChange.bind(this)} />
        <Editor id="test2" onChange={this.handleOnChange.bind(this)} />
      </div>
    );
  }
}

export default App;
