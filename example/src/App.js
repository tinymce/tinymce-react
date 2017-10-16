import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Hello, IframeEditor, InlineEditor} from '@tinymce/tinymce-react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Testing tinymce-react</h1>
        </header>
        <Hello />
        <IframeEditor />
        <InlineEditor />
      </div>
    );
  }
}

export default App;
