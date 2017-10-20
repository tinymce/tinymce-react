//@ts-check

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Editor} from '@tinymce/tinymce-react';

import {content} from './FakeContent'

// To use tinymce bundled with 
// import 'tinymce';
// import 'tinymce/themes/modern';
// import 'tinymce/plugins/table'


class App extends Component {
  constructor() {
    super();
    this.state = {
      content: content,
      editing: false
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
              id="myEditor"
              inline
              init={{plugins: 'table', skin_url: `${process.env.PUBLIC_URL}/skins/lightgray`, height: 500 }} 
              value={this.state.content} 
              onChange={this.handleOnChange}
              onKeyup={e => e.keyCode === 27 ? this.toggleEditing() : () => ({})}
            />
          : <div 
              dangerouslySetInnerHTML={{__html: this.state.content}}
              onDoubleClick={this.toggleEditing}
            />
        }

        <button onClick={this.toggleEditing}>Edit</button>
        
        {/*<h3>Inline Editor</h3>
          <Editor id="test" inline value={this.state.content} onChange={this.handleOnChange} />*/}
        </div>
      </div>
    );
  }
}

export default App;
