import * as React from "react";

export interface HelloProps { compiler: string; framework: string; }

export class InlineEditor extends React.Component <HelloProps, {}> {

  render () {
    return <h1>This is inline component!</h1>;
  }
}