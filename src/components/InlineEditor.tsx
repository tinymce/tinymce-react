import * as React from "react";

export interface IHelloProps { compiler: string; framework: string; }

export class InlineEditor extends React.Component <IHelloProps, {}> {

  public render() {
    return <h1>This is inline component!</h1>;
  }
}
