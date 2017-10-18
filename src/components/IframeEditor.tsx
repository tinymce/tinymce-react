import * as React from "react";

export interface IHelloProps { compiler: string; framework: string; }

export const IframeEditor = (props: IHelloProps) => <h1>This is iframe component!</h1>;
