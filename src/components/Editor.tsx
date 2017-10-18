import * as React from "react";

// import tinymce from 'tinymce';

declare const tinymce: any;

export interface IEditorProps { id: string; inline: boolean; tinymce: any; onChange: any; }
export interface IEditorState { editor: any; }

export class Editor extends React.Component <IEditorProps, IEditorState> {
  constructor() {
    super();
    this.state = {
      editor: null,
    };
  }

  public componentDidMount() {
    tinymce.init({
      selector: `#${this.props.id}`,
      inline: this.props.inline,
      setup: (editor: any) => {
        this.setState({editor});
        editor.on("change", (e: any) => {
          this.props.onChange(editor.getContent());
        });
      },
    });
  }

  public render() {
    return (this.props.inline ?
      <div id={this.props.id}></div> :
      <textarea id={this.props.id}></textarea>
    );
  }
}
